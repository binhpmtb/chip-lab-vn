# Registers, enables and counters

## Goal

Build a counter with reset and enable. An n-bit register stores a state vector. At each clock edge, a counter may increment, hold or clear according to its controls.

## Control priority

When reset and enable are both active, the specification must say which wins. This example gives reset priority. Omitting an assignment in a sequential block when enable is low means holding the current state, which is valid flip-flop behavior.

A four-bit counter wraps from fifteen to zero because its result is restricted to four bits. Test wraparound, reset during operation and multiple disabled cycles. A clock enable preserves a clear clock domain. Generating clocks through combinational logic introduces additional timing concerns.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input clk, rst, en, output reg [3:0] q);
  always @(posedge clk)
    if (rst) q <= 4'd0;
    else if (en) q <= q + 1'b1;
endmodule
```
