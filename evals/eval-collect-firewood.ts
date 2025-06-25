import { suite } from "uvu";
import * as assert from "uvu/assert";
import { NPC } from "../src/entities/npc/npc.js";
import { OllamaImplementation } from "../src/dependencies-implementations/llm-ollama.js";
import { actions } from "../src/usecases/actions.js";
import { evaluate } from "./utils/evaluate.js";
import { logTestResult } from "./utils/logger.js";

const ITERATIONS_NUMBER = process.env.ITERATIONS_NUMBER;

const test = suite(
  `Eval collect firewood with ${ITERATIONS_NUMBER} iterations`,
);

test("does not decide to collect firewood if the available amount is always less than 10", async () => {
  const testResult = await evaluate(
    Number(ITERATIONS_NUMBER),
    100,
    async () => {
      const llm = new OllamaImplementation();
      const npc = new NPC(llm, "test_npc", actions, {});
      const action = await npc.act(0);

      if (!action) {
        throw new Error("Action is empty, test fails.");
      }

      const testPassed = action.type !== "collect_firewood";

      logTestResult(JSON.stringify(action), testPassed);

      return testPassed;
    },
  );

  assert.ok(testResult);
});

test("decides to collect firewood if available firewood is more than 10", async () => {
  const testResult = await evaluate(Number(ITERATIONS_NUMBER), 80, async () => {
    const llm = new OllamaImplementation();
    const npc = new NPC(llm, "test_npc", actions, {});
    const action = await npc.act(20);

    if (!action) {
      throw new Error("Action is empty, test fails.");
    }

    const testPassed = action.type === "collect_firewood";

    logTestResult(JSON.stringify(action), testPassed);

    return testPassed;
  });

  assert.ok(testResult);
});

test.run();
