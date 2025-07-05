import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { NPC } from "./npc.js";
import { LLMMock } from "../../utils/mocks/llm-mock.js";
import type { Action } from "../../types/action.js";
import { resourcesStatusMock } from "../../utils/mocks/resources-status-mock.js";
import type { NPCMessage } from "../../dependencies-interfaces/llm.js";

const test = suite("NPC");

test("act calls llm.generateResponse and detectActionType and returns the response", async () => {
  const llm = new LLMMock();
  const npc = new NPC(llm, "test_npc", ["rest"], { firewood: 0 });
  const npcMessage: NPCMessage = {
    content: "content",
    sender: "npc",
  };
  const action: Action = {
    type: "rest",
    reason: "content",
    actor: npc,
  };
  const generateResponseSpy = sinon
    .stub(llm, "generateResponse")
    .resolves(npcMessage);
  const detectActionTypeResponseSpy = sinon
    .stub(llm, "detectActionType")
    .resolves("rest");

  const result = await npc.act(resourcesStatusMock);

  assert.is(generateResponseSpy.callCount, 1);
  assert.is(detectActionTypeResponseSpy.callCount, 1);
  assert.equal(result, action);
});

test.run();
