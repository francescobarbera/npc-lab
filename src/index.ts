import { OllamaImplementation } from "./dependencies-implementations/ollama.js";
import { NPC } from "./entities/npc.js";
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
    "You can collect firewood by cutting down trees.",
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
    "You can collect firewood by cutting down trees.",
    0,
  ),
];

const world = new World(llm, "world_1", npcs, 50);
await world.initialise();

for (let i = 0; iterations === 0 || i < iterations; i++) {
  await world.nextTurn();
}
