# OCRWeb Post-Development QA Checklist

> Last updated: 2026-06-10
> Current position: Not started. Begin at `1. Resume And Site State`.
> Scope: desktop complete acceptance plus explicit browser-compatibility verification. Mobile is not a default blocker unless a task explicitly asks for it.

## How To Resume

When opening a new session, read these files in order:

1. `AGENTS.md`
2. `PROJECT_VISION.md`
3. `DESIGN.md`
4. `SESSION_PROGRESS.md`
5. `docs/post-dev-qa-checklist.md`

Then continue from the first unchecked item in this checklist.

## Evidence Rules

- Only change `[ ]` to `[x]` after the item has actually passed.
- Add evidence on the same line or immediately below the item: command output summary, screenshot path, inspected file, issue found, or fix reference.
- If an item fails, keep it unchecked and record the reason under `Open Issues / Blockers`.
- If a step creates follow-up work, do not hide it by checking the item early.
- This checklist is for desktop complete acceptance. Do not expand the scope to mobile, 390px, responsive breakpoints, or phone screenshots unless the active user task explicitly asks for that.
- When a task enters compatibility QA, record the tested browser/device matrix before treating any single-browser issue as a global blocker.
- If the active task is WeChat WebView compatibility, use `docs/wechat-webview-compat-checklist.md` as the primary execution entry instead of treating this desktop QA checklist as the main flow.

## Open Issues / Blockers

Use this section for failed checks, unresolved decisions, and risks that must be carried into the next session.

- None recorded yet.

## 1. Resume And Site State

- [ ] Read the required project documents listed in `How To Resume`.
- [ ] Locate the first unchecked item in this checklist and update `Current position`.
- [ ] Check git working tree state and separate pre-existing changes from the current session's changes.
- [ ] Confirm the current acceptance target is desktop complete QA, not mobile or multi-device QA.
- [ ] If this pass includes compatibility QA, write down the target browser/device matrix before opening the page.

## 2. Environment And Dependencies

- [ ] Confirm Node.js and npm are available.
- [ ] If system `npm` is unavailable, use `PATH="$PWD/.tools/node/bin:$PATH"` before project commands.
- [ ] Confirm dependency installation state without deleting or reinstalling dependencies unless required by a failing command.
- [ ] Record the Node.js and npm versions used for this QA pass.
- [ ] Confirm the local server plan, defaulting to `http://localhost:5173/` for live-page validation.

## 3. Native Project Commands

- [ ] Run `npm run build`.
- [ ] Run `npm run sync:ocr-docs`.
- [ ] Run `npm run validate:ocr-catalog`.
- [ ] If any command fails, record the failing command, failure summary, likely files involved, and recommended fix.

## 4. Code Review

- [ ] Review `src/App.tsx` for routing, state transitions, interactions, empty states, and boundary behavior.
- [ ] Review `src/data/ocrDocs.ts` for catalog completeness, fallback behavior, source accuracy risks, and endpoint consistency.
- [ ] Review `src/styles.css` for visual rules, text overflow, z-index/layering, layout stability, and the known garbled `content` string risk.
- [ ] Check for unused code, temporary code, debugging output, stale hardcoded paths, and broken resource references.
- [ ] Summarize bug risks by severity before making fixes.

## 5. Data And Documentation Consistency

- [ ] Verify the homepage interface count, categories, and detail-page slugs agree with the frontend data source.
- [ ] Spot-check complete detail docs for `idcard` and `vat-invoice`.
- [ ] Spot-check fallback detail pages and confirm they do not imply source-accurate complete documentation.
- [ ] Compare the official PDF manifest against frontend catalog expectations for obvious omissions or mismatches.
- [ ] Record endpoint inconsistencies or source questions that need human confirmation.

## 6. Local Runtime And Desktop Interaction

- [ ] Start the live page, preferring `http://localhost:5173/`.
- [ ] Validate with a desktop viewport close to the user's browser, preferably `1600x900`.
- [ ] Test homepage search, category filtering, card navigation to detail pages, and return navigation.
- [ ] Test detail-page anchor navigation, business/developer view switching, and request/response parameter entry points.
- [ ] Test error and edge paths: unknown slug, empty search, and no-result search state.

## 7. Desktop Visual QA

- [ ] Capture a desktop homepage screenshot and inspect the first-screen paper, blue archive board, search strip, and card grid.
- [ ] Capture a desktop detail-page screenshot and inspect left navigation, first-screen access entry points, and parameter sections.
- [ ] Check that text does not overlap or overflow buttons, cards, nav items, tables, or paper surfaces.
- [ ] Confirm key materials have not regressed into pure CSS gradients, modern SaaS white boxes, or forbidden historical assets.
- [ ] Record screenshot paths and visual conclusions.

## 8. Performance, Accessibility, And Compatibility Basics

- [ ] Inspect first-screen image assets for obvious oversized files or unnecessary critical-path weight.
- [ ] Check browser console for runtime errors, React errors, missing assets, and resource 404s.
- [ ] Check keyboard focus behavior for primary navigation, search, filters, and detail-page controls.
- [ ] Check that primary images and visual specimens have adequate semantic text or surrounding labels.
- [ ] Build and preview the production output, then verify core routes still load from the static server.
- [ ] Record compatibility-sensitive UI mechanisms to test: sticky areas, anchor jumps, long horizontal scrollers, viewport-height sections, and copy actions.

## 9. Bug Fixes And Regression

- [ ] Create a bug/follow-up list for issues found during review and QA.
- [ ] After fixing P0/P1 blockers, rerun the relevant native project commands.
- [ ] After fixing interaction or visual issues, repeat the relevant browser flow and screenshot check.
- [ ] Confirm fixes did not introduce new layout, data, routing, or build failures.
- [ ] Update this checklist with evidence and final status for each fixed issue.

## 10. Pre-Delivery Check

- [ ] Confirm `README.md` still describes accurate install, build, and run commands.
- [ ] Confirm `.gitignore` still excludes build outputs, generated screenshots, local logs, and temporary files appropriately.
- [ ] Confirm no real credentials, private data, or usable real identity-document material were introduced.
- [ ] Confirm all known remaining risks are recorded here or in `SESSION_PROGRESS.md`.
- [ ] Run a final `npm run build` and record the result.

## Completion Criteria

This QA pass is complete only when:

- Every non-blocked checklist item is checked.
- Every blocking issue has been fixed and regression-tested.
- Remaining non-blocking risks are explicitly recorded.
- The final `npm run build` passes.
