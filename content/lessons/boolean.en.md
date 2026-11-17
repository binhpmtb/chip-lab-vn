# Boolean algebra and De Morgan

## Goal

Recognize equivalent Boolean expressions. De Morgan's laws state that ~(a & b) equals ~a | ~b, and ~(a | b) equals ~a & ~b. Parentheses make evaluation order clear and reduce mistakes during RTL edits.

## Expressions become hardware

A half-adder uses sum = a ^ b and carry = a & b. Together its outputs represent the sum of two bits. Check a = b = 1 carefully. Sum becomes zero while carry becomes one.

Simplification may reduce logic, but final mapping depends on synthesis passes and the cell library. Different expressions can produce the same optimized netlist. Prove equivalence with a truth table for small circuits before comparing cell counts. Functional correctness comes before area comparisons.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input a, b, output sum, carry);
  assign sum = a ^ b;
  assign carry = a & b;
endmodule
```
