# DRC, LVS and reproducible portfolios

## Goal

Distinguish geometry checks from connectivity checks. Design rule checking evaluates layout against process rules, including widths and spacing. Layout versus schematic compares the extracted circuit with a reference netlist. Timing analysis checks temporal requirements at selected corners.

## Preserve evidence

A learning project should identify its RTL commit, tool versions, PDK, target clock and execution command. Save reports, layout images and known limitations. When changing utilization or clock period, compare the same metrics and explain the causes.

A Physical Design learning path can begin with a small counter and grow toward an ALU, UART or CPU. Completing a reproducible flow and explaining its logs builds a foundation for deeper timing closure. A clean check applies to its configured rules and analysis scope.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input clk, rst, en, output reg [3:0] q);
  always @(posedge clk)
    if (rst) q <= 0;
    else if (en) q <= q + 1'b1;
endmodule
```
