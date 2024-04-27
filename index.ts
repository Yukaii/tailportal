import dotenv from "dotenv";
import { InstanceManager } from "./src/instance-manager";

dotenv.config();

const args = process.argv.slice(2);
const destroy = args.length > 0 && args[0] === "destroy";
const create = args.length > 0 && args[0] === "create";

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

  if (destroy) {
    await instanceManager.destroyStack();
    process.exit(0);
  } else if (create) {
    await instanceManager.createInstance("vultr", "sgp");
  } else {
    // sync up
    await instanceManager.upStack();
  }
}

main().catch((err) => console.error(err));
