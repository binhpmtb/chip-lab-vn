# Latches, flip-flops and reset

## Goal

Understand how circuits retain state. A level-sensitive latch can pass data while its enable is active. An edge-triggered flip-flop samples data at a clock edge. Their timing behavior differs.

## Describe a flip-flop

An always @(posedge clk) block updates on rising edges. Use nonblocking assignments, written <=, for sequential state. Right-hand expressions observe old state at the edge and updates are scheduled afterward. This lets a pipeline behave as separate registers.

A synchronous reset acts at a clock edge. An asynchronous reset appears in the event list and may act between edges. Match the testbench to the specified reset type. Check reset assertion, release and normal data capture, including changes between clock edges.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input clk, rst, d, output reg q);
  always @(posedge clk)
    if (rst) q <= 1'b0;
    else q <= d;
endmodule
```
