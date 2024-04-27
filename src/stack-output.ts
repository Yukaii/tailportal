import type { InstanceInfo } from "./types";

export type StackOutput = {
  [key: number]: {
    value: InstanceInfo;
  };
};

export function mapStackOutputToArray(output: StackOutput): InstanceInfo[] {
  return Object.values(output).map((v) => v.value);
}
