import type {
  ActionHandler,
  Action,
  CollectFirewoodAction,
} from "../../action.js";
import type { World } from "../world.js";

export class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(action: CollectFirewoodAction, world: World): void {
    world.decreaseResource("firewood", action.kg);
  }
}
