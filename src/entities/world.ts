import type { Action, ActionHandler, CollectFirewoodAction } from "./action.js";
import { ActionableEntity } from "./actionable-entity.js";
import type { NPC } from "./npc.js";

class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(action: CollectFirewoodAction, npc: NPC): void {
    npc.increaseFirewood(action.kg);
  }
}
export class World extends ActionableEntity {
  constructor(
    public readonly name: string,
    private firewoodKg: number,
  ) {
    super("World");
    this.registerActionHandler(new CollectFirewoodActionHandler());
  }

  get currentFirewoodKg(): number {
    return this.firewoodKg;
  }

  public decreaseFirewood(kg: number) {
    this.firewoodKg -= kg;
  }
}
