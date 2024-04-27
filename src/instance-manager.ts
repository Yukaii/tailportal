import * as pulumi from "@pulumi/pulumi";
import { LocalWorkspace } from "@pulumi/pulumi/automation";
import vultr from "@ediri/vultr";

import type {
  Config,
  InstanceInfo,
  Region,
  ClassInstancesInfo,
  CreateInstanceInfo,
} from "./types";
import { InstanceCreator } from "./instance-creator";
import { mapStackOutputToArray } from "./stack-output";
import { mapInstanceToOutput } from "./instance-mapper";

export class InstanceManager {
  private config: Config;
  private stackName: string;
  private projectName: string;
  private stack: pulumi.automation.Stack | undefined;
  private instancesInfo: ClassInstancesInfo = [];

  constructor(config: Config, stackName: string, projectName: string) {
    this.config = config;
    this.stackName = stackName;
    this.projectName = projectName;
  }

  async initializeStack() {
    this.stack = await LocalWorkspace.createOrSelectStack(
      {
        program: this.getProgram(),
        projectName: this.projectName,
        stackName: this.stackName,
      },
      {
        secretsProvider: "passphrase",
        envVars: {
          PULUMI_CONFIG_PASSPHRASE: this.config.pulumiPassphrase,
        },
        projectSettings: {
          name: this.projectName,
          runtime: "nodejs",
        },
        stackSettings: {
          [this.stackName]: {
            config: {
              "vultr:apiKey": this.config.vultrApiKey,
            },
          },
        },
      },
    );

    this.instancesInfo = mapStackOutputToArray(await this.stack.outputs());
  }

  async createInstance(provider: InstanceInfo["provider"], region: Region) {
    this.instancesInfo.push({
      provider,
      region,
    });

    return this.upStack();
  }

  async createInstances(
    data: { provider: InstanceInfo["provider"]; region: Region }[],
  ) {
    data.forEach(({ provider, region }) =>
      this.instancesInfo.push({ provider, region }),
    );

    return this.upStack();
  }

  async removeInstance(instanceId: string) {
    this.instancesInfo = this.instancesInfo.filter((_info) => {
      if ((_info as any).id !== "undefined") {
        const info = _info as InstanceInfo;
        return info.id !== instanceId;
      } else {
        return _info;
      }
    });

    return this.upStack();
  }

  async destroyStack() {
    this.instancesInfo = []
    await this.upStack();
    await this.stack?.destroy({ onOutput: console.info });
  }

  async upStack() {
    await this.stack?.up({ onOutput: console.info });
  }

  async refreshStack() {
    await this.stack?.refresh({ onOutput: console.info });
  }

  private getProgram() {
    return async () => {
      const existing = this.getExistingInstanceInfo().map((info) =>
        this.getOutputFromInfo(info),
      );

      const newInstances = this.getNewInstanceInfo().map((info) =>
        this.getOutputFromCreateInfo(info),
      );

      return [...existing, ...newInstances];
    };
  }

  private getOutputFromInfo(info: InstanceInfo) {
    switch (info.provider) {
      case "vultr": {
        const instance = vultr.Instance.get(info.name, info.id);
        return mapInstanceToOutput(info.name, info.provider, instance);
      }
      default:
        throw new Error("provider not implemented yet");
    }
  }

  private getOutputFromCreateInfo(info: CreateInstanceInfo) {
    switch (info.provider) {
      case "vultr": {
        const instanceCreator = new InstanceCreator(this.config);
        return instanceCreator.createInstance(info.provider, info.region);
      }
      default:
        throw new Error("provider not implemented yet");
    }
  }

  private getExistingInstanceInfo(): InstanceInfo[] {
    return this.instancesInfo
      .filter((info) => {
        // NOTE: the value coming from stack.outputs aren't actually undefined in output
        // So we're cannot check with typeof undefined here
        if (!!(info as any).id) {
          return info as InstanceInfo;
        }
      })
      .filter(Boolean) as InstanceInfo[];
  }

  private getNewInstanceInfo(): CreateInstanceInfo[] {
    return this.instancesInfo
      .filter((info) => {
        if (!!(info as any).region) {
          return info as CreateInstanceInfo;
        }
      })
      .filter(Boolean) as CreateInstanceInfo[];
  }
}
