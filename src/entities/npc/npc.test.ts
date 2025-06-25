import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { NPC } from "./npc.js";
import { LLMMock } from "../../utils/mocks/llm-mock.js";
import type { Action } from "../action.js";

const test = suite("NPC");

test("initialise calls llm.generateResponse", async () => {
  const llm = new LLMMock();
  const npc = new NPC(llm, "test_npc", "test_goal", ["rest"], { firewood: 0 });
  const generateResponseSpy = sinon.spy(llm, "generateResponse");

  await npc.initialise();

  assert.is(generateResponseSpy.callCount, 1);
});

test("increaseFirewoodKg adds kg to current firewood kg", () => {
  const llm = new LLMMock();
  const npc = new NPC(llm, "test_npc", "test_goal", ["rest"], { firewood: 0 });

  assert.is(npc.firewoodKg, 0);

  npc.increaseFirewoodKg(10);

  assert.is(npc.firewoodKg, 10);

  npc.increaseFirewoodKg(20);

  assert.is(npc.firewoodKg, 30);
});

test("act calls llm.generateResponse and returns the response", async () => {
  const llm = new LLMMock();
  const npc = new NPC(llm, "test_npc", "test_goal", ["rest"], { firewood: 0 });
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
