# Floorplan, placement, CTS and routing

## Goal

Trace a netlist toward layout. Floorplanning defines core dimensions, macros, I/O placement and power structure. Placement locates standard cells in legal sites. Clock tree synthesis distributes clocks to sequential elements. Routing connects pins through metal layers and vias.

## A feedback process

Placement and routing change wire delays and therefore timing. Congestion may require a revised placement or larger area. Optimization steps are often repeated. OpenROAD and OpenLane automate the flow while designers still inspect constraints, logs and reports.

The small RTL example can be an input to an external physical flow. The browser runs simulation and synthesis. Producing GDSII requires a PDK and reproducible flow configuration. Save intermediate reports so changes can be traced to a specific stage.

## Try in the playground

Read the port names and widths before running. Open the matching example, change one expression and rerun its testbench. Inspect the outputs and diagnostic messages.

```verilog
module top(input clk, rst, output reg [3:0] q);
  always @(posedge clk)
    if (rst) q <= 0;
    else q <= q + 1'b1;
endmodule
```
