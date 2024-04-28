import dotenv from "dotenv";
import { InstanceManager } from "./src/instance-manager";

dotenv.config();

const args = process.argv.slice(2);
const commands = ["destroy", "create", "list", "remove"];

let command: null | string = null;

if (args.length > 0 && commands.includes(args[0])) {
  command = args[0];
}

async function main() {
  const config = {
    tsAuthKey: process.env.TS_AUTH_KEY!,
    vultrApiKey: process.env.VULTR_API_KEY!,
    pulumiPassphrase: process.env.PULUMI_CONFIG_PASSPHRASE!,
  };

  const stackName = "dev";
  const projectName = "tailportal";

  const instanceManager = new InstanceManager(config, stackName, projectName);
  await instanceManager.initializeStack();

  switch (command) {
    case "destroy": {
      await instanceManager.destroyStack();
      return process.exit(0);
    }
    case "create": {
      const provider = "vultr";
      const region = "sgp";
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
    default: {
      // up stack
      await instanceManager.upStack();
    }
  }
}

main().catch((err) => console.error(err));
