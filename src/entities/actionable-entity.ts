import Logger from "../utils/logger.js";
import type { Action } from "../types/action.js";
import type { ActionHandler } from "../types/action-handler.js";
import {
  resources,
  type ResourceType,
  type ResourcesStatus,
} from "../types/resources.js";

export abstract class ActionableEntity {
  protected readonly actionHandlers: ActionHandler[] = [];
  protected logger: Logger;
  protected _resources: ResourcesStatus;

  constructor(loggerScope: string, initialResources: Partial<ResourcesStatus>) {
    this.logger = new Logger(loggerScope);
    this._resources = Object.assign(
      Object.fromEntries(resources.map((r) => [r, 0])) as ResourcesStatus,
      initialResources,
    );
  }

  protected registerActionHandlers(handlers: ActionHandler[]): void {
    this.actionHandlers.push(...handlers);
  }

  get resources(): ResourcesStatus {
    return this._resources;
  }

  public decreaseResource(resource: ResourceType, number: number) {
    if (this._resources[resource] - number >= 0) {
      this._resources[resource] -= number;
    }
  }

  public increaseResource(resource: ResourceType, number: number) {
    this._resources[resource] += number;
  }

  handleAction(action: Action) {
    for (const handler of this.actionHandlers) {
      if (handler.supports(action)) {
        handler.handle(this);
      }
    }
  }
}
