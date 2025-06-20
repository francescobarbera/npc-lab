import { ActionableEntity } from "../actionable-entity.js";
import { CollectFirewoodActionHandler } from "./actions-hanlders/collectFirewood.js";

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
