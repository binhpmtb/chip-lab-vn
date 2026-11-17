# Bits, binary and width

## Goal

Read a binary value and determine how many bits it needs. An unsigned n-bit value ranges from zero through 2^n − 1. For example, 4'b1010 represents ten, with weights 8, 4, 2 and 1 from left to right.

## Width is part of the design

Adding two four-bit operands can produce thirty, requiring five result bits. Keeping only four bits gives a result modulo sixteen. Choose that behavior deliberately and preserve carry when it matters.

Verilog literals can specify both width and base. Use 4'd10 for a four-bit decimal ten. A simulation value may contain X when it has not been initialized. X represents missing knowledge. Inspect reset and initialization before diagnosing the logic itself.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input [3:0] a, b, output [4:0] y);
  assign y = {1'b0, a} + {1'b0, b};
endmodule
```
