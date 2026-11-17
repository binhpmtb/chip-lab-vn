# Self-checking testbenches and VCD

## Goal

Drive inputs, observe outputs and compare them against expectations. A testbench surrounds the design under test, commonly called the DUT. Delays, display statements and finish commands serve simulation and usually do not synthesize into hardware.

## Check at the right time

Allow outputs to update after changing inputs. For sequential logic, check after nonblocking assignments have completed. Use !== when unexpected X or Z values should fail the comparison.

VCD records value changes over simulation time. $dumpfile chooses a filename and $dumpvars selects signal scope. Waveforms help locate a failure, while automatic checks make repeated tests practical. A passing test only establishes the cases exercised. Include boundaries, reset sequences and meaningful changes between inputs.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input a, b, output y);
  assign y = a & b;
endmodule

// Testbench is entered in the separate testbench editor.
// Use $dumpfile("wave.vcd") and $dumpvars(0, tb).
```
