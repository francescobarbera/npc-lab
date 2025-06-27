import { suite } from "uvu";
import * as assert from "uvu/assert";
import { NPC } from "../src/entities/npc/npc.js";
import { OllamaImplementation } from "../src/dependencies-implementations/llm-ollama.js";
import { evaluate } from "./utils/evaluate.js";
import { logTestResult } from "./utils/logger.js";
import { resourcesStatusMock } from "../src/utils/mocks/resources-status-mock.js";
import { actionTypes } from "../src/types/action.js";

const ITERATIONS_NUMBER = process.env.ITERATIONS_NUMBER;

const test = suite(
  `Eval collect firewood with ${ITERATIONS_NUMBER} iterations`,
);

test("all the resources are set to 0, so no rule passes, it must decide to rest", async () => {
  const testResult = await evaluate(
    Number(ITERATIONS_NUMBER),
    100,
    async () => {
      const llm = new OllamaImplementation();
      const npc = new NPC(llm, "test_npc", [...actionTypes], {});
      const action = await npc.act(resourcesStatusMock);

      if (!action) {
        throw new Error("Action is empty, test fails.");
      }

      const testPassed = action.type === "rest";

      logTestResult(JSON.stringify(action), testPassed);

      return testPassed;
    },
  );

  assert.ok(testResult);
});

test.run();
