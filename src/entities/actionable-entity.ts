import Logger from "../utils/logger.js";
import type { Action, ActionHandler } from "./action.js";

export abstract class ActionableEntity {
  protected readonly actionHandlers: ActionHandler[] = [];
  protected logger: Logger;

  constructor(loggerScope: string) {
    this.logger = new Logger(loggerScope);
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
