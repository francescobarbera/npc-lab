import Logger from "../utils/logger.js";
import type { Action, ActionHandler, CollectFirewoodAction } from "./action.js";
import type { NPC } from "./npc.js";

class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(action: CollectFirewoodAction, npc: NPC): void {
    npc.increaseFirewood(action.kg);
  }
}
export class World {
  private logger: Logger;
  private readonly actionHandlers: ActionHandler[];

  constructor(
    public readonly name: string,
    private firewoodKg: number,
  ) {
    this.logger = new Logger("World");
    this.actionHandlers = [new CollectFirewoodActionHandler()];
  }

  get currentFirewoodKg(): number {
    return this.firewoodKg;
  }

  handleAction(action: Action) {
    for (const handler of this.actionHandlers) {
      if (handler.supports(action)) {
        handler.handle(action, this);
        return;
      }
    }

    this.logger.info(`No handler found for action type: ${action.type}`);
  }

  public decreaseFirewood(kg: number) {
    this.firewoodKg -= kg;
  }
}
