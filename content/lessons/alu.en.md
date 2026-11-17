# Adders and a small ALU

## Goal

Combine several operations into an arithmetic logic unit. An opcode selects addition, AND, OR or XOR. The output width determines whether carry is retained or only the lower sum bits are kept. Include this behavior in the specification.

## Boundary cases

Test zero, the largest value and alternating bit patterns. For four-bit addition, fifteen plus one exercises overflow. For AND, inputs 1010 and 0101 exercise independent bit positions.

A combinational ALU needs no clock. Its output responds to data and opcode changes. After synthesis, some logic may be shared and multiplexers select the result. Cell counts depend on optimization and mapping. Record the synthesis commands when comparing versions so the comparison is reproducible.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input [3:0] a, b, input op, output [3:0] y);
  assign y = op ? (a & b) : (a + b);
endmodule
```
