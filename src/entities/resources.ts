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

export type resource = (typeof resources)[number];
export type ResourcesStatus = Record<resource, number>;
