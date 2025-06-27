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
] as const;

export type ActionType = (typeof actionTypes)[number];

export type Action = {
  type: ActionType;
  reason: string;
  iteration: number;
  actor: NPC;
};
