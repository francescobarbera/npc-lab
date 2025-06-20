import { suite } from "uvu";
import * as assert from "uvu/assert";
import { isDefined } from "./isDefined.js";

const test = suite("isDefined utils");

test("returns true for defined values", () => {
  assert.ok(isDefined(0));
  assert.ok(isDefined(false));
  assert.ok(isDefined(""));
  assert.ok(isDefined([]));
  assert.ok(isDefined({}));
});

test("returns false for undefined and null", () => {
  assert.not.ok(isDefined(undefined));
  assert.not.ok(isDefined(null));
});

test("filters out undefined and null from array", () => {
  const mixed: Array<number | undefined | null> = [1, undefined, 2, null, 3];
  const result = mixed.filter(isDefined);
  assert.equal(result, [1, 2, 3]);

  const sum: number = result.reduce((a, b) => a + b, 0);

  assert.is(sum, 6);
});

test.run();
