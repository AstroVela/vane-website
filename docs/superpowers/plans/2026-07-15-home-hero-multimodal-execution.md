# Home Hero Multimodal Execution Window Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage Hero's generic text-embedding snippet with a compact, accessible Vane pipeline plus a representative multimodal CPU/GPU/I/O execution model.

**Architecture:** Add one homepage-specific `HomeHeroExecution` component and keep `Home.tsx` responsible only for page composition. Extend the shared `CodeWindow` with optional header and after-code slots so the new component can reuse syntax highlighting and copy behavior without duplicating the terminal chrome; render all execution data locally and drive motion entirely with CSS.

**Tech Stack:** React 19, TypeScript, Docusaurus 3, `prism-react-renderer`, CSS/SVG-style DOM animation, Node content-contract checks.

---

## Acceptance revision: reduce the execution window height

The accepted follow-up removes the homepage-only terminal header, the execution eyebrow, and the
capability strip. The shared `CodeWindow` gains a default-on `showHeader` switch so other consumers
retain their existing chrome and copy behavior.

### Task A: Lock the compact Hero structure

**Files:**
- Modify: `scripts/home-content-check.mjs`

- [ ] Add assertions for `showHeader?: boolean`, `showHeader = true`, and the Hero's
  `showHeader={false}` usage.
- [ ] Replace the capability-label assertions with negative assertions covering
  `Execution model`, `执行模型`, `STREAMING`, `BACKPRESSURE`, and `DYNAMIC BATCHING`.
- [ ] Add negative style assertions for `.home-execution-capabilities` and the homepage terminal-bar
  mobile overrides.
- [ ] Run `npm run home:content:check` and verify it fails because the old structure is still present.

### Task B: Implement the structural removals

**Files:**
- Modify: `src/components/CodeWindow.tsx`
- Modify: `src/components/HomeHeroExecution.tsx`
- Modify: `src/index.css`

- [ ] Add `showHeader?: boolean`, default it to `true`, and conditionally render the complete
  `.term-bar` block only when enabled.
- [ ] Pass `showHeader={false}` from `HomeHeroExecution`; remove `headerMeta`, both localized eyebrow
  strings, the eyebrow `<span>`, the capability DOM, and capability wording from localized aria text.
- [ ] Simplify `.home-execution-head`, keep its English sentence on one desktop line, restore natural
  wrapping below `520px`, and delete the obsolete capability and homepage header rules.
- [ ] Run `npm run home:content:check` and `npm run typecheck`; verify both pass.

### Task C: Verify and preserve the acceptance service

**Files:**
- Test: `scripts/home-content-check.mjs`

- [ ] Run `npm run lint` and `npm run build`; verify both locales compile.
- [ ] Check English and Chinese runtime DOM: no `.term-bar`, no capability strip, one-line English
  value at desktop width, no page overflow at narrow width, and reduced-motion animation remains off.
- [ ] Commit the revision and leave the existing port `4328` development service running.

## File map

- Create `src/components/HomeHeroExecution.tsx`: owns the representative Python code, localized execution explanation, multimodal inputs, stage topology, actor visualization, and capability labels.
- Modify `src/components/CodeWindow.tsx`: adds backward-compatible `headerMeta` and `afterCode` slots while keeping copy behavior scoped to code.
- Modify `src/pages/Home.tsx`: removes the old Hero code and Local/Ray note, then composes `HomeHeroExecution`.
- Modify `src/index.css`: styles the new terminal metadata, execution panel, animation, narrow layout, and static reduced-motion state.
- Modify `scripts/home-content-check.mjs`: locks the public API, truthfulness boundaries, integration, and required responsive selectors.

### Task 1: Add backward-compatible CodeWindow composition slots

**Files:**
- Modify: `scripts/home-content-check.mjs:1-13`
- Modify: `src/components/CodeWindow.tsx:1-104`

- [ ] **Step 1: Write the failing slot contract**

Add `codeWindow` to the sources loaded by `scripts/home-content-check.mjs`, then add these assertions before the existing route assertions:

```js
const codeWindow = readFileSync('src/components/CodeWindow.tsx', 'utf8')

assert.match(codeWindow, /headerMeta\?: ReactNode/)
assert.match(codeWindow, /afterCode\?: ReactNode/)
assert.match(codeWindow, /className="term-meta"/)
assert.match(codeWindow, /\{afterCode\}/)
```

- [ ] **Step 2: Run the content check and verify the new contract fails**

Run:

```bash
npm run home:content:check
```

Expected: FAIL on the first `headerMeta?: ReactNode` assertion because the slot does not exist yet.

