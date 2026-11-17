# Exercise and example validation

The collection contains 20 original bilingual exercises across seven modules. Each exercise has a top-level module named `top`, a separate `tb` testbench, hints, an intentionally incomplete starter, and a reference solution. All prompts and testbenches were written for Chip Lab. They do not reproduce HDLBits tasks or proprietary teaching material.

## Coverage

- Fundamentals cover AND, XOR and NOT truth tables.
- Combinational logic covers half-adder, mux, decoder, full-width adder and a two-operation ALU. Small input domains are exhaustively enumerated.
- Sequential logic covers synchronous reset, enabled storage, counter wraparound and edge detection. Inputs change at falling edges and outputs are sampled after nonblocking assignments settle.
- Verilog covers part-selects and reduction XOR across all 256 byte values.
- Timing exercises check pipeline latency and the digital behavior of a two-flop synchronizer.
- Synthesis exercises check De Morgan equivalence and priority encoding including the zero-request case.
- Physical-design preparation checks asynchronous reset assertion and clock-enable behavior.

Timing and physical exercises validate RTL functionality. Digital RTL simulation cannot measure metastability, physical setup/hold violations, routing quality, recovery/removal margins or signoff correctness. Prompts state the relevant boundaries.

## Grading limits

Testbenches emit an exercise-specific success marker only after their checks complete. A failed check calls `$fatal`. The client should require a successful engine result and the matching marker. Timeouts, missing markers, compilation failures and runtime failures are failures, never passes.

Tests are hidden from the normal exercise editor, but browser-delivered code and localStorage can be inspected or modified by the learner. A malicious design can print a success marker or alter a testbench through hierarchical references. This is a self-study tool, not a secure examination service. Do not present local progress as independently verified certification.

## Verification

Run `node tests/exercises.mjs` from the project root. The test runs the real Icarus WebAssembly engine for every reference solution, requires a valid VCD and its success marker, then verifies that the incomplete starter fails. It also runs all six examples and requires their self-checking success messages and VCD files.

Initial verification on 2026-11-17 passed all 20 reference solutions, rejected all 20 incomplete starters and passed all six examples, including the UART byte-level frame check and mini CPU result check.

## Example provenance

The UART transmitter is the unmodified `uart_tx.v` implementation by Alex Forencich, copyright 2014–2017, with its complete MIT license retained at the top of the editor source. A Chip Lab wrapper fixes the prescaler to one and a new testbench transmits and decodes `0xA5` with 8N1 framing. Source is linked in the example metadata.

The other examples and all testbenches are original educational code released under GPL-2.0-or-later. The mini CPU is a small accumulator teaching design with LOAD, ADD, XOR and HALT. It is not a RISC-V implementation or a derivative of PicoRV32.

Sources consulted before implementation include the [Icarus simulation documentation](https://steveicarus.github.io/iverilog/usage/simulation.html), [Alex Forencich UART source](https://github.com/alexforencich/verilog-uart/blob/master/rtl/uart_tx.v), and [PicoRV32 license](https://github.com/YosysHQ/picorv32/blob/main/COPYING). No PicoRV32 code is redistributed.
