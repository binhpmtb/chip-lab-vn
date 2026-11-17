# Finite state machines and edge detection

## Goal

Describe history-dependent behavior with a finite state machine. An FSM has current state, transition rules and outputs. Moore outputs depend on state. Mealy outputs may also depend on current inputs.

## A tiny state machine

A rising-edge detector remembers the previous sampled input. When the current input is one and the remembered value is zero, it reports an edge. Specify whether that output is combinational or registered so the testbench checks at the correct time.

Draw states and transition conditions before coding. Test reset, self-loops, every transition and consecutive input sequences. Default assignments in next-state logic prevent unintended latches. Correctness must hold across long sequences as well as individual transitions.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input clk, rst, signal_in, output pulse);
  reg previous;
  always @(posedge clk)
    if (rst) previous <= 1'b0;
    else previous <= signal_in;
  assign pulse = signal_in & ~previous;
endmodule
```
