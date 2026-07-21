# CTA Responsive Title and Button Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Chinese closing CTA title on one line above the 1226px boundary and keep button hover colors inside Vane's ink-and-paper palette.

**Architecture:** Preserve the shared CTA and Button component markup. Add one locale-aware CTA width override and complete the existing shared hover rules so they override Docusaurus's global anchor treatment.

**Tech Stack:** React 19, TypeScript, Docusaurus 3, CSS, Node.js test runner

## Global Constraints

- The Chinese page language is `zh-Hans-CN`; select it with the CSS language range `:lang(zh)`.
- Use `680px` only for Chinese CTA headings; other locales keep `620px`.
- Preserve CTA copy, heading sizes, button dimensions, motion, and mobile wrapping.
- Add no dependencies and perform no unrelated refactoring or deployment.

---

### Task 1: Lock and fix CTA responsive and hover behavior

**Files:**

- Create: `tests/cta-styles.test.mjs`
- Modify: `src/index.css:119-122`
- Modify: `src/index.css:2822-2823`

**Interfaces:**

- Consumes: Docusaurus's `a:hover` link color and the existing `.cta`, `.h2`, `.btn`, and `.btn-solid` class contracts.
- Produces: A Chinese CTA width override plus explicit outlined and solid button hover colors, guarded by Node.js source-level regression tests.

- [ ] **Step 1: Write the failing regression tests**

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const siteStyles = readFileSync('src/index.css', 'utf8')

test('Chinese CTA headings have enough room at the desktop font-size cap', () => {
  assert.match(
    siteStyles,
    /\.cta \.h2:lang\(zh\)\s*\{[^}]*max-width:\s*680px/s,
  )
})

test('outlined buttons keep the ink palette and no link underline on hover', () => {
  assert.match(
    siteStyles,
    /\.btn:hover\s*\{[^}]*color:\s*var\(--ink\);[^}]*text-decoration:\s*none/s,
  )
})

test('solid buttons keep paper-colored text on hover', () => {
  assert.match(
    siteStyles,
    /\.btn-solid:hover\s*\{[^}]*color:\s*var\(--paper\)/s,
  )
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/cta-styles.test.mjs`

Expected: three assertion failures because the locale override and explicit hover colors are absent.

- [ ] **Step 3: Apply the minimal CSS fix**

Update the existing button rules to:

```css
.btn:hover { transform: translate(-1px,-1px); color: var(--ink); text-decoration: none; }
.btn:active { transform: none; }
.btn-solid { background: var(--ink); color: var(--paper); }
.btn-solid:hover { background: #000; color: var(--paper); }
```

Add the language-specific CTA override immediately after the shared heading rule:

```css
.cta .h2 { margin: 14px auto 0; max-width: 620px; }
.cta .h2:lang(zh) { max-width: 680px; }
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/cta-styles.test.mjs`

Expected: three tests pass with zero failures.

- [ ] **Step 5: Run repository verification**

Run these commands independently:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: every command exits with status 0; tests report zero failures and the production site builds successfully.

- [ ] **Step 6: Verify the rendered responsive and hover behavior**

On the Chinese home page, measure `.cta .h2` at 1200, 1226, 1227, 1280, and 1440px viewport widths.

Expected: `height / computed line-height` rounds to `1` at every width. Hover the two CTA links and inspect computed styles.

Expected outlined button hover: `color: rgb(21, 23, 30)` and `text-decoration-line: none`.

Expected solid button hover: `color: rgb(244, 243, 237)` and `background-color: rgb(0, 0, 0)` after its transition completes.

- [ ] **Step 7: Review and commit the focused change**

Run:

```bash
git diff --check
git diff -- src/index.css tests/cta-styles.test.mjs
git add src/index.css tests/cta-styles.test.mjs
git commit -m "fix: keep CTA title and hover colors stable"
```

Expected: the diff contains only the three CSS rule changes and the focused regression test; the commit succeeds.
