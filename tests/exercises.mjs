import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { simulate } from "../public/engine/engine.js";
import { grade } from "../lib/grading.ts";

const exercises = JSON.parse(
  await readFile(new URL("../content/exercises.json", import.meta.url)),
);
const examples = JSON.parse(
  await readFile(new URL("../content/examples.json", import.meta.url)),
);
for (const exercise of exercises) {
  const result = await simulate(exercise.solution, exercise.testbench);
  assert.ok(grade(result.log, exercise.id), exercise.id + ': ' + result.log);
  assert.ok(result.vcd.includes("$enddefinitions"), exercise.id);
  let rejected = false;
  try {
    const wrong = await simulate(exercise.starter, exercise.testbench);
    rejected = !grade(wrong.log, exercise.id);
  } catch {
    rejected = true;
    process.exitCode = 0;
  }
  assert.ok(rejected, `${exercise.id}: empty implementation must fail`);
  console.log(`PASS ${exercise.id}: correct accepted; empty rejected`);
}
for (const example of examples) {
  const result = await simulate(example.design, example.testbench);
  assert.ok(result.log.includes("PASS"), example.id);
  assert.ok(result.vcd.includes("$enddefinitions"), example.id);
  console.log(`PASS example ${example.id}`);
}
