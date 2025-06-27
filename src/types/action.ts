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

export type Action = {
  type: ActionType;
  reason: string;
  iteration: number;
  actor: NPC;
};
