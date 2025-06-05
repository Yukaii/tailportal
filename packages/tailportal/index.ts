#!/usr/bin/env node

import dotenv from "dotenv";
import { InstanceManager } from "./src/instance-manager";
import { regions } from "vultr-types";
import { type CloudProvider, cloudProviders } from "./src/types";
import { program } from "commander";
import { z } from "zod";

dotenv.config();

function validateEnvironment() {
  const tsAuthKey = process.env.TS_AUTH_KEY;
  if (!tsAuthKey) {
    throw new Error("TS_AUTH_KEY environment variable is required");
  }

  const pulumiPassphrase = process.env.PULUMI_CONFIG_PASSPHRASE;
  if (!pulumiPassphrase) {
    throw new Error("PULUMI_CONFIG_PASSPHRASE environment variable is required");
  }

  return { tsAuthKey, pulumiPassphrase };
}

const stackName = "dev";
const projectName = "tailportal";

// Add help and version to the program
program
  .name("tailportal")
  .description("Create a Tailscale exit node with simple commands")
  .version("0.1.0");

program
  .command("create <provider> [region]")
  .description("Create a new instance")
  .action(async (provider: string, region: string | undefined) => {
    const { tsAuthKey, pulumiPassphrase } = validateEnvironment();
    const config = {
      tsAuthKey,
      pulumiPassphrase,
      vultrApiKey: process.env.VULTR_API_KEY,
      googleProject: process.env.GOOGLE_PROJECT,
      googleCredentials: process.env.GOOGLE_CREDENTIALS,
    };

    const createSchema = z.object({
      provider: z.string(),
      region: z.string().optional(),
    });
    const parseResult = createSchema.safeParse({ provider, region });
    if (!parseResult.success) {
      console.error("Invalid input:", parseResult.error.format());
      console.error(`Available providers: ${cloudProviders.join(", ")}`);
      console.error(
        `Available regions: ${regions.map((reg) => reg.id).join(", ")}`,
      );
      process.exit(1);
    }
    const parsed = parseResult.data;
    if (!cloudProviders.includes(parsed.provider as CloudProvider)) {
      console.error(`Invalid provider: ${parsed.provider}`);
      console.error(`Available providers: ${cloudProviders.join(", ")}`);
      process.exit(1);
    }
    const validProvider = parsed.provider as CloudProvider;
    if (!parsed.region || !regions.some((reg) => reg.id === parsed.region)) {
      console.error(`Invalid or missing region: ${parsed.region}`);
      console.error(
        `Available regions: ${regions.map((reg) => reg.id).join(", ")}`,
      );
      process.exit(1);
    }
    const validRegion = parsed.region as (typeof regions)[number]["id"];
    console.debug(
      `creating instance through ${validProvider} in ${validRegion}`,
    );
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    await instanceManager.createInstance(validProvider, validRegion);
    process.exit(0);
  });

program
  .command("destroy")
  .description("Destroy the stack")
  .action(async () => {
    const { tsAuthKey, pulumiPassphrase } = validateEnvironment();
    const config = {
      tsAuthKey,
      pulumiPassphrase,
      vultrApiKey: process.env.VULTR_API_KEY,
      googleProject: process.env.GOOGLE_PROJECT,
      googleCredentials: process.env.GOOGLE_CREDENTIALS,
    };

    
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    await instanceManager.destroyStack();
    process.exit(0);
  });

program
  .command("list")
  .description("List current instances")
  .action(async () => {
    const { tsAuthKey, pulumiPassphrase } = validateEnvironment();
    const config = {
      tsAuthKey,
      pulumiPassphrase,
      vultrApiKey: process.env.VULTR_API_KEY,
      googleProject: process.env.GOOGLE_PROJECT,
      googleCredentials: process.env.GOOGLE_CREDENTIALS,
    };

    
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    console.log(instanceManager.currentInstances);
  });

program
  .command("remove <name>")
  .description("Remove an instance by name")
  .action(async (name: string) => {
    const { tsAuthKey, pulumiPassphrase } = validateEnvironment();
    const config = {
      tsAuthKey,
      pulumiPassphrase,
      vultrApiKey: process.env.VULTR_API_KEY,
      googleProject: process.env.GOOGLE_PROJECT,
      googleCredentials: process.env.GOOGLE_CREDENTIALS,
    };

    
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    await instanceManager.removeInstance(name);
  });

program
  .command("region")
  .description("List available regions")
  .action(() => {
    const regionStrings = regions.map(
      (region) =>
        `${region.id} : ${region.city}, ${region.country} (${region.continent})`,
    );
    console.log(regionStrings.join("\n"));
  });

program
  .command("sync")
  .description("Synchronize the stack with the current state")
  .action(async () => {
    const { tsAuthKey, pulumiPassphrase } = validateEnvironment();
    const config = {
      tsAuthKey,
      pulumiPassphrase,
      vultrApiKey: process.env.VULTR_API_KEY,
      googleProject: process.env.GOOGLE_PROJECT,
      googleCredentials: process.env.GOOGLE_CREDENTIALS,
    };

    
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    await instanceManager.refreshStack();
    await instanceManager.upStack();
  });

program.parse(process.argv);
