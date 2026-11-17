# Logic gates and truth tables

## Goal

Translate a verbal rule into a truth table. AND produces one only when both inputs are one. OR produces one when either input is one. XOR detects unequal input bits. NOT complements each bit.

## Exhaustive checking

Two one-bit inputs have four combinations. Test 00, 01, 10 and 11. A truth table is a compact specification that can be checked exhaustively. With buses, & and | operate bit by bit. The && and || operators evaluate the logical truth of their operands instead.

A continuous assignment describes combinational behavior. When an input changes, the simulator schedules an output update. An assignment alone does not create a clock or storage element. Compare the waveform against every row of your table.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input a, b, output y);
  assign y = a & b;
endmodule
```
