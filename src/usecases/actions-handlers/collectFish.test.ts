import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { CollectFishActionHandler } from "./collectFish.js";
import type { Action } from "../../types/action.js";
import { WorldMock } from "../../utils/mocks/world-mock.js";
import { NPCMock } from "../../utils/mocks/npc-mock.js";

const test = suite("World CollectFishActionHandler");

test("supports returns true if action type is collect_fish", () => {
  const npc = new NPCMock();
  const handler = new CollectFishActionHandler();
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "collect_fish",
  };

  const result = handler.supports(action);

  assert.is(result, true);
});

test("supports returns false if action type is not collect_fish", () => {
  const npc = new NPCMock();
  const handler = new CollectFishActionHandler();
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "rest",
  };

  const result = handler.supports(action);

  assert.is(result, false);
});

test("handle calls world decreaseResource method passing the resource name 'fish' and the number 10", () => {
  const world = new WorldMock();
  const handler = new CollectFishActionHandler();
  const worldDecreaseResourceSpy = sinon.spy(world, "decreaseResource");

  handler.handle(world);

  assert.is(worldDecreaseResourceSpy.callCount, 1);
  assert.equal(worldDecreaseResourceSpy.getCall(0).args, ["fish", 10]);
});

test.run();
