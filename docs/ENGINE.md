# Browser HDL engines

All compilation, simulation and synthesis execute in a dedicated module Web Worker. No native EDA process or serverless compute is used in production. The caller owns the watchdog and must terminate a Worker after its deadline or cancellation. Instantiate a fresh Worker for each job so timed-out or failed jobs cannot contaminate later work.

## Integration

Send `{action: 'simulate', design, testbench}` or `{action: 'synthesize', design}` to `/engine/worker.js`. It emits progress messages, then exactly one result or error message. Simulation returns real Icarus stdout and the `dump.vcd` file. Synthesis returns real Yosys JSON and logs. Testbenches should use `$dumpfile("dump.vcd")`, `$dumpvars(0, tb)` and bounded `$finish`. `$fatal(1, ...)` rejects simulation. Inputs are limited to 200,000 characters each, returned waveforms to 5 MB and logs to 100,000 characters. Worker termination is essential because a zero-time infinite loop cannot be interrupted from inside WASM.

The modules lazy-load only when an action is requested. The self-hosted files support normal HTTP caching. They use single-threaded WASM and do not require SharedArrayBuffer, COOP or COEP. Browser WebAssembly exception support is required by this YoWASP release. Raw Yosys WASM plus resources total approximately 52 MB before HTTP compression, while Icarus WASM totals approximately 2.7 MB. The UI shows loading progress from the YoWASP runtime.

## Pinned distribution and corresponding source

- Icarus wrapper and binaries are unmodified files from [VeriSim commit ab0ff3862a8cf8c6535117a64d370c4bf263042f](https://github.com/senolgulgonul/verisim/tree/ab0ff3862a8cf8c6535117a64d370c4bf263042f). Icarus Verilog is GPL-2.0-or-later. The adapter follows its documented three-stage ivlpp → ivl → vvp execution model.
- Exact corresponding upstream source is distributed at `/source/iverilog-c7530db.tar.gz`. It is [Icarus commit c7530db](https://github.com/steveicarus/iverilog/tree/c7530db). The required port patch is `/source/iverilog-wasm.patch` and build instructions are `/source/build.sh`, copied unchanged from VeriSim. The build uses Emscripten 6.0.0. The upstream source includes its notices and dependency source. These downloads accompany the binaries on the same server, rather than relying only on an external source offer.
- Full GPL text is `/licenses/icarus-GPL-2.0.txt`. Chip Lab modifications in `engine.js` and `worker.js` are GPL-2.0-or-later. The application source repository supplies these modifications.
- YoWASP is pinned to npm `@yowasp/yosys@0.66.1164`. Files in `public/engine/yosys*` are unchanged from that package's `gen/` directory, except `bundle.js` is named `yosys.js`. The embedded compiler reports Yosys 0.66, git `86f2ddebc`. See `/licenses/yosys-COPYING.txt` and `/licenses/yowasp-LICENSE.txt`. These permissive notices are retained alongside the bundle. This is generic logic synthesis, without SKY130 cell mapping, timing sign-off or physical area estimates.

## Verification

Run `node tests/engine-smoke.mjs` from the project directory. It checks all four AND input combinations, a clocked counter's reset and increment, Yosys producing one AND cell, and rejection of invalid Verilog. Emscripten updates Node's exit code on a deliberately failing invocation, so the test restores it after verifying expected rejection. Production uses Worker errors and termination instead.

`lib/vcd.ts` parses VCD hierarchy, aliases, timescale, scalar and vector transitions, including unknown `x` and high-impedance `z`. Real-valued signals are omitted from the digital waveform view.
