import assert from "node:assert/strict";
import { test } from "node:test";
import { parseVcd } from "../lib/vcd.ts";

test("VCD parses hierarchy, shared aliases, vectors, unknowns and time units", () => {
  const waveform = parseVcd(`$timescale 10 ps $end
$scope module tb $end
$var wire 1 ! clk $end
$scope module dut $end
$var wire 1 ! clock $end
$var wire 4 " data [3:0] $end
$upscope $end
$upscope $end
$enddefinitions $end
$dumpvars
0!
bxxxx "
$end
#5
1!
b1010 "
#10
z!
`);
  assert.equal(waveform.timescale, "10 ps");
  assert.equal(waveform.endTime, 10);
  assert.deepEqual(
    waveform.signals.map((signal) => signal.name),
    ["tb.clk", "tb.dut.clock", "tb.dut.data [3:0]"],
  );
  assert.equal(waveform.signals[0].changes, waveform.signals[1].changes);
  assert.deepEqual(waveform.signals[2].changes, [
    { time: 0, value: "xxxx" },
    { time: 5, value: "1010" },
  ]);
  assert.equal(waveform.signals[0].changes.at(-1).value, "z");
});

test("VCD parser safely accepts empty input and ignores real-valued variables", () => {
  assert.deepEqual(parseVcd(""), {
    timescale: "1 ns",
    endTime: 0,
    signals: [],
  });
  assert.equal(
    parseVcd("$var real 1 ! voltage $end\n#1\nr3.1 !").signals.length,
    0,
  );
});
