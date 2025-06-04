import type { Region as VultrRegionTypes } from "./vultr-regions";

export interface Config {
  tsAuthKey: string;
  pulumiPassphrase: string;
  vultrApiKey?: string;
  googleProject?: string;
  googleCredentials?: string;
}

export const cloudProviders = [
  "vultr",
  "aws-lightsail",
  "aws-ec2",
  "gcp",
  "digitalocean",
  "hetzner",
  "linode",
] as const;

export type CloudProvider = (typeof cloudProviders)[number];

export type InstanceInfo = {
  provider: CloudProvider;
  name: string;
  id: string;
  hostname: string;
};

export type VultrRegion = VultrRegionTypes["id"];
export type Region = VultrRegion;

export type CreateInstanceInfo = Pick<InstanceInfo, "provider"> & {
  region: Region;
};

export type ClassInstanceInfo = CreateInstanceInfo | InstanceInfo;
export type ClassInstancesInfo = ClassInstanceInfo[];
