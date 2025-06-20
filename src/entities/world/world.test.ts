import { suite } from "uvu";
import * as assert from "uvu/assert";
import { World } from "./world.js";

const test = suite("World");

test("decreaseFirewoodKg removes kg to current firewood kg", () => {
  const world = new World("test_world", 100);

  assert.is(world.firewoodKg, 100);

  world.decreaseFirewood(10);

  assert.is(world.firewoodKg, 90);

  world.decreaseFirewood(20);

  assert.is(world.firewoodKg, 70);
});

test("decreaseFirewoodKg throws an exception if firewoodKg goes under 0", () => {
  const world = new World("test_world", 10);

  assert.throws(
    () => world.decreaseFirewood(20),
    "Firewood kg cannot be less than 0",
  );
});

test.run();
