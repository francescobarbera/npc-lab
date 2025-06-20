import type {
  Action,
  ActionHandler,
  CollectFirewoodAction,
} from "../../action.js";
import type { NPC } from "../npc.js";

export class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(action: CollectFirewoodAction, npc: NPC): void {
    npc.increaseFirewoodKg(action.kg);
  }
}
