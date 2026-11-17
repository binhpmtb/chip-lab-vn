# Setup, hold and critical paths

## Goal

Understand why data must remain stable around a sampling edge. Setup requires data to arrive sufficiently before the clock edge. Hold requires it to remain stable afterward. Violations may cause unreliable hardware behavior.

## A register-to-register path

Data travels through the launching register's clock-to-Q delay, combinational cells and interconnect before reaching the receiving register. Setup analysis compares arrival time with required time. Negative slack indicates a violation under the analyzed conditions.

Ideal RTL simulation usually omits cell delays and metastability. A functionally correct waveform cannot establish timing closure. Pipelining divides logic across stages, reducing long paths at the cost of latency. Physical timing analysis needs suitable libraries, parasitics and clock constraints.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input clk, input [3:0] a, b, output reg [4:0] q);
  always @(posedge clk) q <= {1'b0, a} + {1'b0, b};
endmodule
```
