export const resources = [
  "gold",
  "firewood",
  "stone",
  "iron",
  "grain",
  "water",
  "clay",
  "wool",
  "fish",
  "herbs",
] as const;

export type ResourceType = (typeof resources)[number];
export type ResourcesStatus = Record<ResourceType, number>;
