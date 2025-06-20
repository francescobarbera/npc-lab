import { suite } from "uvu";
import * as assert from "uvu/assert";
import { ActionableEntity } from "./actionable-entity.js";
import type { Action, ActionHandler } from "./action.js";
import { ActionHandlerMock } from "../utils/mocks/action-handler-mock.js";
import { NPCMock } from "../utils/mocks/npc-mock.js";

const test = suite("ActionableEntity");

class Entity extends ActionableEntity {
  get getActionHandlers() {
    return this.actionHandlers;
  }

  publicRegisterActionHandler(handler: ActionHandler) {
    this.registerActionHandler(handler);
  }
}

test("registerActionHandler pushes tihe provided handler in the inner list", () => {
  const actionHandler = new ActionHandlerMock();

  const entity = new Entity("test_scope");
  entity.publicRegisterActionHandler(actionHandler);

  assert.ok(entity.getActionHandlers.includes(actionHandler));
});

test("handleAction calls the first supporting handler's handle method", () => {
  const npc = new NPCMock();
  const action: Action = {
    type: "rest",
    iteration: 0,
    actor: npc,
  };
  const handler1 = new ActionHandlerMock(false);
  const handler2 = new ActionHandlerMock(true);
  const entity = new Entity("test_scope");
  entity.publicRegisterActionHandler(handler1);
  entity.publicRegisterActionHandler(handler2);

  entity.handleAction(action);

  assert.is(handler1.handleSpy.callCount, 0);
  assert.is(handler2.handleSpy.callCount, 1);
  assert.equal(handler2.handleSpy.getCall(0).args, [action, entity]);
});

test("handleAction logs info if no handler supports the action", () => {
  const npc = new NPCMock();
  const action: Action = {
    type: "rest",
    iteration: 0,
    actor: npc,
  };
  const handler = new ActionHandlerMock(false);
  const entity = new Entity("test_scope");
  entity.publicRegisterActionHandler(handler);

  entity.handleAction(action);

  assert.is(handler.handleSpy.callCount, 0);
});
test.run();
