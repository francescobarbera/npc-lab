import { resources, type ResourcesStatus } from "../../types/resources.js";

export const resourcesStatusMock: ResourcesStatus = Object.fromEntries(
  resources.map((r) => [r, 0]),
) as ResourcesStatus;
