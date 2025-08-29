import type { ActionHandler as ActionHandlerInterface } from "../../types/action-handler.js";
import type { Action, ActionType } from "../../types/action.js";
import type { ResourceType } from "../../types/resources.js";
import type { NPC } from "./npc.js";

export class ActionHandler implements ActionHandlerInterface {
  constructor(
    private actionType: ActionType,
    private resource: ResourceType,
  ) {}

  supports(action: Action): boolean {
    return action.type === this.actionType;
  }

  handle(npc: NPC) {
    npc.increaseResource(this.resource, 10);
  }
}
