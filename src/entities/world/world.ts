import { ActionableEntity } from "../actionable-entity.js";
import {
  type ResourceType,
  resources,
  type ResourcesStatus,
} from "../../types/resources.js";
import { CollectFirewoodActionHandler } from "./actions-hanlders/collectFirewood.js";

export class World extends ActionableEntity {
  constructor(
    public readonly name: string,
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super("World", initialResources);
    this.registerActionHandler(new CollectFirewoodActionHandler());
  }

  public decreaseResource(resource: ResourceType, number: number) {
    if (this._resources[resource] - number < 0) {
      throw Error(`${resource} cannot be less than 0`);
    }

    this._resources[resource] -= number;
  }
}
