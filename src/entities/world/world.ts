import { ActionableEntity } from "../actionable-entity.js";
import { CollectFirewoodActionHandler } from "./actions-hanlders/collectFirewood.js";

export class World extends ActionableEntity {
  constructor(
    public readonly name: string,
    private _firewoodKg: number,
  ) {
    super("World");
    this.registerActionHandler(new CollectFirewoodActionHandler());
  }

  get firewoodKg(): number {
    return this._firewoodKg;
  }

  public decreaseFirewood(kg: number) {
    if (this._firewoodKg - kg < 0) {
      throw Error("Firewood kg cannot be less than 0");
    }

    this._firewoodKg -= kg;
  }
}
