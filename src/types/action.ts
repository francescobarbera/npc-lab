import type { ActionableEntity } from "../entities/actionable-entity.js";
import type { NPC } from "../entities/npc/npc.js";

export type ActionType =
  | "collect_gold"
  | "collect_firewood"
  | "collect_stone"
  | "collect_iron"
  | "collect_grain"
  | "collect_water"
  | "collect_clay"
  | "collect_wool"
  | "collect_fish"
  | "collect_herbs"
  | "rest";

export type ActionDescriptorType =
  | {
      type: Exclude<ActionType, "rest">;
      rules: {
        left: string;
        op: string;
        right: number;
      }[];
    }
  | {
      type: "rest";
      rules: [
        {
          fallback: true;
        },
      ];
    };

/*
 * The action describes the something that npcs can do.
 * It has a list of associated targets, they could be npcs or the world.
 * The npcs and the world react to the action.
 */
export type Action = {
  type: ActionType;
  reason: string;
  iteration: number;
  actor: NPC;
};

export const rest: ActionDescriptorType = {
  type: "rest",
  rules: [{ fallback: true }],
};

export const collectFirewood: ActionDescriptorType = {
  type: "collect_firewood",
  rules: [
    { left: "owned.firewood", op: "<", right: 50 },
    { left: "available.firewood", op: ">", right: 0 },
  ],
};

export const actions = [collectFirewood, rest];
