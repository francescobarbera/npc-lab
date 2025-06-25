import sinon from "sinon";
import type { ActionHandler, Action } from "../../types/action.js";
import type { ActionableEntity } from "../../entities/actionable-entity.js";

export class ActionHandlerMock implements ActionHandler {
  public supported = false;
  public handleSpy = sinon.spy();

  constructor(supported = false) {
    this.supported = supported;
  }

  supports(): boolean {
    return this.supported;
  }

  handle(action: Action, target: ActionableEntity): void {
    this.handleSpy(action, target);
  }
}
