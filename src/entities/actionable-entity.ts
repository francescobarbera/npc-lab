import Logger from "../utils/logger.js";
import type { Action, ActionHandler } from "./action.js";
import { resources, type ResourcesStatus } from "./resources.js";

export abstract class ActionableEntity {
  protected readonly actionHandlers: ActionHandler[] = [];
  protected resourcesStatus: ResourcesStatus;
  protected logger: Logger;

  constructor(loggerScope: string) {
    this.logger = new Logger(loggerScope);
    this.resourcesStatus = Object.fromEntries(
      resources.map((r) => [r, 0]),
    ) as ResourcesStatus;
  }

  protected registerActionHandler(handler: ActionHandler): void {
    this.actionHandlers.push(handler);
  }

  handleAction(action: Action): void {
    for (const handler of this.actionHandlers) {
      if (handler.supports(action)) {
        handler.handle(action, this);
        return;
      }
    }

    this.logger.info(`No handler found for action type: ${action.type}`);
  }
}