- [ ] **Step 3: Implement the minimal CodeWindow slot API**

Change the React type import and `CodeWindowProps` in `src/components/CodeWindow.tsx` to:

```tsx
import type {CSSProperties, ReactNode} from 'react'

type CodeWindowProps = {
  filename: string
  running?: boolean
  code: string
  style?: CSSProperties
  copyable?: boolean
  language?: string
  headerMeta?: ReactNode
  afterCode?: ReactNode
}
```

Destructure the two props:

```tsx
export default function CodeWindow({
  filename,
  running,
  code,
  style,
  copyable = true,
  language,
  headerMeta,
  afterCode,
}: CodeWindowProps) {
```

Render header metadata after the existing `running` block and before the copy button:

```tsx
        {headerMeta && <span className="term-meta">{headerMeta}</span>}
```

Render the after-code slot after the language/pre-highlighted code conditional and before the closing `.term` element:

```tsx
      {afterCode}
```

Do not change the `preRef`; the copy button must continue to read only the code `<pre>`.

- [ ] **Step 4: Run the focused contract and type check**

Run:

```bash
npm run home:content:check
npm run typecheck
```

Expected: both commands PASS. Existing CodeWindow consumers compile because both new props are optional.

- [ ] **Step 5: Commit the reusable slot change**

```bash
git add scripts/home-content-check.mjs src/components/CodeWindow.tsx
git commit -m "feat: add code window composition slots"
```

### Task 2: Replace the generic Hero example with the multimodal execution component

**Files:**
- Create: `src/components/HomeHeroExecution.tsx`
- Modify: `scripts/home-content-check.mjs:1-25`
- Modify: `src/pages/Home.tsx:1-31,126-229`

- [ ] **Step 1: Replace the old Hero content assertions with the new failing contract**

Load the component source near the top of `scripts/home-content-check.mjs`:

```js
const heroExecution = readFileSync('src/components/HomeHeroExecution.tsx', 'utf8')
```

Replace the old `HERO_CODE`, `ai_embed`, and generic `write_parquet` assertions with:

```js
assert.match(home, /import HomeHeroExecution from '\.\.\/components\/HomeHeroExecution'/)
assert.match(home, /<HomeHeroExecution \/>/)
assert.doesNotMatch(home, /const HERO_CODE = `/)
assert.doesNotMatch(home, /heroCodeLocal|heroCodeRay|embed_documents\.py/)

