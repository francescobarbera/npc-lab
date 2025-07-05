import type { NPC } from "../entities/npc/npc.js";

export const actionTypes = [
  "collect_gold",
  "collect_firewood",
  "collect_stone",
  "collect_iron",
  "collect_grain",
  "collect_water",
  "collect_clay",
  "collect_wool",
  "collect_fish",
  "collect_herbs",
  "rest",
];

export type ActionType = (typeof actionTypes)[number];

export function isActionType(value: string): value is ActionType {
  return typeof value === "string" && actionTypes.includes(value as ActionType);
}

export type Action = {
  type: ActionType;
  reason: string;
  actor: NPC;
};
