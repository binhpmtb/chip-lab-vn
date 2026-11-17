# ChipLab UX update

P0: Hero CTAs open lesson 1 or Playground directly. Clear exercise progress. Separate persistent lesson completion, module accordions, continue actions and previous/next controls. Ctrl+Enter simulation and compiler line highlighting.

P1: Two-column lesson/workbench, mobile lesson/practice switch, tool descriptions, loading indicator, guided empty state, animated illustrative clock waveform, light/dark mode.

P2: Estimated module duration (10 minutes per lesson; editorial estimate), bit-weight illustration, consistent controls and focus states.

Validation: Production build and TypeScript pass. Existing simulation, grading and VCD regression tests run. Technical lesson data and engine implementation unchanged.

Manual checks still required: 375/768/1280px visual layout and horizontal overflow; keyboard order and screen-reader announcements; measured WCAG AA contrast in both themes; VI/EN labels; localStorage persistence/recovery; compiler diagnostics mapping for design versus testbench; sticky controls with long content; reduced-motion preference; mobile Playground and exercise flows. Native title tooltips are desktop-first. Duration estimates need learner feedback.
