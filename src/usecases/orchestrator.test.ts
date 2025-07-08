import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { Orchestrator } from "./orchestrator.js";
import { actionTypes, type Action } from "../types/action.js";
import { NPCMock } from "../utils/mocks/npc-mock.js";
import { WorldMock } from "../utils/mocks/world-mock.js";
import { NPC } from "../entities/npc/npc.js";
import { LLMMock } from "../utils/mocks/llm-mock.js";
import { World } from "../entities/world/world.js";

const test = suite("Orchestrator");

test("nextTurn increments turn and processes NPC actions", async () => {
  const npc1 = new NPCMock();
  const npc2 = new NPCMock();

  const action1: Action = {
    type: "rest",
    reason: "reason",
    actor: npc1,
  };
  const action2: Action = {
    type: "rest",
    reason: "reason",
    actor: npc2,
  };

  sinon.stub(npc1, "act").resolves(action1);
  sinon.stub(npc2, "act").resolves(action2);

  const world = new WorldMock();
  const worldHandleActionSpy = sinon.spy(world, "handleAction");
  const npc1HandleActionSpy = sinon.spy(npc1, "handleAction");
  const npc2HandleActionSpy = sinon.spy(npc2, "handleAction");

  const orchestrator = new Orchestrator(world, [npc1, npc2]);

  assert.is(orchestrator.currentTurnNumber, 0);

  await orchestrator.nextTurn();

  assert.is(orchestrator.currentTurnNumber, 1);

  await orchestrator.nextTurn();

  assert.is(orchestrator.currentTurnNumber, 2);

  await orchestrator.nextTurn();

  assert.is(orchestrator.currentTurnNumber, 3);
});

test("if a npc action increase a resource and that resource is available in the world, increase for the npc and it decreases the resource in the world", async () => {
  const llm = new LLMMock(null, null);
  const npc1 = new NPC(llm, "npc_1_name", actionTypes, {});
  sinon.stub(npc1, "act").resolves({
    type: "collect_iron",
    reason: "reason",
    actor: npc1,
  });

  const world = new World("world_name", { iron: 50 });

  const orchestrator = new Orchestrator(world, [npc1]);

  assert.is(npc1.resources.iron, 0);
  assert.is(world.resources.iron, 50);

  await orchestrator.nextTurn();

  assert.is(npc1.resources.iron, 10);
  assert.is(world.resources.iron, 40);
});

test("if a npc action increase a resource and that resource is NOT available in the world, npc's and world's resource does not change", async () => {
  const llm = new LLMMock(null, null);
  const npc1 = new NPC(llm, "npc_1_name", actionTypes, { iron: 20 });
  sinon.stub(npc1, "act").resolves({
    type: "collect_iron",
    reason: "reason",
    actor: npc1,
  });

  const world = new World("world_name", { iron: 0 });

  const orchestrator = new Orchestrator(world, [npc1]);

  assert.is(npc1.resources.iron, 20);
  assert.is(world.resources.iron, 0);

  await orchestrator.nextTurn();

  assert.is(npc1.resources.iron, 20);
  assert.is(world.resources.iron, 0);
});

test.run();
