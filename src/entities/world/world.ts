import { ActionableEntity } from "../actionable-entity.js";
import {
  type ResourceType,
  resources,
  type ResourcesStatus,
} from "../../types/resources.js";
import { ActionHandler } from "./actionHandler.js";

export class World extends ActionableEntity {
  constructor(
    public readonly name: string,
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super("World", initialResources);
    this.registerActionHandlers([
      new ActionHandler("collect_gold", "gold"),
      new ActionHandler("collect_firewood", "firewood"),
      new ActionHandler("collect_stone", "stone"),
      new ActionHandler("collect_iron", "iron"),
      new ActionHandler("collect_grain", "grain"),
      new ActionHandler("collect_water", "water"),
      new ActionHandler("collect_clay", "clay"),
      new ActionHandler("collect_wool", "wool"),
      new ActionHandler("collect_fish", "fish"),
      new ActionHandler("collect_herbs", "herbs"),
    ]);
  }

  public decreaseResource(resource: ResourceType, number: number) {
    if (this._resources[resource] - number < 0) {
      return false;
    }

    this._resources[resource] -= number;
    return true;
  }
}
