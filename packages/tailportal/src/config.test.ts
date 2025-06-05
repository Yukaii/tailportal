import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { loadConfig } from './config';

// Create a temporary directory for test files
let testDir: string;
let originalEnv: NodeJS.ProcessEnv;
let originalHome: string | undefined;
let originalXdgConfigHome: string | undefined;

describe('Configuration Loading', () => {
  beforeEach(() => {
    // Create a unique test directory
    testDir = join(tmpdir(), `tailportal-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testDir, { recursive: true });
    
    // Store original environment
    originalEnv = { ...process.env };
    originalHome = process.env.HOME;
    originalXdgConfigHome = process.env.XDG_CONFIG_HOME;
    
    // Set up test environment
    process.env.HOME = testDir;
    delete process.env.XDG_CONFIG_HOME;
    
    // Clear any existing config environment variables
    delete process.env.TS_AUTH_KEY;
    delete process.env.PULUMI_CONFIG_PASSPHRASE;
    delete process.env.VULTR_API_KEY;
    delete process.env.GOOGLE_PROJECT;
    delete process.env.GOOGLE_CREDENTIALS;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    if (originalHome !== undefined) {
      process.env.HOME = originalHome;
    }
    if (originalXdgConfigHome !== undefined) {
      process.env.XDG_CONFIG_HOME = originalXdgConfigHome;
    }
    
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Environment Variable Configuration', () => {
    test('should load required config from environment variables', () => {
      process.env.TS_AUTH_KEY = 'test-ts-key';
      process.env.PULUMI_CONFIG_PASSPHRASE = 'test-pulumi-pass';
      
      const config = loadConfig();
      
      assert.strictEqual(config.tsAuthKey, 'test-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'test-pulumi-pass');
      assert.strictEqual(config.vultrApiKey, undefined);
      assert.strictEqual(config.googleProject, undefined);
      assert.strictEqual(config.googleCredentials, undefined);
    });

    test('should load optional config from environment variables', () => {
      process.env.TS_AUTH_KEY = 'test-ts-key';
      process.env.PULUMI_CONFIG_PASSPHRASE = 'test-pulumi-pass';
      process.env.VULTR_API_KEY = 'test-vultr-key';
      process.env.GOOGLE_PROJECT = 'test-project';
      process.env.GOOGLE_CREDENTIALS = 'test-credentials';
      
      const config = loadConfig();
      
      assert.strictEqual(config.tsAuthKey, 'test-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'test-pulumi-pass');
      assert.strictEqual(config.vultrApiKey, 'test-vultr-key');
      assert.strictEqual(config.googleProject, 'test-project');
      assert.strictEqual(config.googleCredentials, 'test-credentials');
    });

    test('should throw error when TS_AUTH_KEY is missing', () => {
      process.env.PULUMI_CONFIG_PASSPHRASE = 'test-pulumi-pass';
      
      assert.throws(() => {
        loadConfig();
      }, /TS_AUTH_KEY environment variable is required/);
    });

    test('should throw error when PULUMI_CONFIG_PASSPHRASE is missing', () => {
      process.env.TS_AUTH_KEY = 'test-ts-key';
      
      assert.throws(() => {
        loadConfig();
      }, /PULUMI_CONFIG_PASSPHRASE environment variable is required/);
    });
  });

  describe('JSON Configuration Files', () => {
    test('should load config from ~/.tailportal.json', () => {
      const configPath = join(testDir, '.tailportal.json');
      const configData = {
        tsAuthKey: 'json-ts-key',
        pulumiPassphrase: 'json-pulumi-pass',
        vultrApiKey: 'json-vultr-key'
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      assert.strictEqual(config.tsAuthKey, 'json-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'json-pulumi-pass');
      assert.strictEqual(config.vultrApiKey, 'json-vultr-key');
    });

    test('should load config from ~/.config/tailportal/config.json', () => {
      const configDir = join(testDir, '.config', 'tailportal');
      mkdirSync(configDir, { recursive: true });
      
      const configPath = join(configDir, 'config.json');
      const configData = {
        tsAuthKey: 'xdg-ts-key',
        pulumiPassphrase: 'xdg-pulumi-pass',
        googleProject: 'xdg-project'
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      assert.strictEqual(config.tsAuthKey, 'xdg-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'xdg-pulumi-pass');
      assert.strictEqual(config.googleProject, 'xdg-project');
    });

    test('should load config from custom XDG_CONFIG_HOME', () => {
      const customXdgDir = join(testDir, 'custom-xdg');
      process.env.XDG_CONFIG_HOME = customXdgDir;
      
      const configDir = join(customXdgDir, 'tailportal');
      mkdirSync(configDir, { recursive: true });
      
      const configPath = join(configDir, 'config.json');
      const configData = {
        tsAuthKey: 'custom-xdg-ts-key',
        pulumiPassphrase: 'custom-xdg-pulumi-pass'
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      assert.strictEqual(config.tsAuthKey, 'custom-xdg-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'custom-xdg-pulumi-pass');
    });

    test('should prioritize XDG config over ~/.tailportal.json', () => {
      // Create both config files
      const configDir = join(testDir, '.config', 'tailportal');
      mkdirSync(configDir, { recursive: true });
      
      // XDG config
      const xdgConfigPath = join(configDir, 'config.json');
      writeFileSync(xdgConfigPath, JSON.stringify({
        tsAuthKey: 'xdg-key',
        pulumiPassphrase: 'xdg-pass'
      }));
      
      // Legacy config
      const legacyConfigPath = join(testDir, '.tailportal.json');
      writeFileSync(legacyConfigPath, JSON.stringify({
        tsAuthKey: 'legacy-key',
        pulumiPassphrase: 'legacy-pass'
      }));
      
      const config = loadConfig();
      
      // Should use XDG config
      assert.strictEqual(config.tsAuthKey, 'xdg-key');
      assert.strictEqual(config.pulumiPassphrase, 'xdg-pass');
    });

    test('should handle invalid JSON gracefully', () => {
      const configPath = join(testDir, '.tailportal.json');
      writeFileSync(configPath, '{ invalid json }');
      
      // Set environment variables as fallback
      process.env.TS_AUTH_KEY = 'env-ts-key';
      process.env.PULUMI_CONFIG_PASSPHRASE = 'env-pulumi-pass';
      
      const config = loadConfig();
      
      // Should fall back to environment variables
      assert.strictEqual(config.tsAuthKey, 'env-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'env-pulumi-pass');
    });
  });

  describe('Environment Variable Interpolation', () => {
    test('should interpolate environment variables in JSON config', () => {
      process.env.TEST_TS_KEY = 'interpolated-ts-key';
      process.env.TEST_VULTR_KEY = 'interpolated-vultr-key';
      
      const configPath = join(testDir, '.tailportal.json');
      const configData = {
        tsAuthKey: '$TEST_TS_KEY',
        pulumiPassphrase: 'direct-pulumi-pass',
        vultrApiKey: '$TEST_VULTR_KEY'
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      assert.strictEqual(config.tsAuthKey, 'interpolated-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'direct-pulumi-pass');
      assert.strictEqual(config.vultrApiKey, 'interpolated-vultr-key');
    });

    test('should leave undefined environment variables as-is', () => {
      const configPath = join(testDir, '.tailportal.json');
      const configData = {
        tsAuthKey: '$UNDEFINED_VAR',
        pulumiPassphrase: 'test-pass'
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      assert.strictEqual(config.tsAuthKey, '$UNDEFINED_VAR');
      assert.strictEqual(config.pulumiPassphrase, 'test-pass');
    });

    test('should interpolate variables in nested objects', () => {
      process.env.TEST_NESTED_VAR = 'nested-value';
      
      const configPath = join(testDir, '.tailportal.json');
      const configData = {
        tsAuthKey: 'test-key',
        pulumiPassphrase: 'test-pass',
        googleCredentials: '$TEST_NESTED_VAR'
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      assert.strictEqual(config.googleCredentials, 'nested-value');
    });
  });

  describe('Configuration Precedence', () => {
    test('should prioritize JSON config over environment variables', () => {
      // Set environment variables
      process.env.TS_AUTH_KEY = 'env-ts-key';
      process.env.PULUMI_CONFIG_PASSPHRASE = 'env-pulumi-pass';
      process.env.VULTR_API_KEY = 'env-vultr-key';
      
      // Set JSON config
      const configPath = join(testDir, '.tailportal.json');
      const configData = {
        tsAuthKey: 'json-ts-key',
        pulumiPassphrase: 'json-pulumi-pass'
        // Note: vultrApiKey not specified in JSON, should fall back to env
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      // JSON should take precedence
      assert.strictEqual(config.tsAuthKey, 'json-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'json-pulumi-pass');
      // Environment variable should be used for missing JSON fields
      assert.strictEqual(config.vultrApiKey, 'env-vultr-key');
    });

    test('should merge JSON and environment configurations', () => {
      // Set some environment variables
      process.env.VULTR_API_KEY = 'env-vultr-key';
      process.env.GOOGLE_PROJECT = 'env-google-project';
      
      // Set JSON config with different fields
      const configPath = join(testDir, '.tailportal.json');
      const configData = {
        tsAuthKey: 'json-ts-key',
        pulumiPassphrase: 'json-pulumi-pass',
        googleCredentials: 'json-google-creds'
      };
      
      writeFileSync(configPath, JSON.stringify(configData, null, 2));
      
      const config = loadConfig();
      
      // Should merge both sources
      assert.strictEqual(config.tsAuthKey, 'json-ts-key');
      assert.strictEqual(config.pulumiPassphrase, 'json-pulumi-pass');
      assert.strictEqual(config.vultrApiKey, 'env-vultr-key');
      assert.strictEqual(config.googleProject, 'env-google-project');
      assert.strictEqual(config.googleCredentials, 'json-google-creds');
    });
  });
});