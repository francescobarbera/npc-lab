import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { ActionHandler } from "./actionHandler.js";
import type { Action } from "../../types/action.js";
import { NPCMock } from "../../utils/mocks/npc-mock.js";
import { WorldMock } from "../../utils/mocks/world-mock.js";

const test = suite("NPC ActionHandler");

test("supports returns true if action type is collect_clay", () => {
  const npc = new NPCMock();
  const handler = new ActionHandler("collect_clay", "clay");
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "collect_clay",
  };

  const result = handler.supports(action);

  assert.is(result, true);
});

test("supports returns false if action type is not collect_clay", () => {
  const npc = new NPCMock();
  const handler = new ActionHandler("collect_clay", "clay");
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "rest",
  };

  const result = handler.supports(action);

  assert.is(result, false);
});

test("handle calls world decreaseResource method passing the resource name 'clay' and the number 10", () => {
  const world = new WorldMock();
  const handler = new ActionHandler("collect_clay", "clay");
  const worldDecreaseResourceSpy = sinon.spy(world, "decreaseResource");

  handler.handle(world);

  assert.is(worldDecreaseResourceSpy.callCount, 1);
  assert.equal(worldDecreaseResourceSpy.getCall(0).args, ["clay", 10]);
});

test.run();