assert.match(heroExecution, /vane\.configure\(runner="ray"\)/)
assert.match(heroExecution, /map_batches\(/)
assert.match(heroExecution, /gpus=1/)
assert.match(heroExecution, /actor_number=4/)
assert.match(heroExecution, /write_parquet/)
assert.match(heroExecution, /'image', 'video', 'audio'/)
assert.match(heroExecution, /DecodeAndInfer/)
assert.match(heroExecution, /model loaded once per actor/)
assert.match(heroExecution, /STREAMING/)
assert.match(heroExecution, /BACKPRESSURE/)
assert.match(heroExecution, /DYNAMIC BATCHING/)
assert.doesNotMatch(heroExecution, /ai_embed|running|LIVE|rows\/s|92%|3\.1×|1\.9×/)
```

- [ ] **Step 2: Run the content check and verify the component contract fails**

Run:

```bash
npm run home:content:check
```

Expected: FAIL with `ENOENT` for `src/components/HomeHeroExecution.tsx`.

- [ ] **Step 3: Create the complete HomeHeroExecution component**

Create `src/components/HomeHeroExecution.tsx` with:

```tsx
import type {ReactNode} from 'react'
import CodeWindow from './CodeWindow'
import { pickLocale, useSiteLocale } from '../siteI18n'

const HERO_PIPELINE_CODE = `import vane
vane.configure(runner="ray")
con = vane.connect()

assets = con.sql("""
    SELECT asset_id, uri, media_type
    FROM read_parquet('s3://raw-assets/*.parquet')
    WHERE media_type IN ('image', 'video', 'audio')
""")

features = assets.map_batches(
    DecodeAndInfer,        # model loaded once per actor
    schema=feature_schema,
    gpus=1,
    actor_number=4,
)

features.write_parquet("s3://model-ready/features/")`

const MODALITIES = ['IMG', 'VID', 'AUD'] as const
const ACTORS = [1, 2, 3, 4] as const

function Stage({
  className,
  label,
  detail,
  children,
}: {
  className: string
  label: string
  detail: string
  children?: ReactNode
}) {
  return (
    <span className={`home-execution-stage ${className}`}>
      <small>{label}</small>
      <b>{detail}</b>
      {children}
    </span>
  )
}

function Connector({ className }: { className: string }) {
  return (
    <span className={`home-execution-link ${className}`}>
      <i />
      <i />
    </span>
  )
}

export default function HomeHeroExecution() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      eyebrow: 'Execution model',
      value: 'One relation. Overlapped multimodal decode, GPU inference, and I/O.',
      aria: 'Images, video, and audio flow through one relation. S3 scan, CPU decode, four reusable GPU actors, and Parquet write overlap through streaming, backpressure, and dynamic batching.',
    },
    {
      eyebrow: '执行模型',
      value: '一条 Relation，让多模态解码、GPU 推理与 I/O 重叠执行。',
      aria: '图像、视频和音频记录进入同一条 Relation。S3 扫描、CPU 解码、四个可复用 GPU actor 和 Parquet 写入通过 streaming、backpressure 与 dynamic batching 重叠执行。',
    },
  )

  return (
    <CodeWindow
      filename="multimodal_features.py"
      language="python"
      code={HERO_PIPELINE_CODE}
      headerMeta="RAY · 4 GPU ACTORS"
      afterCode={(
        <section className="home-hero-execution" aria-label={copy.aria}>
          <div className="home-execution-head" aria-hidden="true">
            <span>{copy.eyebrow}</span>
            <p>{copy.value}</p>
          </div>

          <div className="home-execution-modalities" aria-hidden="true">
            <small>INPUT</small>
            {MODALITIES.map((modality) => <span key={modality}>{modality}</span>)}
            <b>ONE RELATION</b>
          </div>

          <div className="home-execution-graph" aria-hidden="true">
            <Stage className="scan" label="S3 SCAN" detail="I/O" />
            <Connector className="scan-decode" />
            <Stage className="decode" label="CPU DECODE" detail="PYTHON / ARROW" />
            <Connector className="decode-infer" />
            <Stage className="infer" label="GPU INFER" detail="4 ACTORS">
              <span className="home-execution-actors">
                {ACTORS.map((actor) => <i key={actor} />)}
              </span>
            </Stage>
            <Connector className="infer-write" />
            <Stage className="write" label="PARQUET" detail="WRITE" />
          </div>

          <div className="home-execution-capabilities" aria-hidden="true">
            <span>STREAMING</span>
            <span>BACKPRESSURE</span>
            <span>DYNAMIC BATCHING</span>
          </div>
        </section>
      )}
    />
  )
}
```

- [ ] **Step 4: Integrate the component into Home and delete stale copy**

In `src/pages/Home.tsx`:

1. Replace `import CodeWindow from '../components/CodeWindow'` with:

```tsx
import HomeHeroExecution from '../components/HomeHeroExecution'
```

2. Delete the entire `HERO_CODE` constant.
3. Delete `heroCodeLocal` and `heroCodeRay` from both locale objects.
4. Replace the existing Hero code window and note with:

```tsx
          <div className="home-hero-code">
            <HomeHeroExecution />
          </div>
