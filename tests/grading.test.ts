import { test } from "node:test";
import assert from "node:assert/strict";
import { grade, readProgress, basicLint } from "../lib/grading";
test("grading requires exact marker and rejects failures", () => {
  assert.equal(grade("CHIPLAB_PASS_and", "and"), true);
  assert.equal(grade("prefix CHIPLAB_PASS_and", "and"), false);
  assert.equal(grade("CHIPLAB_PASS_and\nFATAL: mismatch", "and"), false);
  assert.equal(grade("CHIPLAB_PASS_other", "and"), false);
});
test("progress survives invalid and old data", () => {
  assert.deepEqual(readProgress("invalid"), []);
  assert.deepEqual(readProgress('["one",null,5]'), ["one"]);
  assert.deepEqual(readProgress("{}"), []);
});
test("lint ignores comments and checks module boundaries", () => {
  assert.deepEqual(basicLint("// module\nmodule top; endmodule"), []);
  assert.equal(basicLint("module top;").length, 1);
});
