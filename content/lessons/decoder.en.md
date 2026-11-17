# Decoders and priority encoding

## Goal

Distinguish decoding from priority encoding. A two-to-four decoder asserts the output bit selected by its address. Address 00 selects bit zero and address 11 selects bit three. A priority encoder resolves multiple requests by choosing the highest-priority active input.

## Avoid unintended latches

In an always @* block, assign each output along every control path. A default assignment before a case or if statement makes coverage explicit. An omitted assignment can imply that the previous value must be retained, inferring a latch.

The order of an if/else chain expresses priority. Test simultaneous requests and the no-request case. For a decoder, check every address against its expected one-hot output.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input [1:0] a, output [3:0] y);
  assign y = 4'b0001 << a;
endmodule
```
