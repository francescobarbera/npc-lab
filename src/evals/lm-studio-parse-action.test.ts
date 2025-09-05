import { suite } from "uvu";
import * as assert from "uvu/assert";
import { evaluate } from "./utils/evaluate.js";
import { logTestResult } from "./utils/logger.js";
import { GroqImplementation } from "../dependencies-implementations/groq.js";
import {
  generateNPCActiveResponse,
  generateNPCRestResponse,
} from "./utils/generate-npc-response.js";

const ITERATIONS_NUMBER = process.env.ITERATIONS_NUMBER;

const test = suite(
  `Eval lm studio detectActionType implementation with ${ITERATIONS_NUMBER} iterations`,
);

/*
 * The test is coupled to the concept of action insists on a resource.
 * In the future we could have actions that insists on more that one resource.
 * Probably the test will be no longer enough.
 */

test("correctly parses the action if it is included in the actions list", async () => {
  const testResult = await evaluate(
    Number(ITERATIONS_NUMBER),
    100,
    async () => {
      const llm = new GroqImplementation();
      const actions = [
        "collect_gold",
        "collect_firewood",
        "collect_stone",
        "collect_iron",
        "collect_grain",
      ];
      const resources = ["gold", "firewood", "stone", "iron", "grain"];
      const randomResource =
        resources[Math.floor(Math.random() * resources.length)];

      const action = await llm.detectActionType(actions, {
        sender: "npc",
        content: generateNPCActiveResponse(randomResource),
      });

      const testPassed = action === `collect_${randomResource}`;

      logTestResult(JSON.stringify(action), testPassed);

      return testPassed;
    },
  );

  assert.ok(testResult);
});

test("correctly parses the action deciding to rest", async () => {
  const testResult = await evaluate(
    Number(ITERATIONS_NUMBER),
    100,
    async () => {
      const llm = new GroqImplementation();
      const actions = ["rest"];

      const action = await llm.detectActionType(actions, {
        sender: "npc",
        content: generateNPCRestResponse(),
      });

      const testPassed = action === "rest";

      logTestResult(JSON.stringify(action), testPassed);

      return testPassed;
    },
  );

  assert.ok(testResult);
});

test.run();
