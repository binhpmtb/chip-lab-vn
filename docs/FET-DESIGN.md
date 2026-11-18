# FET datasheet design

1. Faculty identity uses the supplied original FET PNG, with lime/navy horizontal rules. The original colour logo is preserved on white in the footer; no unprovided white logo or official ChipLab wordmark was invented.
2. Twelve-column desktop layout separates section numbers (§1–§3), course information and working area. Hairline navy rules replace floating cards.
3. A synchronous-reset D flip-flop timing diagram shows clk, rst, q, rising edges and time in ns. It is an illustrative timing trace, not a live simulation result.
4. Course index uses L01–L17, completion squares, lesson counts and estimated duration. Desktop lesson index is sticky; mobile uses a native expandable drawer.
5. Playground uses a navy editor, four FET syntax colours, lime Simulate and navy Synthesize. Lesson code blocks have filename labels and Copy.

Validation: production build/TypeScript pass; ESLint has zero errors and two image optimization warnings for the original logo. All existing regression tests pass (grading/VCD, real engines, 20 exercises, six examples). Chrome checks cover five views at 375/640/768/1024/1280px with no document horizontal overflow, no page errors, and successful real simulation after restoring sample code. Desktop/mobile screenshots inspected. Actual screen-reader and Android/Linux fallback-font rendering still need device testing.

Original technical lesson and engine data unchanged. Logo is provided by the user; it is not part of the software license grant. A verified faculty email/telephone and an official ChipLab wordmark asset were not supplied, so no contact details or official wordmark artwork were fabricated.
