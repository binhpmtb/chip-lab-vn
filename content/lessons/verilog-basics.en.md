# Modules, vectors and operators

## Goal

Read a module through its port interface. Inputs enter the block and outputs leave it. A vector declared [7:0] contains eight bits. The slice a[3:0] selects four low bits, while {a, b} concatenates two vectors.

## Choose the right operator

The expression ^a is a reduction XOR and combines all bits into one parity bit. The expression a ^ b performs bitwise XOR between two operands. These forms have different output widths and purposes.

In classic Verilog, reg identifies a procedural variable and does not by itself guarantee a physical register. SystemVerilog adds logic and always_comb/always_ff for clearer intent. Engine support varies, so introductory examples use a tested subset. Verify widths when connecting module instances.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input [7:0] a, output parity);
  assign parity = ^a;
endmodule
```
