import { NPC } from "./entities/npc/npc.js";
import { Orchestrator } from "./usecases/orchestrator.js";
import { World } from "./entities/world/world.js";
import Logger from "./utils/logger.js";
import { actionTypes } from "./types/action.js";
import { GroqImplementation } from "./dependencies-implementations/groq.js";

const logger = new Logger("Main");

const iterations = Number(process.argv[2]);

if (Number.isNaN(iterations)) {
  logger.error("Number of iterations must be provided, use 0 to keep rolling");
  process.exit(1);
}

const llm = new GroqImplementation();

const npcs: NPC[] = [
  new NPC(llm, "Carl", actionTypes, {}, { firewood: 10, water: 20, fish: 40 }),
  new NPC(llm, "Bob", actionTypes, {}, { stone: 30, water: 30, grain: 60 }),
];

const world = new World("world_1", {
  firewood: 50,
  water: 200,
  fish: 50,
  stone: 10,
  grain: 50,
});

const orchestrator = new Orchestrator(world, npcs);

for (let i = 0; iterations === 0 || i < iterations; i++) {
  await orchestrator.nextTurn();
}

for (const npc of npcs) {
  logger.info(`${npc.name} ${JSON.stringify(npc.resources, null, 2)}`);
}
logger.info(JSON.stringify(world.resources, null, 2));
