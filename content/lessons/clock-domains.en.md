# Clock domains and synchronization

## Goal

Recognize signals arriving from another clock or from outside the chip. Such a signal may change near the receiving edge. The first sampling flip-flop can become metastable, an analog condition that takes time to resolve.

## Synchronizing one bit

Two receiving-clock flip-flops are commonly used for a sufficiently slow single-bit level. The second stage allows additional resolution time and reduces failure probability. It cannot remove all risk or guarantee capture of every short pulse.

Multi-bit transfers require a suitable protocol, such as a handshake or asynchronous FIFO. Independently synchronizing every bit can produce an inconsistent word. RTL simulation checks update sequences, while CDC correctness and metastability reliability require separate analysis.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input clk, async_in, output reg sync_out);
  reg first;
  always @(posedge clk) begin
    first <= async_in;
    sync_out <= first;
  end
endmodule
```
