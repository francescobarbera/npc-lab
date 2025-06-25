import sinon from "sinon";
import type { Action } from "../../types/action.js";
import type { ActionableEntity } from "../../entities/actionable-entity.js";
import type { ActionHandler } from "../../types/action-handler.js";

export class ActionHandlerMock implements ActionHandler {
  public supported = false;
  public handleSpy = sinon.spy();

  constructor(supported = false) {
    this.supported = supported;
  }

  supports(): boolean {
    return this.supported;
  }

  handle(target: ActionableEntity): void {
    this.handleSpy(target);
  }
}
