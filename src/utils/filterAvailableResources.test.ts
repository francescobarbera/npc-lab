import { suite } from "uvu";
import * as assert from "uvu/assert";
import type { ResourcesStatus } from "../types/resources.js";
import { filterAvailableResources } from "./filterAvailableResources.js";

const test = suite("filterAvailableResources utils");

test("returns an empty record set if all the resources are set to 0", () => {
  const resources: ResourcesStatus = {
    firewood: 0,
    gold: 0,
    iron: 0,
    stone: 0,
    grain: 0,
    water: 0,
    clay: 0,
    wool: 0,
    fish: 0,
    herbs: 0,
  };

  const result = filterAvailableResources(resources);

  assert.ok(Object.keys(result).length === 0);
});

test("returns only the resources NOT set to 0", () => {
  const resources: ResourcesStatus = {
    firewood: 10,
    gold: 0,
    iron: 0,
    stone: 150,
    grain: 0,
    water: 0,
    clay: 20,
    wool: 0,
    fish: 0,
    herbs: 0,
  };

  const result = filterAvailableResources(resources);

  assert.ok(Object.keys(result).length === 3);
  assert.is(result.firewood, 10);
  assert.is(result.stone, 150);
  assert.is(result.clay, 20);
});

test.run();
