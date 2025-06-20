import type {
  ActionHandler,
  Action,
  CollectFirewoodAction,
} from "../../action.js";
import type { NPC } from "../../npc/npc.js";

export class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(action: CollectFirewoodAction, npc: NPC): void {
    npc.increaseFirewood(action.kg);
  }
}
