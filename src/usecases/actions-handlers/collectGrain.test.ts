import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { CollectGrainActionHandler } from "./collectGrain.js";
import type { Action } from "../../types/action.js";
import { WorldMock } from "../../utils/mocks/world-mock.js";
import { NPCMock } from "../../utils/mocks/npc-mock.js";

const test = suite("World CollectGrainActionHandler");

test("supports returns true if action type is collect_grain", () => {
  const npc = new NPCMock();
  const handler = new CollectGrainActionHandler();
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "collect_grain",
  };

  const result = handler.supports(action);

  assert.is(result, true);
});

test("supports returns false if action type is not collect_grain", () => {
  const npc = new NPCMock();
  const handler = new CollectGrainActionHandler();
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "rest",
  };

  const result = handler.supports(action);

  assert.is(result, false);
});

test("handle calls world decreaseResource method passing the resource name 'grain' and the number 10", () => {
  const world = new WorldMock();
  const handler = new CollectGrainActionHandler();
  const worldDecreaseResourceSpy = sinon.spy(world, "decreaseResource");

  handler.handle(world);

  assert.is(worldDecreaseResourceSpy.callCount, 1);
  assert.equal(worldDecreaseResourceSpy.getCall(0).args, ["grain", 10]);
});

test.run();
