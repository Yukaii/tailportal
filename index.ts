import { LocalWorkspace } from "@pulumi/pulumi/automation";
import * as vultr from "@ediri/vultr";
import dotenv from "dotenv";

dotenv.config();

import { cloudConfigString } from "./cloud-config";

const args = process.argv.slice(2);
let destroy = false;
if (args.length > 0 && args[0]) {
  destroy = args[0] === "destroy";
}

async function program() {
  const regionsResult = (await fetch("https://api.vultr.com/v2/regions").then(
    (r) => r.json(),
  )) as { regions: vultr.GetRegionResult[] };

  const userData = cloudConfigString.replace(
    /\$TS_AUTH_KEY/,
    process.env.TS_AUTH_KEY!,
  );

  const instanceResource = new vultr.Instance("instanceResource", {
    // alpine
    osId: 2136,
    plan: "vc2-1c-1gb",
    region: "sgp",
    backups: "disabled",
    userData,
    activationEmail: false,
  });

  return {
    hostname: instanceResource.hostname,
  };
}

async function main() {
  const stack = await LocalWorkspace.createOrSelectStack({
    program,
    projectName: "tail-portal",
    stackName: "dev",
  });

  if (destroy) {
    console.info("destroying stack...");
    await stack.destroy({ onOutput: console.info });
    console.info("stack destroy complete");
    process.exit(0);
  }

  await stack.up({ onOutput: console.log });
}

main().then((err) => console.error(err));
