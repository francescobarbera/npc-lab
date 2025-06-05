import { OpenAIImplementation } from "./dependencies-implementations/llm";
import { NPC } from "./entities/npc";
import { World } from "./entities/world";
import Logger from "./utils/logger";

const logger = new Logger('Main');

const run = async () => {
  logger.info("START");

  if (!process.env.OPENAI_API_KEY) {
    throw Error("OPENAI_API_KEY must be provided");
  }
  const llm = new OpenAIImplementation(process.env.OPENAI_API_KEY);

  const npcs: NPC[] = [
    new NPC(
      llm,
      "Carl",
      `
                It's your turn.
                You are a person living in a world with other people.
                You are a lumberjack.
                If you have less than 10 gold, you may choose to sell firewood to earn more.
                If you have less than 50 kg of firewood, you may choose to collect firewoodor buy it from others.
                If you have at least 10 gold and at least 50 kg of firewood, you may choose to rest.
            `,
      "You can collect firewood by cutting down trees.",
      "You can buy or sell goods, exchanging gold for firewood or vice versa.",
      10,
      10,
    ),
    new NPC(
      llm,
      "Bob",
      `
                It's your turn.
                You are a person living in a world with other people.
                You are a lumberjack.
                If you have less than 10 gold, you may choose to sell firewood to earn more.
                If you have less than 50 kg of firewood, you may choose to collect firewoodor buy it from others.
                If you have at least 10 gold and at least 50 kg of firewood, you choose to rest.
            `,
      "You can collect firewood by cutting down trees.",
      "You can buy or sell goods, exchanging gold for firewood or vice versa.",
      10,
      10,
    ),
  ];

  const world = new World(llm, "world_1", npcs);
  await world.initialise();

  for (let i = 0; i < 10; i++) {
    await world.nextTurn();
  }
};

run();
