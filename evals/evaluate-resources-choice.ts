import { suite } from "uvu";
import * as assert from "uvu/assert";
import { NPC } from "../src/entities/npc/npc.js";
import { evaluate } from "./utils/evaluate.js";
import { logTestResult } from "./utils/logger.js";
import { resourcesStatusMock } from "../src/utils/mocks/resources-status-mock.js";
import { LMStudioImplementation } from "../src/dependencies-implementations/lm-studio.js";

const ITERATIONS_NUMBER = process.env.ITERATIONS_NUMBER;

const test = suite(
  `Eval resources choice with ${ITERATIONS_NUMBER} iterations`,
);

test("if all resources are set to 0 the chosen action is rest", async () => {
  const testResult = await evaluate(
    Number(ITERATIONS_NUMBER),
    100,
    async () => {
      const actions = [
        "collect_gold",
        "collect_firewood",
        "collect_stone",
        "collect_iron",
        "collect_grain",
        "rest",
      ];
      const llm = new LMStudioImplementation();
      const npc = new NPC(llm, "test_npc", actions, {});
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
