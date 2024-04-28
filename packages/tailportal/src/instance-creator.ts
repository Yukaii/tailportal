import * as vultr from "@ediri/vultr";
import * as gcp from "@pulumi/gcp";
import { customAlphabet } from "nanoid";
import { regions } from "vultr-types";
import YAML from 'yaml'

import type { Config, InstanceInfo, Region } from "./types";
import { mapInstanceToOutput } from "./instance-mapper";
import { cloudConfigString, startupScriptString } from "./cloud-config";

export class InstanceCreator {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async createInstance(provider: InstanceInfo["provider"], region: Region) {
    const name = this.generateInstanceName(provider);

    switch (provider) {
      case "vultr": {
        if (!regions.map((reg) => reg.id).includes(region)) {
          throw new Error("Region not valid");
        }

        const instance = new vultr.Instance(name, {
          hostname: name,
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
      case "gcp": {
        const instance = new gcp.compute.Instance(name, {
          networkInterfaces: [{
              accessConfigs: [{}],
              network: "default",
          }],
          name,
          machineType: "e2-micro",
          zone: "us-central1-a",
          tags: ["tailportal"],
          bootDisk: {
              initializeParams: {
                  image: "debian-cloud/debian-11",
              },
          },
          metadataStartupScript: this.getStartupScript(),
          // TODO: user given metadata
          metadata: {
            "sshKeys": ""
          }
        })

        return mapInstanceToOutput(name, provider, instance)
      }
      case "aws-lightsail":
      case "aws-ec2":
      case "digitalocean":
      case "hetzner":
      case "linode":
      default: {
        throw new Error("Not implemented");
      }
    }
  }

  getExistingInstance (info: InstanceInfo) {
    switch (info.provider) {
      case "vultr": {
        const instance = vultr.Instance.get(info.name, info.id);
        return mapInstanceToOutput(info.name, info.provider, instance);
      }
      case "gcp": {
        const instance = gcp.compute.Instance.get(info.name, info.id);
        return mapInstanceToOutput(info.name, info.provider, instance);
      }
      case "aws-lightsail":
      case "aws-ec2":
      case "digitalocean":
      case "hetzner":
      case "linode":
      default: {
        throw new Error("Not implemented");
      }
    }
  }

  private getUserData() {
    return cloudConfigString.replace(/\$TS_AUTH_KEY/, this.config.tsAuthKey);
  }

  private getStartupScript() {
    return startupScriptString.replace(/\$TS_AUTH_KEY/, this.config.tsAuthKey);
  }

  private generateInstanceName(provider: InstanceInfo["provider"]) {
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);
    return `${provider}-instance-${nanoid()}`;
  }
}
