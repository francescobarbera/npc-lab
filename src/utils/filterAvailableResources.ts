import type { ResourcesStatus, ResourceType } from "../types/resources.js";

export function filterAvailableResources(
  resources: ResourcesStatus,
): Partial<ResourcesStatus> {
  const result: Partial<ResourcesStatus> = {};

  for (const key of Object.keys(resources) as ResourceType[]) {
    if (resources[key] !== 0) {
      result[key] = resources[key];
    }
  }

  return result;
}
