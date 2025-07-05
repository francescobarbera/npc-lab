import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { ActionHandler } from "./actionHandler.js";
import type { Action } from "../../types/action.js";
import { NPCMock } from "../../utils/mocks/npc-mock.js";

const test = suite("NPC ActionHandler");

test("supports returns true if action type is collect_clay", () => {
  const npc = new NPCMock();
  const handler = new ActionHandler("collect_clay", "clay");
  const action: Action = {
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
    reason: "reason",
    actor: npc,
    type: "rest",
  };

  const result = handler.supports(action);

  assert.is(result, false);
});

test("handle calls npc increaseResource method passing the resource name 'clay' and the number 10", () => {
  const npc = new NPCMock();
  const handler = new ActionHandler("collect_clay", "clay");
  const npcIncreaseResourceSpy = sinon.spy(npc, "increaseResource");

  handler.handle(npc);

  assert.is(npcIncreaseResourceSpy.callCount, 1);
  assert.equal(npcIncreaseResourceSpy.getCall(0).args, ["clay", 10]);
});

test.run();
