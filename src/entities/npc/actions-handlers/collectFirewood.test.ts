import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { CollectFirewoodActionHandler } from "./collectFirewood.js";
import type { Action } from "../../../types/action.js";
import { NPCMock } from "../../../utils/mocks/npc-mock.js";

const test = suite("NPC CollectFirewoodActionHandler");

test("supports returns true if action type is collect_firewood", () => {
  const npc = new NPCMock();
  const handler = new CollectFirewoodActionHandler();
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "collect_firewood",
  };

  const result = handler.supports(action);

  assert.is(result, true);
});

test("supports returns false if action type is not collect_firewood", () => {
  const npc = new NPCMock();
  const handler = new CollectFirewoodActionHandler();
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "rest",
  };

  const result = handler.supports(action);

  assert.is(result, false);
});

test("handle calls npc increaseResource method passing the resource name and the number", () => {
  const npc = new NPCMock();
  const handler = new CollectFirewoodActionHandler();
  const npcIncreaseResourceSpy = sinon.spy(npc, "increaseResource");
  const action: Action = {
    iteration: 0,
    reason: "reason",
    actor: npc,
    type: "collect_firewood",
  };

  handler.handle(npc);

  assert.is(npcIncreaseResourceSpy.callCount, 1);
  assert.equal(npcIncreaseResourceSpy.getCall(0).args, ["firewood", 10]);
});

test.run();
