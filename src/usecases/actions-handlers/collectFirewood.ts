import type { ActionHandler } from "../../types/action-handler.js";
import type { Action } from "../../types/action.js";
import type { World } from "../../entities/world/world.js";

export class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(world: World): void {
    world.decreaseResource("firewood", 10);
  }
}
