# Chapter 3 Architecture Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild chapter 3 into a dedicated architecture storytelling section with a global overview, five module navigation anchors, and visual-first module cards.

**Architecture:** Keep `ChapterSection` as the chapter router, but give `chapter-claude` its own dedicated section component similar to the existing agent chapter. Store the new module presentation metadata in code, render a shared card structure for all five modules, and validate navigation plus visible content with focused component tests.

**Tech Stack:** React 19, TypeScript, Tailwind utility classes in `src/index.css`, Vitest, Testing Library

---

### Task 1: Add failing tests for the chapter 3 specialized presentation

**Files:**
- Create: `src/components/ClaudeArchitectureChapterSection.test.tsx`
- Modify: `src/App.test.tsx`
- Test: `src/components/ClaudeArchitectureChapterSection.test.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Write the failing component test**

```tsx
it('renders the chapter 3 module navigation and all five architecture cards', () => {
  render(<ClaudeArchitectureChapterSection chapter={chapters[2]} />);

  expect(screen.getByRole('navigation', { name: /chapter 3 module navigation/i })).toBeInTheDocument();
  expect(screen.getByText(/conversation engine/i)).toBeInTheDocument();
  expect(screen.getByText(/tool system/i)).toBeInTheDocument();
  expect(screen.getByText(/toolusecontext/i)).toBeInTheDocument();
  expect(screen.getByText(/task \/ subagent/i)).toBeInTheDocument();
  expect(screen.getByText(/extension layer/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ClaudeArchitectureChapterSection.test.tsx`
Expected: FAIL because `ClaudeArchitectureChapterSection` does not exist yet

- [ ] **Step 3: Extend the app-level regression test**

```tsx
it('renders the chapter 3 architecture navigation inside the main app', () => {
  render(<App />);

  expect(screen.getByRole('navigation', { name: /chapter 3 module navigation/i })).toBeInTheDocument();
});
```

- [ ] **Step 4: Run the targeted app test**

Run: `npm test -- App.test.tsx`
Expected: FAIL because chapter 3 still uses the generic stage card layout

### Task 2: Implement the dedicated chapter 3 section and shared module card

**Files:**
- Create: `src/components/ClaudeArchitectureChapterSection.tsx`
- Modify: `src/components/ChapterSection.tsx`
- Modify: `src/data/chapters.ts`

- [ ] **Step 1: Add the minimal dedicated component shell**

```tsx
export function ClaudeArchitectureChapterSection({ chapter }: Props) {
  return <section id={chapter.id}>TODO</section>;
}
```

- [ ] **Step 2: Route chapter 3 through the dedicated component**

```tsx
if (isClaudeArchitectureChapter) {
  return <ClaudeArchitectureChapterSection chapter={chapter} />;
}
```

- [ ] **Step 3: Add module presentation metadata**

```ts
const claudeArchitectureModules = [
  {
    id: 'claude-entry',
    shortLabel: 'Think',
    title: 'Conversation Engine / QueryEngine',
    imageSrc: '/claude-code-architecture.png',
    summary: 'It defines how one full agent reasoning turn runs end to end.',
  },
];
```

- [ ] **Step 4: Implement the shared module card layout**

```tsx
<article id={module.id}>
  <img src={module.imageSrc} alt={module.imageAlt} />
  <ul>{module.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
  <blockquote>{module.summary}</blockquote>
</article>
```

- [ ] **Step 5: Run the targeted tests**

Run: `npm test -- ClaudeArchitectureChapterSection.test.tsx App.test.tsx`
Expected: PASS

### Task 3: Add chapter 3 specific styling and navigation polish

**Files:**
- Modify: `src/index.css`
- Test: `src/components/ClaudeArchitectureChapterSection.test.tsx`

- [ ] **Step 1: Add dedicated layout classes**

```css
.claude-architecture-hero { ... }
.claude-module-nav { ... }
.claude-module-card { ... }
.claude-module-summary { ... }
```

- [ ] **Step 2: Add responsive states for desktop and mobile**

```css
@media (min-width: 960px) {
  .claude-module-card {
    grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
  }
}
```

- [ ] **Step 3: Re-run focused tests**

Run: `npm test -- ClaudeArchitectureChapterSection.test.tsx App.test.tsx`
Expected: PASS

### Task 4: Run full verification for build and tests

**Files:**
- Test: `src/components/ClaudeArchitectureChapterSection.test.tsx`, `src/App.test.tsx`, project build

- [ ] **Step 1: Run the new component test suite**

Run: `npm test -- ClaudeArchitectureChapterSection.test.tsx`
Expected: PASS

- [ ] **Step 2: Run the broader regression suite**

Run: `npm test -- App.test.tsx AgentChapterSection.test.tsx chapters.test.ts`
Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: exit code 0 and Vite build output with no errors

- [ ] **Step 4: Commit the implementation**

```bash
git add src/components/ClaudeArchitectureChapterSection.tsx src/components/ClaudeArchitectureChapterSection.test.tsx src/components/ChapterSection.tsx src/data/chapters.ts src/index.css src/App.test.tsx
git commit -m "feat: reframe chapter 3 architecture story"
```
