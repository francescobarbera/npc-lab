import type { ActionDescriptorType } from "../types/action.js";

export const rest: ActionDescriptorType = {
  type: "rest",
  rules: [{ fallback: true }],
};

const collectFirewood: ActionDescriptorType = {
  type: "collect_firewood",
  rules: [
    { left: "owned.firewood", op: "<", right: 50 },
    { left: "available.firewood", op: ">", right: 0 },
  ],
};

const collectGold: ActionDescriptorType = {
  type: "collect_gold",
  rules: [
    { left: "owned.gold", op: "<", right: 100 },
    { left: "available.gold", op: ">", right: 10 },
  ],
};

const collectStone: ActionDescriptorType = {
  type: "collect_stone",
  rules: [
    { left: "owned.stone", op: "<", right: 80 },
    { left: "available.stone", op: ">", right: 10 },
  ],
};

const collectIron: ActionDescriptorType = {
  type: "collect_iron",
  rules: [
    { left: "owned.iron", op: "<", right: 30 },
    { left: "available.iron", op: ">", right: 20 },
  ],
};

const collectGrain: ActionDescriptorType = {
  type: "collect_grain",
  rules: [
    { left: "owned.grain", op: "<", right: 60 },
    { left: "available.grain", op: ">", right: 100 },
  ],
};

const collectWater: ActionDescriptorType = {
  type: "collect_water",
  rules: [
    { left: "owned.water", op: "<", right: 40 },
    { left: "available.water", op: ">", right: 0 },
  ],
};

const collectClay: ActionDescriptorType = {
  type: "collect_clay",
  rules: [
    { left: "owned.clay", op: "<", right: 50 },
    { left: "available.clay", op: ">", right: 0 },
  ],
};

const collectWool: ActionDescriptorType = {
  type: "collect_wool",
  rules: [
    { left: "owned.wool", op: "<", right: 20 },
    { left: "available.wool", op: ">", right: 10 },
  ],
};

const collectFish: ActionDescriptorType = {
  type: "collect_fish",
  rules: [
    { left: "owned.fish", op: "<", right: 50 },
    { left: "available.fish", op: ">", right: 0 },
  ],
};

const collectHerbs: ActionDescriptorType = {
  type: "collect_herbs",
  rules: [
    { left: "owned.herbs", op: "<", right: 10 },
    { left: "available.herbs", op: ">", right: 0 },
  ],
};

export const actions = [
  collectFirewood,
  collectGold,
  collectStone,
  collectIron,
  collectGrain,
  collectWater,
  collectClay,
  collectWool,
  collectFish,
  collectHerbs,
  rest,
];
