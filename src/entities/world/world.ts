import { ActionableEntity } from "../actionable-entity.js";
import {
  type ResourceType,
  resources,
  type ResourcesStatus,
} from "../../types/resources.js";
import { CollectFirewoodActionHandler } from "../../usecases/actions-handlers/collectFirewood.js";
import { CollectGoldActionHandler } from "../../usecases/actions-handlers/collectGold.js";
import { CollectStoneActionHandler } from "../../usecases/actions-handlers/collectStone.js";
import { CollectIronActionHandler } from "../../usecases/actions-handlers/collectIron.js";
import { CollectGrainActionHandler } from "../../usecases/actions-handlers/collectGrain.js";
import { CollectWaterActionHandler } from "../../usecases/actions-handlers/collectWater.js";
import { CollectClayActionHandler } from "../../usecases/actions-handlers/collectClay.js";
import { CollectWoolActionHandler } from "../../usecases/actions-handlers/collectWool.js";
import { CollectFishActionHandler } from "../../usecases/actions-handlers/collectFish.js";
import { CollectHerbsActionHandler } from "../../usecases/actions-handlers/collectHerbs.js";

export class World extends ActionableEntity {
  constructor(
    public readonly name: string,
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super("World", initialResources);
    this.registerActionHandlers([
      new CollectFirewoodActionHandler(),
      new CollectGoldActionHandler(),
      new CollectStoneActionHandler(),
      new CollectIronActionHandler(),
      new CollectGrainActionHandler(),
      new CollectWaterActionHandler(),
      new CollectClayActionHandler(),
      new CollectWoolActionHandler(),
      new CollectFishActionHandler(),
      new CollectHerbsActionHandler(),
    ]);
  }

  public decreaseResource(resource: ResourceType, number: number) {
    if (this._resources[resource] - number < 0) {
      throw Error(`${resource} cannot be less than 0`);
    }

    this._resources[resource] -= number;
  }
}
