import assert from "node:assert/strict";
import { simulate, synthesize } from "../public/engine/engine.js";

const andGate = "module dut(input a,b,output y); assign y=a&b; endmodule";
const andTb = `module tb; reg a,b; wire y; integer i;
dut u(a,b,y);
initial begin $dumpfile("dump.vcd"); $dumpvars(0,tb);
for(i=0;i<4;i=i+1) begin {a,b}=i; #5; if(y !== (a&b)) $fatal(1,"AND failed"); end
$display("ALL_PASS"); $finish; end endmodule`;
const result = await simulate(andGate, andTb);
assert.match(result.log, /ALL_PASS/);
assert.doesNotMatch(result.log, /ERROR:|FATAL:|dynamic linking/i);
assert.match(result.vcd, /\$enddefinitions/);
const counter =
  "module dut(input clk,rst,output reg [3:0] q); always @(posedge clk) if(rst) q<=0; else q<=q+1; endmodule";
const counterTb = `module tb; reg clk=0,rst=1; wire [3:0] q; dut u(clk,rst,q);
always #5 clk=~clk;
initial begin $dumpfile("dump.vcd"); $dumpvars(0,tb); #6; if(q!==0) $fatal(1,"reset"); rst=0; #10; if(q!==1) $fatal(1,"count"); $display("COUNTER_PASS"); $finish; end endmodule`;
assert.match((await simulate(counter, counterTb)).log, /COUNTER_PASS/);
const synthesis = await synthesize(andGate);
assert.equal(Object.keys(synthesis.netlist.modules.dut.cells).length, 1);
assert.equal(
  Object.values(synthesis.netlist.modules.dut.cells)[0].type,
  "$_AND_",
);
await assert.rejects(() => simulate("module invalid???", andTb));
// Emscripten sets process.exitCode for a deliberately failed compiler invocation.
process.exitCode = 0;
console.log(
  "PASS: AND exhaustive simulation, counter reset/count, real Yosys synthesis, compiler error rejection.",
);
