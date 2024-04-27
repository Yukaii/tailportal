import * as vultr from "@ediri/vultr";
import { nanoid } from "nanoid";

import type { Config, InstanceInfo, Region } from "./types";
import { mapInstanceToOutput } from "./instance-mapper";
import { cloudConfigString } from "./cloud-config";

export class InstanceCreator {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async createInstance(provider: InstanceInfo["provider"], region: Region) {
    const name = this.generateInstanceName(provider);

    const instance = new vultr.Instance(name, {
      osId: 2136,
      plan: "vc2-1c-1gb",
      region,
      backups: "disabled",
      userData: this.getUserData(),
      activationEmail: false,
      label: "tailportal",
      tags: ["tailportal"],
    });

    return mapInstanceToOutput(name, provider, instance);
  }

  private getUserData() {
    return cloudConfigString.replace(/\$TS_AUTH_KEY/, this.config.tsAuthKey);
  }

  private generateInstanceName(provider: InstanceInfo["provider"]) {
    return `${provider}-instance-${nanoid(5)}`;
  }
}
