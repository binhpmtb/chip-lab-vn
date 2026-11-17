# From RTL to a netlist

## Goal

Follow RTL as it becomes cells and connections. Synthesis parses the source, builds an intermediate representation, lowers processes into logic and applies optimizations. Yosys write_json exports a netlist suitable for schematic rendering.

## Read the result

Cell types describe functions, ports describe connections and bit identifiers link signals. Logic that cannot affect an observable output may disappear. Constants can eliminate whole branches. RTL line count therefore does not measure area.

Generic synthesis produces technology-independent cells. Technology mapping chooses cells from a target library. Keep the same top module, synthesis commands and target when comparing designs. Recheck functionality after an edit before interpreting differences in cell counts. Inspect warnings as well as the final diagram.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input a, b, output y);
  assign y = ~(a & b);
endmodule
```
