export interface Config {
  tsAuthKey: string;
  vultrApiKey: string;
  pulumiPassphrase: string;
}

export type InstanceInfo = {
  provider: "vultr" | "aws-lightsail" | "aws-ec2" | "gcp" | "digitalocean" | "hetzner" | "linode";
  name: string;
  id: string;
  hostname: string;
};

export type VultrRegion = "sgp";
export type Region = VultrRegion;

export type CreateInstanceInfo = Pick<InstanceInfo, "provider"> & {
  region: Region;
};

export type ClassInstanceInfo = CreateInstanceInfo | InstanceInfo;
export type ClassInstancesInfo = ClassInstanceInfo[];
