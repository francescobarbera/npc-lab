import { OllamaImplementation } from "./dependencies-implementations/llm-ollama.js";
import { collectFirewoodPrompt } from "./entities/action.js";
import { NPC } from "./entities/npc/npc.js";
import { Orchestrator } from "./usecases/orchestrator.js";
import { World } from "./entities/world/world.js";
import Logger from "./utils/logger.js";

const logger = new Logger("Main");

const iterations = Number(process.argv[2]);

if (Number.isNaN(iterations)) {
  logger.error("Number of iterations must be provided, use 0 to keep rolling");
  process.exit(1);
}

const llm = new OllamaImplementation();

const npcs: NPC[] = [
  new NPC(llm, "Carl", [collectFirewoodPrompt], {}),
  new NPC(llm, "Bob", [collectFirewoodPrompt], {}),
];

const world = new World("world_1", { firewood: 50 });

const orchestrator = new Orchestrator(world, npcs);
await orchestrator.initialise();

for (let i = 0; iterations === 0 || i < iterations; i++) {
  await orchestrator.nextTurn();
}
