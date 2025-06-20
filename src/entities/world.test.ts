// test/world.test.ts
import { suite } from "uvu";
import * as assert from "uvu/assert";
import sinon from "sinon";
import { World } from "./world.js";
import { NPC } from "./npc.js";
import type { LLMInterface } from "../dependencies-interfaces/llm.js";

class FakeLLMImplementation implements LLMInterface {
  async generateResponse(): Promise<null> {
    return null;
  }
}
const llm = new FakeLLMImplementation();

const test = suite("World class");

test("initialise calls initialise on all NPCs", async () => {
  const npc1 = new NPC(llm, "test", "test", [], 0);
  const npc2 = new NPC(llm, "test2", "test2", [], 0);

  const npc1InitStub = sinon.stub(npc1, "initialise").resolves();
  const npc2InitStub = sinon.stub(npc2, "initialise").resolves();

  const world = new World("test_world", [npc1, npc2], 100);

  await world.initialise();

  assert.ok(npc1InitStub.calledOnce);
  assert.ok(npc2InitStub.calledOnce);
});

test("nextTurn increases turn", async () => {
  const world = new World("test_world", [], 10);

  assert.is(world.currentTurnNumber, 0);

  await world.nextTurn();

  assert.is(world.currentTurnNumber, 1);
});

test("nextTurn calls each npc's act method passing the current firewood", async () => {
  const npc1 = new NPC(llm, "npc_1", "life_goal", [], 0);
  const npc1ActStub = sinon.stub(npc1, "act").resolves(null);

  const npc2 = new NPC(llm, "npc_2", "life_goal", [], 0);
  const npc2ActStub = sinon.stub(npc2, "act").resolves(null);

  const world = new World("test_world", [npc1, npc2], 10);

  await world.nextTurn();

  assert.ok(npc1ActStub.calledWith(10));
  assert.ok(npc2ActStub.calledWith(10));
});

// test("nextTurn calls each npc's handleAction method passing the result of act if it is not null", async () => {
//     const eventType: EventType = 'rest';

//     const npc1 = new NPC(llm, "test", "test", [], 0);
//     sinon.stub(npc1, "act").resolves({type: eventType});
//     const npc1HandleEventStub = sinon.stub(npc1, "handleAction").resolves();

//     const npc2 = new NPC(llm, "test2", "test2", [], 0);
//     sinon.stub(npc2, "act").resolves({type: eventType});
//     const npc2HandleEventStub = sinon.stub(npc2, "handleAction").resolves();

//     const npc3 = new NPC(llm, "test3", "test3", [], 0);
//     sinon.stub(npc3, "act").resolves(null);
//     const npc3HandleEventStub = sinon.stub(npc3, "handleAction").resolves();

//     const world = new World('test', [npc1, npc2, npc3], 10);

//     await world.nextTurn();

//     assert.ok(npc1HandleEventStub.calledWith({type: eventType}));
//     assert.ok(npc2HandleEventStub.calledWith({type: eventType}));
//     assert.ok(npc3HandleEventStub.not.called);
// });

test.run();
