# Transformer Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Transformer teaching demo with a Figure 1 style architecture redraw, module explanations, and a full translation walkthrough.

**Architecture:** Keep the existing query-parameter based standalone demo pattern. The main technical lab remains lightweight and opens `?demo=transformer`; the standalone page owns richer interactivity and teaching flow.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Tailwind CSS.

---

## File Structure

- Modify `src/utils/perceptronDemoMode.ts` to add transformer app mode and URL builder.
- Modify `src/utils/perceptronDemoMode.test.ts` with failing tests for transformer mode and URL generation.
- Modify `src/main.tsx` to render `TransformerDemoPage` when requested.
- Modify `src/components/TechnicalEvolutionLabs.tsx` to add the Transformer full demo entry point.
- Modify `src/components/TechnicalEvolutionLabs.test.tsx` to verify the new window URL.
- Create `src/components/demos/transformer/TransformerDemoPage.tsx` for the standalone demo.
- Create `src/components/demos/transformer/TransformerDemoPage.test.tsx` to cover architecture, module selection, and translation steps.

## Tasks

### Task 1: Query Mode

- [ ] Add failing tests expecting `?demo=transformer` to return `transformer-demo` and `buildTransformerDemoUrl()` to produce `?demo=transformer`.
- [ ] Run `npm test -- src/utils/perceptronDemoMode.test.ts` and confirm the tests fail because the transformer mode does not exist.
- [ ] Add the mode and URL builder.
- [ ] Re-run the targeted test and confirm it passes.

### Task 2: Main Page Entry

- [ ] Add a failing test that selects the Transformer lab, clicks `open-transformer-demo`, and expects `window.open` to receive `?demo=transformer`.
- [ ] Run `npm test -- src/components/TechnicalEvolutionLabs.test.tsx` and confirm failure.
- [ ] Add `buildTransformerDemoUrl()` usage, a popup-blocked state, and the open button in `TransformerArchitectureLab`.
- [ ] Re-run the targeted test and confirm it passes.

### Task 3: Standalone Transformer Page

- [ ] Add a failing test rendering `TransformerDemoPage` and asserting `transformer-demo-page`, `Encoder`, `Decoder`, `Input Embedding`, and `I love AI` are visible.
- [ ] Add a failing test that clicks a module button such as `Cross-Attention` and expects the explanation panel to mention source sentence memory.
- [ ] Add a failing test that clicks the translation next-step button and expects the generated output to advance.
- [ ] Run `npm test -- src/components/demos/transformer/TransformerDemoPage.test.tsx` and confirm failure because the component does not exist.
- [ ] Implement `TransformerDemoPage` with fixed module data, fixed translation steps, SVG/HTML architecture redraw, and playback controls.
- [ ] Re-run the targeted test and confirm it passes.

### Task 4: App Wiring

- [ ] Import `TransformerDemoPage` in `src/main.tsx`.
- [ ] Extend root component selection so `transformer-demo` renders the standalone page.
- [ ] Run focused tests for mode, technical lab, and standalone page.

### Task 5: Verification

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Confirm the dev server still serves the page or restart it if needed.
