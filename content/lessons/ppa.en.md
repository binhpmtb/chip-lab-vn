# Cell libraries and PPA tradeoffs

## Goal

Understand the inputs needed for power, performance and area analysis. Liberty libraries describe cell timing, capacitance and power characteristics under specified conditions. LEF provides abstract geometry for placement and routing.

## Conditional comparisons

A larger cell may drive a load faster while increasing area and input capacitance. Timing optimization can insert buffers or duplicate logic. Dynamic power depends on switching activity, load and voltage, so cell count alone cannot determine power consumption.

Playground statistics help explain logic structure. A physical PPA report needs a process, operating corner, constraints and a known flow stage. Record those conditions with the result so another learner can reproduce the measurement. Compare equivalent functionality and identical analysis settings.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input [3:0] a, output y);
  assign y = |a;
endmodule
```
