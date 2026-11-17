# Architecture decision

Research checked before application implementation on 2026-11-17.

- [VeriSim](https://github.com/senolgulgonul/verisim) provides real Icarus WASM with corresponding source commit, patches and build scripts. Adopt the engine under GPL-2.0-or-later, retain notices and distribute corresponding source. Run each job in a terminable Web Worker.
- [YoWASP](https://yowasp.org/) provides the Yosys JavaScript virtual filesystem API. Adopt pinned WASM for synthesis in the worker. Report actual netlist cell counts, not physical area estimates.
- [Next.js static export](https://nextjs.org/docs/app/guides/static-exports) supports the learning UI without server execution. Deploy static output on Vercel.
- CodeMirror provides accessible text editing and Verilog highlighting. Lazy-load the editor and engines.
- Lesson content is authored originally in Vietnamese and English. The supplied PDF informs the physical-design learning sequence. It is not republished.
- Browser exercise tests are hidden from the editor but inspectable in browser tools. Grading is formative, not secure certification.

Folders: app/ for UI, components/ for editor and lab, lib/ for parsing/grading, content/ for bilingual lessons and exercises, public/engine/ for WASM, public/source/ for corresponding source, docs/ for research and maintenance.

Seven modules cover binary/Boolean logic, combinational logic, sequential logic, Verilog/testbenches, timing, synthesis and RTL-to-GDSII. The detailed project survey is in RESEARCH.md.
