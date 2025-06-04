import type * as pulumi from "@pulumi/pulumi";
import { LocalWorkspace } from "@pulumi/pulumi/automation/index.js";

import type {
  Config,
  InstanceInfo,
  Region,
  ClassInstancesInfo,
  CreateInstanceInfo,
} from "./types";
import { InstanceCreator } from "./instance-creator";
import { mapStackOutputToArray } from "./stack-output";

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
              "gcp:project": this.config.googleProject,
              "gcp:credentials": this.config.googleCredentials,
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

  async removeInstance(name: string) {
    this.instancesInfo = this.instancesInfo.filter((_info) => {
      if (!!(_info as any).name) {
        const info = _info as InstanceInfo;
        return info.name !== name;
      } else {
        return true;
      }
    });

    return this.upStack();
  }

  async destroyStack() {
    this.instancesInfo = [];
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
    const instanceCreator = new InstanceCreator(this.config);
    return instanceCreator.getExistingInstance(info);
  }

  private getOutputFromCreateInfo(info: CreateInstanceInfo) {
    const instanceCreator = new InstanceCreator(this.config);
    return instanceCreator.createInstance(info.provider, info.region);
  }

  get currentInstances(): InstanceInfo[] {
    return this.getExistingInstanceInfo();
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
