# Multiplexers and data selection

## Goal

Build a circuit that selects one of two data sources. A 2:1 multiplexer has inputs a and b, a select signal sel, and output y. When sel is zero, y follows a. When sel is one, y follows b.

## Specify and verify

The conditional expression sel ? b : a directly expresses the rule. A bus multiplexer selects every bit together. Test both select values and vary the data. If a and b always match, a reversed select condition can escape detection.

Multiplexers appear before registers, inside ALUs and across CPU datapaths. Long chains of muxes can increase combinational delay. Synthesis may transform the structure while preserving observable behavior. Inspect both the truth table and the generated schematic.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input [3:0] a, b, input sel, output [3:0] y);
  assign y = sel ? b : a;
endmodule
```
