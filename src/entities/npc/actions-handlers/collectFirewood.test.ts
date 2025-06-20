import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { CollectFirewoodActionHandler } from "./collectFirewood.js";
import type { Action, CollectFirewoodAction } from "../../action.js";
import { NPCMock } from "../../../utils/mocks/npc-mock.js";

const test = suite("NPC CollectFirewoodActionHandler");

test("supports returns true if action type is collect_firewood", () => {
  const npc = new NPCMock();
  const handler = new CollectFirewoodActionHandler();
  const action: CollectFirewoodAction = {
    iteration: 0,
    actor: npc,
    type: "collect_firewood",
    kg: 10,
  };

  const result = handler.supports(action);

  assert.is(result, true);
});

test("supports returns false if action type is not collect_firewood", () => {
  const npc = new NPCMock();
  const handler = new CollectFirewoodActionHandler();
  const action: Action = {
    iteration: 0,
    actor: npc,
    type: "rest",
  };

  const result = handler.supports(action);

  assert.is(result, false);
});

test("handle calls npc increaseFirewood method passing the kg", () => {
  const npc = new NPCMock();
  const handler = new CollectFirewoodActionHandler();
  const npcIncreaseFirewoodSpy = sinon.spy(npc, "increaseFirewood");
  const action: CollectFirewoodAction = {
    iteration: 0,
    actor: npc,
    type: "collect_firewood",
    kg: 10,
  };

  handler.handle(action, npc);

  assert.is(npcIncreaseFirewoodSpy.callCount, 1);
  assert.equal(npcIncreaseFirewoodSpy.getCall(0).args, [10]);
});

test.run();
