# Vane site

Marketing and documentation site for **Vane** — a DuckDB-compatible engine for
multimodal data pipelines on Ray. Built with React 19 + Docusaurus, with the
documentation authored in MDX and rendered through the site's existing UI.

## Tech stack

- **React 19** + **Docusaurus 3** (custom routes registered by `src/plugins/vaneRoutes.ts`)
- **MDX** for documentation content, rendered with the site's custom MDX components
- **ESLint** (flat config in `eslint.config.ts`)

## Getting started

Prerequisites: **Node 20.19+** (or 22.12+) and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:3000)
npm run build      # production build to build/
npm run preview    # serve the production build locally
npm run lint       # run ESLint
npm run docs:lint  # check docs registry, sidebar, links, headings, and code fences
npm run docs:manifest        # regenerate docs/manifest.json
npm run docs:manifest:check  # verify docs/manifest.json is current
npm run docs:llms            # regenerate docs/llms.txt and docs/llms-full.txt
npm run docs:llms:check      # verify generated LLM docs files are current
```

## Project structure

```text
src/
  clientStyles.ts      imports the site's global CSS for Docusaurus
  plugins/
    vaneRoutes.ts      Docusaurus route registration for public pages
  router.tsx           compatibility Link/useRouter helpers over Docusaurus routing
  pages/               Home, UseCases, Benchmarks, Docs
  components/          shared UI (Nav, Footer, CodeWindow, …)
  docs/
    registry.ts        MDX page registry and public doc slug ordering
    sidebar.data.json  Vane Data docs grouping / ordering
  index.css, pages.css global styles and design tokens

docs/
  index.mdx            docs home and audience-based entry points
  quickstart/          product intro, installation, SQL and Python quickstarts
  concepts/            architecture and mental models
  guides/              task-oriented how-to guides
  examples/            example catalog and reusable example template
  deploy/              single-node, Ray cluster, and sizing material
  contributing/        development and contribution workflow
  manifest.json        generated docs metadata manifest
  llms.txt             machine-readable docs index
  llms-full.txt        concatenated docs corpus for agent ingestion
```

## Authoring documentation

The docs follow the same broad management pattern as larger Docusaurus sites
such as Apache Doris: MDX content lives in the repository-level `docs/`
directory, while sidebar order and route registration live in a small docs
module under `src/docs/`. The current site still renders docs through the
existing custom UI so the public routes and visual styling remain unchanged.

### Add a new page

1. Create `docs/<section>/<slug>.mdx`. Add a `title` frontmatter field, then
   write the body in Markdown or MDX. Do not add a top-level `#` heading; the
   rendered page `<h1>` still comes from `DOCS_PAGES` during the current
   registry transition. The public Vane Data route mirrors the docs folder, for example
   `docs/guides/my-guide.mdx` becomes `/docs/data/guides/my-guide`.

   ```mdx
   ---
   title: My Guide
   ---

   TODO.

   ## A section

   Prose, tables, lists, and links are plain Markdown. Fenced code blocks must
   include a language such as `python`, `sql`, or `bash`. Use MDX components
   such as `Callout`, `Lead`, and `CodeWindow` when a page needs richer
   presentation.
   ```

   Choose an existing section folder when possible: `quickstart`, `concepts`,
   `guides`, `examples`, `deploy`, or `contributing`.

2. Register the MDX file in `src/docs/registry.ts` by importing it and
   adding it to `DOCS_PAGES` with the desired public slug and the same title.

3. Add the page to the sidebar in `src/docs/sidebar.data.json` by referencing
   its slug under the desired group:

   ```json
   { "group": "Guides", "items": [{ "slug": "guides/my-guide" }] }
   ```

That's it — the page `<h1>`, the sidebar label, and the prev/next pager all come
from `DOCS_PAGES`; the in-page TOC is built from the page's `##` headings.

Before opening a docs PR, run:

```bash
npm run docs:lint
npm run docs:manifest:check
npm run docs:llms:check
npm run typecheck
npm run lint
```

`docs:lint` checks that registered pages, sidebar entries, public doc links,
relative Markdown links, frontmatter titles, top-level headings, and fenced code
languages stay in sync. `docs:manifest:check` ensures `docs/manifest.json`
matches the current registry, sidebar, and page frontmatter. `docs:llms:check`
ensures the machine-readable docs files match the manifest and current MDX
source.

### How rendering works

- `src/components/mdxComponents.tsx` maps Markdown elements onto the site's
  styled markup (headings, tables, lists, inline code, links).
- Block components available inside any `.mdx` without importing: `Lead`,
  `Callout`, `CodeWindow`.
- Docusaurus' MDX pipeline gives every `##` heading an id, so in-page anchors and the
  scrollspy work without hand-written ids.
- `docs/manifest.json` is generated from `src/docs/registry.ts`,
  `src/docs/sidebar.data.json`, and page frontmatter. It is the stable
  machine-readable source to build future search, LLM, or registry generation
  workflows.
- `docs/llms.txt` and `docs/llms-full.txt` are generated from the manifest and
  MDX source. Regenerate them after changing docs content or ordering.

## License

Licensed under the [Apache License 2.0](./LICENSE).
