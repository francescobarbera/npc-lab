import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { NPC } from "./npc.js";
import { LLMMock } from "../../utils/mocks/llm-mock.js";
import { rest, type Action } from "../../types/action.js";

const test = suite("NPC");

test("act calls llm.generateResponse and returns the response", async () => {
  const llm = new LLMMock();
  const npc = new NPC(llm, "test_npc", [rest], { firewood: 0 });
  const action: Action = {
    type: "rest",
    reason: "reason",
    iteration: 0,
    actor: npc,
  };
  const generateResponseSpy = sinon
    .stub(llm, "generateResponse")
    .resolves(action);

  const result = await npc.act(100);

  assert.is(generateResponseSpy.callCount, 1);
  assert.equal(result, action);
});

test.run();
