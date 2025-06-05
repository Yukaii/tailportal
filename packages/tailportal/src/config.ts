import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Config } from "./types";

/**
 * Interpolates environment variables in a string.
 * Supports format: $ENV_VAR_NAME
 */
function interpolateEnvVars(value: string): string {
  return value.replace(/\$([A-Z_][A-Z0-9_]*)/g, (match, envVarName) => {
    return process.env[envVarName] || match;
  });
}

/**
 * Recursively interpolates environment variables in an object.
 */
function interpolateObject(obj: any): any {
  if (typeof obj === "string") {
    return interpolateEnvVars(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(interpolateObject);
  }
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = interpolateObject(value);
    }
    return result;
  }
  return obj;
}

/**
 * Attempts to load configuration from JSON files.
 * Looks for configuration files in the following order:
 * 1. ./tailportal.json
 * 2. ./.tailportal.json
 * 3. ~/.tailportal.json
 */
function loadJsonConfig(): Partial<Config> | null {
  const configPaths = [
    "./tailportal.json",
    "./.tailportal.json", 
    join(process.env.HOME || "~", ".tailportal.json")
  ];

  for (const configPath of configPaths) {
    try {
      if (existsSync(configPath)) {
        const configContent = readFileSync(configPath, "utf-8");
        const rawConfig = JSON.parse(configContent);
        // Interpolate environment variables in the config
        const interpolatedConfig = interpolateObject(rawConfig);
        return interpolatedConfig;
      }
    } catch (error) {
      // Silently continue to next path if file exists but is invalid
      console.warn(`Warning: Failed to parse config file ${configPath}:`, error);
    }
  }

  return null;
}

/**
 * Loads configuration from environment variables (existing behavior).
 */
function loadEnvConfig(): Partial<Config> {
  return {
    tsAuthKey: process.env.TS_AUTH_KEY,
    pulumiPassphrase: process.env.PULUMI_CONFIG_PASSPHRASE,
    vultrApiKey: process.env.VULTR_API_KEY,
    googleProject: process.env.GOOGLE_PROJECT,
    googleCredentials: process.env.GOOGLE_CREDENTIALS,
  };
}

/**
 * Validates that required configuration fields are present.
 */
function validateConfig(config: Partial<Config>): Config {
  if (!config.tsAuthKey) {
    throw new Error("TS_AUTH_KEY environment variable is required");
  }

  if (!config.pulumiPassphrase) {
    throw new Error("PULUMI_CONFIG_PASSPHRASE environment variable is required");
  }

  return {
    tsAuthKey: config.tsAuthKey,
    pulumiPassphrase: config.pulumiPassphrase,
    vultrApiKey: config.vultrApiKey,
    googleProject: config.googleProject,
    googleCredentials: config.googleCredentials,
  };
}

/**
 * Loads configuration from JSON file (if available) or environment variables.
 * JSON configuration takes precedence over environment variables.
 */
export function loadConfig(): Config {
  // Try to load from JSON first
  const jsonConfig = loadJsonConfig();
  
  // Load from environment variables
  const envConfig = loadEnvConfig();
  
  // Merge configurations (JSON takes precedence)
  const mergedConfig = { ...envConfig, ...jsonConfig };
  
  // Validate and return
  return validateConfig(mergedConfig);
}