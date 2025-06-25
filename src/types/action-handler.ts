import type { ActionableEntity } from "../entities/actionable-entity.js";
import type { Action } from "./action.js";

export interface ActionHandler {
  supports(action: Action): boolean;
  handle(target: ActionableEntity): void;
}
