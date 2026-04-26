# Backprop Dual-Stage Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the standalone backprop demo into a dual-stage teaching page with simpler samples, target/loss visualizations, chain-rule explanation support, and clearer edge weight labels.

**Architecture:** Keep the existing page state machine and small/medium network presets, but derive richer teaching data from the model layer and render a new right-side visualization panel. Reuse the current left-side workflow, add a chain-rule explainer card that can show the provided image, and fix label overlap inside the SVG network canvas by offsetting labels off the crossing lines.

**Tech Stack:** React 19, TypeScript, SVG charts, Vitest, Testing Library

---

### Task 1: Define the new teaching data and expectations

**Files:**
- Modify: `src/components/demos/backprop/backpropDemoModel.test.ts`
- Modify: `src/components/demos/backprop/BackpropDemoPage.test.tsx`

- [ ] Add failing model tests for simplified teaching samples, target-function chart data, and gradient-descent summary output.
- [ ] Run the targeted model/page tests and verify they fail for the expected missing exports or missing UI text.
- [ ] Add failing page tests for the new right-side visualization titles and chain-rule explainer copy.
- [ ] Re-run the targeted tests and confirm the new expectations still fail before implementation.

### Task 2: Implement model-layer teaching helpers

**Files:**
- Modify: `src/components/demos/backprop/backpropDemoModel.ts`
- Modify: `src/components/demos/backprop/backpropDemoModel.test.ts`

- [ ] Add simplified teaching dataset metadata without removing the existing training flow.
- [ ] Add derived helpers for target-function sample points, current teaching point mapping, and loss-trend summaries.
- [ ] Run `npm test -- src/components/demos/backprop/backpropDemoModel.test.ts` and verify the model tests pass.

### Task 3: Build the new right-side explainer and charts

**Files:**
- Create: `src/components/demos/backprop/BackpropFunctionPanel.tsx`
- Modify: `src/components/demos/backprop/BackpropMetricsPanel.tsx`
- Modify: `src/components/demos/backprop/BackpropDemoPage.tsx`
- Copy asset into: `public/`

- [ ] Copy the provided `链式法则.png` into `public/` with a stable filename for the demo page.
- [ ] Add a new visualization panel that renders the target-function chart, loss/gradient-descent chart, and a chain-rule explainer card using the provided image.
- [ ] Refocus the metrics panel on readable Chinese teaching copy and supporting stats instead of carrying all right-column content.
- [ ] Run `npm test -- src/components/demos/backprop/BackpropDemoPage.test.tsx` and verify the updated page tests pass.

### Task 4: Fix the network-canvas readability issues

**Files:**
- Modify: `src/components/demos/backprop/BackpropNetworkCanvas.tsx`
- Modify: `src/components/demos/backprop/BackpropTimelinePanel.tsx`

- [ ] Replace overlapping inline edge labels with offset badge-style labels that stay legible when lines cross.
- [ ] Clean up corrupted Chinese labels in the canvas and timeline while keeping the current step-highlighting behavior.
- [ ] Run the backprop page tests again to confirm the page still renders and advances correctly.

### Task 5: Verify the full demo end to end

**Files:**
- Verify only

- [ ] Run `npm test -- src/components/demos/backprop/backpropDemoModel.test.ts src/components/demos/backprop/BackpropDemoPage.test.tsx`.
- [ ] Run `npm test` from the worktree root.
- [ ] Run `npm run build`.
- [ ] Review the changed files and summarize the behavior updates, any remaining risks, and the verification evidence.
