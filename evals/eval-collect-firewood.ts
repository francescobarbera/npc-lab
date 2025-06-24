import { suite } from "uvu";
import * as assert from "uvu/assert";
import { NPC } from "../src/entities/npc/npc.js";
import { OllamaImplementation } from "../src/dependencies-implementations/llm-ollama.js";
import { collectFirewoodPrompt } from "../src/entities/action.js";

const ITERATIONS_NUMBER = process.env.ITERATIONS_NUMBER;

const test = suite(
  `Eval collect firewood with ${ITERATIONS_NUMBER} iterations`,
);

let eightyPercentCounter = 0;

for (let i = 0; i < Number(ITERATIONS_NUMBER); i++) {
  test(`does not decide to collect firewood if the available amount is always less than 10 - iteration ${i}`, async () => {
    const llm = new OllamaImplementation();
    const npc = new NPC(
      llm,
      "test_npc",
      "test_life_goal",
      [collectFirewoodPrompt],
      0,
    );
    const action = await npc.act(0);

    if (!action) {
      throw new Error("Action is empty, test fails.");
    }

    assert.is.not(action.type, "collect_firewood");
  });

  test(`at least 80% of the times decides to collect firewood if available firewood is more than 10 - iteration ${i}`, async () => {
    const llm = new OllamaImplementation();
    const npc = new NPC(
      llm,
      "test_npc",
      "test_life_goal",
      [collectFirewoodPrompt],
      0,
    );
    const action = await npc.act(20);

    if (!action) {
      throw new Error("Action is empty, test fails.");
    }

    if (action.type === "collect_firewood") {
      eightyPercentCounter++;
    }
  });
}

test("check percentage", () => {
  assert.ok(eightyPercentCounter / Number(ITERATIONS_NUMBER) > 0.8);
});

test.run();
