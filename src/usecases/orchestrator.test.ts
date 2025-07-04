import { suite } from "uvu";
import sinon from "sinon";
import * as assert from "uvu/assert";
import { Orchestrator } from "./orchestrator.js";
import type { Action } from "../types/action.js";
import { NPCMock } from "../utils/mocks/npc-mock.js";
import { WorldMock } from "../utils/mocks/world-mock.js";

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

  assert.ok((npc1.act as sinon.SinonStub).calledWith(world.resources));
  assert.ok((npc2.act as sinon.SinonStub).calledWith(world.resources));

  assert.ok(worldHandleActionSpy.calledWith(action1));
  assert.ok(worldHandleActionSpy.calledWith(action2));

  assert.ok(npc1HandleActionSpy.calledWith(action1));
  assert.ok(npc2HandleActionSpy.calledWith(action2));
});

test("nextTurn filters out null actions", async () => {
  const npc1 = new NPCMock();
  const npc2 = new NPCMock();

  const action: Action = {
    type: "rest",
    reason: "reason",
    actor: npc1,
  };

  sinon.stub(npc1, "act").resolves(action);
  sinon.stub(npc2, "act").resolves(null);

  const world = new WorldMock();
  const worldHandleActionSpy = sinon.spy(world, "handleAction");
  const npc1HandleActionSpy = sinon.spy(npc1, "handleAction");
  const npc2HandleActionSpy = sinon.spy(npc2, "handleAction");

  const orchestrator = new Orchestrator(world, [npc1, npc2]);

  await orchestrator.nextTurn();

  // Handlers are always called with action and never with null
  assert.ok(worldHandleActionSpy.calledOnceWith(action));
  assert.ok(npc1HandleActionSpy.calledOnceWith(action));
  assert.is(npc2HandleActionSpy.callCount, 0);
});

test.run();
