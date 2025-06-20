import type { NPC } from "./npc.js";
import type { World } from "./world.js";

export type ActionType = "collect_firewood" | "rest";

/*
 * The action describes the something that npcs can do.
 * It has a list of associated targets, they could be npcs or the world.
 * The npcs and the world react to the action.
 */
type BaseAction = {
  type: ActionType;
  iteration: number;
  actor: NPC;
};

export const collectFirewoodPrompt = `
  If you have less than 50 kg of firewood, collect it.
  IMPORTANT: You can only collect firewood if the world has more than 10 kg available. If the world has 10 kg or less, you MUST choose to rest instead.
`;
export type CollectFirewoodAction = BaseAction & {
  type: "collect_firewood";
  kg: number;
};

export type RestAction = BaseAction & {
  type: "rest";
};

export type Action = CollectFirewoodAction | RestAction;

export interface ActionHandler {
  supports(action: Action): boolean;
  handle(action: Action, target: NPC | World): void;
}
