import { suite } from "uvu";
import * as assert from "uvu/assert";
import { ActionableEntity } from "./actionable-entity.js";
import type { Action, ActionHandler } from "../types/action.js";
import { ActionHandlerMock } from "../utils/mocks/action-handler-mock.js";
import { NPCMock } from "../utils/mocks/npc-mock.js";
import { resources } from "../types/resources.js";

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

  const entity = new Entity("test_scope", {});
  entity.publicRegisterActionHandler(actionHandler);

  assert.ok(entity.getActionHandlers.includes(actionHandler));
});

test("handleAction calls the first supporting handler's handle method", () => {
  const npc = new NPCMock();
  const action: Action = {
    type: "rest",
    reason: "reason",
    iteration: 0,
    actor: npc,
  };
  const handler1 = new ActionHandlerMock(false);
  const handler2 = new ActionHandlerMock(true);
  const entity = new Entity("test_scope", {});
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
    reason: "reason",
    iteration: 0,
    actor: npc,
  };
  const handler = new ActionHandlerMock(false);
  const entity = new Entity("test_scope", {});
  entity.publicRegisterActionHandler(handler);

  entity.handleAction(action);

  assert.is(handler.handleSpy.callCount, 0);
});

test("sets by defalut all resources to 0", () => {
  const entity = new Entity("test", {});

  for (const resource of resources) {
    assert.is(entity.resources[resource], 0);
  }
});

test("sets the provided resources with the provided value", () => {
  const entity = new Entity("test", { firewood: 10, gold: 20, iron: 30 });

  assert.is(entity.resources.firewood, 10);
  assert.is(entity.resources.gold, 20);
  assert.is(entity.resources.iron, 30);

  assert.is(entity.resources.clay, 0);
  assert.is(entity.resources.stone, 0);
});

test("decreaseResource correctly decreases the provided resource", () => {
  const entity = new Entity("test", { firewood: 50 });

  entity.decreaseResource("firewood", 40);

  assert.is(entity.resources.firewood, 10);
});

test("decreaseResource throws an exception if the resource goes under 0", () => {
  const entity = new Entity("test_world", { firewood: 10 });

  assert.throws(
    () => entity.decreaseResource("firewood", 20),
    "firewood cannot be less than 0",
  );
});

test("increaseResource correctly increases the provided resource", () => {
  const entity = new Entity("test", { firewood: 50 });

  entity.increaseResource("firewood", 10);
  entity.increaseResource("iron", 10);

  assert.is(entity.resources.firewood, 60);
  assert.is(entity.resources.iron, 10);
});

test.run();
