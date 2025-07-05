import { NPC } from "./entities/npc/npc.js";
import { Orchestrator } from "./usecases/orchestrator.js";
import { World } from "./entities/world/world.js";
import Logger from "./utils/logger.js";
import { actionTypes } from "./types/action.js";
import { LMStudioImplementation } from "./dependencies-implementations/lm-studio.js";

const logger = new Logger("Main");

const iterations = Number(process.argv[2]);

if (Number.isNaN(iterations)) {
  logger.error("Number of iterations must be provided, use 0 to keep rolling");
  process.exit(1);
}

const llm = new LMStudioImplementation();

const npcs: NPC[] = [
  new NPC(llm, "Carl", [...actionTypes], {}),
  new NPC(llm, "Bob", [...actionTypes], {}),
];

const world = new World("world_1", { firewood: 50 });

const orchestrator = new Orchestrator(world, npcs);

for (let i = 0; iterations === 0 || i < iterations; i++) {
  await orchestrator.nextTurn();
}
