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

  protected registerActionHandler(handler: ActionHandler): void {
    this.actionHandlers.push(handler);
  }

  get resources(): ResourcesStatus {
    return this._resources;
  }

  public decreaseResource(resource: ResourceType, number: number) {
    if (this._resources[resource] - number < 0) {
      throw Error(`${resource} cannot be less than 0`);
    }

    this._resources[resource] -= number;
  }

  public increaseResource(resource: ResourceType, number: number) {
    this._resources[resource] += number;
  }

  handleAction(action: Action): void {
    for (const handler of this.actionHandlers) {
      this.logger.info(
        JSON.stringify({ type: action.type, reason: action.reason }),
      );
      if (handler.supports(action)) {
        handler.handle(this);
        return;
      }
    }

    this.logger.info(`No handler found for action type: ${action.type}`);
  }
}
