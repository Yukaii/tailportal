import dotenv from "dotenv";
import { InstanceManager } from "./src/instance-manager";
import { regions } from "vultr-types";
import type { Region } from "vultr-types/dist/types";
import { type CloudProvider, cloudProviders } from "./src/types";

dotenv.config();

const args = process.argv.slice(2);
const commands = [
  "destroy",
  "create",
  "list",
  "remove",
  "region",
  "help",
  "sync",
];

let command: null | string = null;

if (args.length > 0 && commands.includes(args[0])) {
  command = args[0];
}

async function main() {
  const config = {
    tsAuthKey: process.env.TS_AUTH_KEY!,
    pulumiPassphrase: process.env.PULUMI_CONFIG_PASSPHRASE!,
    vultrApiKey: process.env.VULTR_API_KEY,
    googleProject: process.env.GOOGLE_PROJECT,
    googleCredentials: process.env.GOOGLE_CREDENTIALS,
  };

  const stackName = "dev";
  const projectName = "tailportal";

  switch (command) {
    case "destroy":
    case "create":
    case "list":
    case "remove":
    case "sync": {
      const instanceManager = new InstanceManager(
        config,
        stackName,
        projectName,
      );
      await instanceManager.initializeStack();

      switch (command) {
        case "destroy": {
          await instanceManager.destroyStack();
          return process.exit(0);
        }
        case "create": {
          let provider = args[1] as unknown as CloudProvider;
          if (!provider || !cloudProviders.includes(provider)) {
            provider = "vultr";
          }

          let region = args[2] as unknown as Region["id"];
          if (!region || !regions.map((reg) => reg.id).includes(region)) {
            region = "sgp";
          }

          console.debug(`creating instance through ${provider} in ${region}`);

          await instanceManager.createInstance(provider, region);
          return process.exit(0);
        }
        case "list": {
          const instances = instanceManager.currentInstances;
          console.log(instances);
          return;
        }
        case "remove": {
          const name = args[1];
          await instanceManager.removeInstance(name);
          return;
        }
        case "sync": {
          await instanceManager.refreshStack();
          await instanceManager.upStack();
          return;
        }
      }
      break;
    }
    case "region": {
      const regionStrings = regions.map(
        (region) =>
          `${region.id} : ${region.city}, ${region.country} (${region.continent})`,
      );
      console.log(regionStrings.join("\n"));
      break;
    }
    case "help": {
      displayHelp();
      return;
    }
    default: {
      displayHelp();
      return;
    }
  }
}

function displayHelp() {
  console.log("Usage: npm start [command] [options]");
  console.log("");
  console.log("Commands:");
  console.log("  create [provider] [region]   Create a new instance");
  console.log("  destroy           Destroy the stack");
  console.log("  list              List current instances");
  console.log("  remove [name]     Remove an instance by name");
  console.log("  region            List available regions");
  console.log(
    "  sync              Synchronize the stack with the current state",
  );
  console.log("  help              Display this help message");
  console.log("");
  console.log(
    "Running the command without any arguments will display this help message.",
  );
}

main().catch((err) => console.error(err));