```

- [ ] **Step 5: Run the component contract and compiler**

Run:

```bash
npm run home:content:check
npm run typecheck
```

Expected: both commands PASS. The page source no longer contains the provider embedding example or the fake `running` state.

- [ ] **Step 6: Commit the semantic Hero replacement**

```bash
git add scripts/home-content-check.mjs src/components/HomeHeroExecution.tsx src/pages/Home.tsx
git commit -m "feat: show multimodal execution in homepage hero"
```

### Task 3: Style the execution topology, overlap animation, and responsive fallback

**Files:**
- Modify: `scripts/home-content-check.mjs:1-40`
- Modify: `src/index.css:293-347,3065-3125`

- [ ] **Step 1: Add a failing style contract**

Load `src/index.css` in `scripts/home-content-check.mjs`:

```js
const styles = readFileSync('src/index.css', 'utf8')
```

Add:

```js
assert.match(styles, /\.term-meta/)
assert.match(styles, /\.home-hero-execution/)
assert.match(styles, /\.home-execution-graph/)
assert.match(styles, /\.home-execution-actors/)
assert.match(styles, /@keyframes homeExecutionBatch/)
assert.match(styles, /@keyframes homeExecutionActor/)
assert.match(styles, /@media \(max-width: 520px\)/)
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
```

- [ ] **Step 2: Run the content check and verify style coverage fails**

Run:

```bash
npm run home:content:check
```

Expected: FAIL on the first missing `.term-meta` selector.

- [ ] **Step 3: Add desktop terminal and execution-panel styles**

Add the following near the existing Hero and code-window rules in `src/index.css`:

```css
.term-meta {
  margin-left: auto;
  flex: none;
  border: 1px solid var(--line-2);
  border-radius: 999px;
  padding: 3px 7px;
  color: var(--ink-2);
  background: var(--paper-3);
  font-size: 9px;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.term-meta + .term-copy { margin-left: 3px; }

.home-hero-code pre.code {
  padding: 13px 14px;
  font-size: 11.25px;
  line-height: 1.48;
}
.home-hero-execution {
  padding: 13px 14px 14px;
  border-top: 1.5px solid var(--line);
  background:
    linear-gradient(rgba(89, 93, 103, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(89, 93, 103, 0.045) 1px, transparent 1px),
    var(--paper-3);
  background-size: 16px 16px;
}
.home-execution-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 10px;
}
.home-execution-head > span {
  font-family: var(--font-pixel);
  color: var(--ink-3);
  font-size: 8.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.home-execution-head p {
  margin: 0;
  color: var(--ink-2);
  font-size: 10.5px;
  line-height: 1.35;
}
.home-execution-modalities {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 11px;
}
.home-execution-modalities small {
  margin-right: 2px;
  color: var(--ink-3);
  font-size: 8px;
  letter-spacing: 0.08em;
}
.home-execution-modalities span,
.home-execution-modalities b {
  border: 1px solid var(--line-2);
  border-radius: 3px;
  padding: 3px 6px;
  background: var(--paper-2);
  color: var(--ink-2);
  font-size: 8px;
  line-height: 1;
  letter-spacing: 0.06em;
}
.home-execution-modalities b {
  margin-left: auto;
  border-color: var(--line);
  color: var(--ink);
}
.home-execution-graph {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 15px minmax(0, 1.08fr) 15px minmax(0, 1.12fr) 15px minmax(0, 1fr);
  align-items: center;
  margin-top: 8px;
}
.home-execution-stage {
  box-sizing: border-box;
  min-width: 0;
  min-height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 6px 3px;
  background: rgba(244, 243, 237, 0.92);
  text-align: center;
}
.home-execution-stage small {
  color: var(--ink-3);
  font-size: 7.5px;
  line-height: 1.1;
  letter-spacing: 0.04em;
}
.home-execution-stage b {
  overflow: hidden;
  max-width: 100%;
  color: var(--ink);
  font-size: 8.5px;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home-execution-stage.infer { border-color: var(--ink); }
.home-execution-link {
  position: relative;
  display: block;
  height: 1px;
  background: var(--line);
}
.home-execution-link::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -1px;
  transform: translateY(-50%);
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-left: 4px solid var(--ink-3);
}
.home-execution-link i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--green-ink);
  opacity: 0.7;
  transform: translate(-50%, -50%);
  animation: homeExecutionBatch 2.8s linear infinite;
}
.home-execution-link i + i { animation-delay: -1.4s; }
.home-execution-link.decode-infer i { animation-delay: -0.55s; }
.home-execution-link.decode-infer i + i { animation-delay: -1.95s; }
.home-execution-link.infer-write i { animation-delay: -1.05s; }
.home-execution-link.infer-write i + i { animation-delay: -2.45s; }
@keyframes homeExecutionBatch {
  0% { left: 0; opacity: 0; }
  18%, 82% { opacity: 0.8; }
  100% { left: 100%; opacity: 0; }
}
.home-execution-actors {
  display: flex;
  gap: 3px;
  height: 8px;
}
.home-execution-actors i {
  width: 5px;
  height: 8px;
  border: 1px solid var(--green-ink);
  background: transparent;
  animation: homeExecutionActor 1.8s ease-in-out infinite;
}
.home-execution-actors i:nth-child(2) { animation-delay: -0.45s; }
.home-execution-actors i:nth-child(3) { animation-delay: -0.9s; }
.home-execution-actors i:nth-child(4) { animation-delay: -1.35s; }
@keyframes homeExecutionActor {
  0%, 100% { background: transparent; opacity: 0.45; }
  45%, 70% { background: var(--green-ink); opacity: 0.9; }
}
.home-execution-capabilities {
  display: flex;
  gap: 5px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.home-execution-capabilities span {
  border-left: 2px solid var(--ink);
  padding: 2px 5px;
  background: rgba(244, 243, 237, 0.85);
  color: var(--ink-2);
  font-size: 7.5px;
  line-height: 1;
  letter-spacing: 0.04em;
}
```

- [ ] **Step 4: Add the narrow layout without changing the shared desktop graph**

Add after the existing `@media (max-width: 900px)` block:

```css
@media (max-width: 520px) {
  .home-hero-code .term-bar { flex-wrap: wrap; }
  .home-hero-code .term-copy { order: 1; margin-left: auto; }
  .home-hero-code .term-meta {
    order: 2;
    flex-basis: 100%;
    margin-left: 37px;
    width: max-content;
  }
  .home-hero-code pre.code {
    font-size: 10.75px;
    line-height: 1.48;
  }
  .home-execution-head { grid-template-columns: 1fr; gap: 4px; }
  .home-execution-modalities b { display: none; }
  .home-execution-graph {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .home-execution-stage {
    min-height: 40px;
    width: 100%;
  }
  .home-execution-link {
    justify-self: center;
    width: 1px;
    height: 12px;
  }
  .home-execution-link::after {
    top: auto;
    right: auto;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    border-top: 4px solid var(--ink-3);
    border-right: 3px solid transparent;
    border-bottom: 0;
    border-left: 3px solid transparent;
  }
  .home-execution-link i {
    top: 50%;
    left: 50%;
    animation-name: homeExecutionBatchVertical;
  }
  @keyframes homeExecutionBatchVertical {
    0% { top: 0; opacity: 0; }
    18%, 82% { opacity: 0.8; }
    100% { top: 100%; opacity: 0; }
  }
}
```

The existing global `@media (prefers-reduced-motion: reduce)` rule disables both new animations. Base styles keep connector dots and actor outlines visible when animation is removed.

- [ ] **Step 5: Run focused and full static checks**

Run:

```bash
npm run home:content:check
npm run typecheck
npm run lint
```

Expected: all commands PASS.

- [ ] **Step 6: Commit the visual execution model**

```bash
git add scripts/home-content-check.mjs src/index.css
git commit -m "feat: animate homepage execution model"
```

### Task 4: Verify production behavior and leave the acceptance server running

**Files:**
- Modify only if verification reveals a concrete defect in the files from Tasks 1-3.
- Temporary screenshots: `/tmp/vane-home-hero-en-desktop.png`, `/tmp/vane-home-hero-zh-mobile.png`.

- [ ] **Step 1: Run all required automated verification**

Run:

```bash
npm run home:content:check
npm run typecheck
npm run lint
npm run build
```

Expected: all four commands exit 0; the build reports successful English and Chinese locale output.

- [ ] **Step 2: Start the bilingual development server**

First check the default ports:

```bash
ss -ltn | rg ':3000|:3001|:3002'
```

If there is no output, run `npm run dev` in a persistent terminal. Expected readiness text:

```text
Vane dev server is running at: http://localhost:3000/
```

If any default port is occupied, check `4328`, `4329`, and `4330`; if free, run `PORT=4328 npm run dev` and use `http://localhost:4328/` for the remaining steps.

- [ ] **Step 3: Verify both locale routes respond**

Run against the selected public port:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/zh-CN/
```

Expected: both responses are HTTP 200. Substitute `4328` only when the fallback port was selected.

- [ ] **Step 4: Capture desktop and mobile evidence**

With the server still running, capture:

```bash
firefox --headless --window-size 1440,1000 --screenshot /tmp/vane-home-hero-en-desktop.png http://127.0.0.1:3000/
firefox --headless --window-size 390,844 --screenshot /tmp/vane-home-hero-zh-mobile.png http://127.0.0.1:3000/zh-CN/
```

Expected: each command creates a non-empty PNG. Substitute the fallback port when necessary.

- [ ] **Step 5: Inspect and correct visual defects**

Inspect both screenshots and confirm:

- Desktop keeps the Hero balanced and the right window does not overflow its grid column.
- IMG, VID, and AUD appear before the four execution stages.
- CPU decode and four GPU actor cells are readable without suggesting real telemetry.
- Mobile has no page-level horizontal overflow; the graph is vertical and the code scroll remains inside the terminal.
- Chinese value copy fits without colliding with the graph.
- The lower benchmark section remains unchanged.

If a defect is found, patch only the implicated component/CSS, rerun `home:content:check`, `typecheck`, and the relevant screenshot, then commit with:

```bash
git add src/components/HomeHeroExecution.tsx src/components/CodeWindow.tsx src/pages/Home.tsx src/index.css scripts/home-content-check.mjs
git commit -m "fix: polish homepage hero execution window"
```

- [ ] **Step 6: Confirm the final tree and keep the server alive for acceptance**

Run:

```bash
git status --short
```

Expected: no output. Keep the persistent dev-server process running and report its exact English and Chinese homepage URLs to the user.
