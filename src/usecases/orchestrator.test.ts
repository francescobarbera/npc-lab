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

  const orchestrator = new Orchestrator(world, [npc1, npc2]);

  assert.is(orchestrator.currentTurnNumber, 0);

  await orchestrator.nextTurn();

  assert.is(orchestrator.currentTurnNumber, 1);

  await orchestrator.nextTurn();

  assert.is(orchestrator.currentTurnNumber, 2);

  await orchestrator.nextTurn();

  assert.is(orchestrator.currentTurnNumber, 3);
});

test("when a npc action increase a resource, it increases for the npc and it decreases the resource in the world", async () => {
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

test("it return the current day based on the current turn", () => {
  const llm = new LLMMock(null, null);
  const npc1 = new NPC(llm, "npc_1_name", actionTypes, { iron: 20 });
  sinon.stub(npc1, "act").resolves({
    type: "rest",
    reason: "I am tired",
    actor: npc1,
  });

  const world = new World("world_name", { iron: 0 });

  const orchestrator = new Orchestrator(world, [npc1], 2);

  assert.is(orchestrator.currentDayNumber, 1);
  orchestrator.nextTurn();
  assert.is(orchestrator.currentDayNumber, 1);
  orchestrator.nextTurn();
  assert.is(orchestrator.currentDayNumber, 2);
  orchestrator.nextTurn();
  assert.is(orchestrator.currentDayNumber, 2);
  orchestrator.nextTurn();
  assert.is(orchestrator.currentDayNumber, 3);
  orchestrator.nextTurn();
  assert.is(orchestrator.currentDayNumber, 3);
});

test.run();
