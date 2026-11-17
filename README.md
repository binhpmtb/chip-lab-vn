# ChipLab

A bilingual Vietnamese/English digital IC learning application. Read 17 lessons, work through 20 exercises, simulate SystemVerilog with Icarus WASM and synthesize RTL with Yosys WASM. All HDL processing runs on the learner's device in disposable Web Workers.

## Run locally

Use Node.js 22.18 or later and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Next.js. The initial interface is Vietnamese with a language switch and light/dark themes. Code, testbench and exercise progress are stored in localStorage. No account or API key is required.

## Validate

```sh
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
```

Tests check grading markers and errors, malformed saved progress, VCD parsing, actual Icarus simulation, Yosys synthesis, all 20 exercise solutions and incomplete starters, and six complete examples.

## Deploy

```sh
npx vercel login
npx vercel --yes
npx vercel --prod --yes
```

The static export is in `out/`. Vercel configuration includes WASM caching. The chosen engines do not require SharedArrayBuffer or cross-origin isolation headers. No HDL tool runs in a serverless function.

## Add lessons and exercises

`content/curriculum.json` is the UI source for module IDs, lesson IDs, bilingual titles, Markdown body strings and exercise references. Keep the corresponding readable files in `content/lessons/` synchronized. Each lesson includes an original runnable RTL snippet and links to related exercises.

Add exercises to `content/exercises.json` with a stable ID, module, bilingual title/prompt/hints, starter, solution and selfchecking testbench. Use module `top` and testbench `tb`. Emit `$dumpfile("dump.vcd")`, `$dumpvars(0,tb)` and `$finish`. The testbench should use `$fatal` on mismatches and emit exactly `CHIPLAB_PASS_<id>` only after all checks. Run `npm test` to check the solution and reject the incomplete starter. Tests hidden in the UI are inspectable on the client, so this is formative self-study grading.

Add complete examples to `content/examples.json`, preserving the original source URL and full license notices when adapting upstream HDL. The UART example retains Alex Forencich's MIT notice.

## Scope and limits

- Icarus supports an educational subset of SystemVerilog, not all verification frameworks.
- Synthesis returns generic logic cells, not SKY130 physical area or signoff timing.
- Physical design lessons explain OpenLane/OpenROAD stages. Place-and-route, DRC and LVS run externally.
- Workers stop after 60 seconds. Inputs are capped at 200,000 characters and VCD at 5 MB. The viewer displays up to 24 signals and 2,000 transitions per signal. Download the full VCD for larger traces.
- Engine assets load on demand. Yosys is roughly 52 MB uncompressed, so a first synthesis on slow connections may require a retry after the browser caches assets.
- The shared URL contains design code. It does not include the current testbench.

## Licensing

The application and original course content use GPL-2.0-or-later. Third-party components retain their licenses. See `LICENSE`, the app Credits page, `public/third-party-notices.txt`, `docs/RESEARCH.md`, `docs/ENGINE.md` and `public/source/` for corresponding source and build details.
