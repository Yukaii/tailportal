import dotenv from "dotenv";
import { InstanceManager } from "./src/instance-manager";
import { regions } from "vultr-types";
import { type CloudProvider, cloudProviders } from "./src/types";
import { program } from "commander";

dotenv.config();

const tsAuthKey = process.env.TS_AUTH_KEY;
if (!tsAuthKey) {
  throw new Error("TS_AUTH_KEY environment variable is required");
}

const pulumiPassphrase = process.env.PULUMI_CONFIG_PASSPHRASE;
if (!pulumiPassphrase) {
  throw new Error("PULUMI_CONFIG_PASSPHRASE environment variable is required");
}

const config = {
  tsAuthKey,
  pulumiPassphrase,
  vultrApiKey: process.env.VULTR_API_KEY,
  googleProject: process.env.GOOGLE_PROJECT,
  googleCredentials: process.env.GOOGLE_CREDENTIALS,
};

const stackName = "dev";
const projectName = "tailportal";

program
  .command("create <provider> [region]")
  .description("Create a new instance")
  .action(async (provider: string, region: string | undefined) => {
    const validatedProvider: CloudProvider = cloudProviders.includes(
      provider as CloudProvider,
    )
      ? (provider as CloudProvider)
      : "vultr";
    const validatedRegion = (
      region && regions.some((reg) => reg.id === region) ? region : "sgp"
    ) as (typeof regions)[number]["id"];
    console.debug(
      `creating instance through ${validatedProvider} in ${validatedRegion}`,
    );
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    await instanceManager.createInstance(validatedProvider, validatedRegion);
    process.exit(0);
  });

program
  .command("destroy")
  .description("Destroy the stack")
  .action(async () => {
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    await instanceManager.destroyStack();
    process.exit(0);
  });

program
  .command("list")
  .description("List current instances")
  .action(async () => {
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    console.log(instanceManager.currentInstances);
  });

program
  .command("remove <name>")
  .description("Remove an instance by name")
  .action(async (name: string) => {
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
    const instanceManager = new InstanceManager(config, stackName, projectName);
    await instanceManager.initializeStack();
    await instanceManager.refreshStack();
    await instanceManager.upStack();
  });

program
  .command("help")
  .description("Display help message")
  .action(() => {
    program.outputHelp();
  });

program.parse(process.argv);
