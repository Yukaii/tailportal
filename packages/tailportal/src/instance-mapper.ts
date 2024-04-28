import { Instance as VultrInstance } from "@ediri/vultr";
import { compute } from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import type { InstanceInfo } from "./types";

export function mapInstanceToOutput(
  name: string,
  provider: InstanceInfo["provider"],
  instance: VultrInstance | compute.Instance,
) {
  // return {
  //   id: instance.id,
  //   name: pulumi.Output.create(name),
  //   hostname: instance.hostname,
  //   provider: pulumi.Output.create(provider)
  // }

  return pulumi
    .all([instance.id, instance.hostname])
    .apply(([id, hostname]) => ({ name, id, hostname, provider }));
}
