import { ActionableEntity } from "../actionable-entity.js";
import { resources, type ResourcesStatus } from "../resources.js";
import { CollectFirewoodActionHandler } from "./actions-hanlders/collectFirewood.js";

export class World extends ActionableEntity {
  private resources: ResourcesStatus;
  constructor(
    public readonly name: string,
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super("World");
    this.registerActionHandler(new CollectFirewoodActionHandler());
    this.resources = Object.assign(
      Object.fromEntries(resources.map((r) => [r, 0])) as ResourcesStatus,
      initialResources,
    );
  }

  get firewoodKg(): number {
    return this.resources.firewood;
  }

  public decreaseFirewood(kg: number) {
    if (this.resources.firewood - kg < 0) {
      throw Error("Firewood kg cannot be less than 0");
    }

    this.resources.firewood -= kg;
  }
}
