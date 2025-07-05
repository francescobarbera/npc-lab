import { suite } from "uvu";
import * as assert from "uvu/assert";
import { evaluate } from "./utils/evaluate.js";
import { logTestResult } from "./utils/logger.js";
import { LMStudioImplementation } from "../src/dependencies-implementations/lm-studio.js";
import {
  generateNPCActiveResponse,
  generateNPCRestResponse,
} from "./utils/generate-npc-response.js";

const ITERATIONS_NUMBER = process.env.ITERATIONS_NUMBER;

const test = suite(
  `Eval lm studio parseAction implementation with ${ITERATIONS_NUMBER} iterations`,
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
      const llm = new LMStudioImplementation();
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

      const action = await llm.parseAction(actions, {
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
      const llm = new LMStudioImplementation();
      const actions = ["rest"];
      const resources = ["gold", "firewood", "stone", "iron", "grain"];

      const action = await llm.parseAction(actions, {
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

test("returns null if in the sentence it is not clear what action to extract", async () => {
  const testResult = await evaluate(
    Number(ITERATIONS_NUMBER),
    100,
    async () => {
      const llm = new LMStudioImplementation();
      const actions = [
        "collect_gold",
        "collect_firewood",
        "collect_stone",
        "collect_iron",
        "collect_grain",
      ];
      const unknownResource = ["water", "clay", "wool", "fish", "herbs"];
      const randomUnknownResource =
        unknownResource[Math.floor(Math.random() * unknownResource.length)];

      const a = generateNPCActiveResponse(randomUnknownResource);
      const action = await llm.parseAction(actions, {
        sender: "npc",
        content: a,
      });

      if (action) {
        console.log(a);
      }
      const testPassed = action === null;

      logTestResult(JSON.stringify(action), testPassed);

      return testPassed;
    },
  );

  assert.ok(testResult);
});

test.run();
