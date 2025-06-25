import type { Action } from "../../../types/action.js";
import type { ActionHandler } from "../../../types/action-handler.js";
import type { NPC } from "../npc.js";

export class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(npc: NPC): void {
    npc.increaseResource("firewood", 10);
  }
}
