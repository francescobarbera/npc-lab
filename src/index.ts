import { OllamaImplementation } from "./dependencies-implementations/llm-ollama.js";
import { collectFirewoodPrompt } from "./entities/action.js";
import { NPC } from "./entities/npc/index.js";
import { Orchestrator } from "./entities/orchestrator.js";
import { World } from "./entities/world.js";
import Logger from "./utils/logger.js";

const logger = new Logger("Main");

const iterations = Number(process.argv[2]);

if (Number.isNaN(iterations)) {
  logger.error("Number of iterations must be provided, use 0 to keep rolling");
  process.exit(1);
}

const llm = new OllamaImplementation();

const npcs: NPC[] = [
  new NPC(
    llm,
    "Carl",
    `
        It's your turn.
        You are a person living in a world with other people.
        You are a lumberjack.
        If you have less than 50 kg of firewood, you may choose to collect firewood.
        If you have at least 50 kg of firewood, you may choose to rest.
    `,
    [collectFirewoodPrompt],
    0,
  ),
  new NPC(
    llm,
    "Bob",
    `
        It's your turn.
        You are a person living in a world with other people.
        You are a lumberjack.
        If you have less than 50 kg of firewood, you may choose to collect firewood.
        If you have at least 50 kg of firewood, you may choose to rest.
    `,
    [collectFirewoodPrompt],
    0,
  ),
];

const world = new World("world_1", 50);

const orchestrator = new Orchestrator(world, npcs);
await orchestrator.initialise();

for (let i = 0; iterations === 0 || i < iterations; i++) {
  await orchestrator.nextTurn();
}
