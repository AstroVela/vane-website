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
    sidebar.json       docs sidebar grouping / ordering
  index.css, pages.css global styles and design tokens

docs/
  getting-started/     onboarding docs
  execution/           runtime and deployment docs
  api/                 API reference docs
  resources/           troubleshooting and supporting material
```

## Authoring documentation

The docs follow the same broad management pattern as larger Docusaurus sites
such as Apache Doris: MDX content lives in the repository-level `docs/`
directory, while sidebar order and route registration live in a small docs
module under `src/docs/`. The current site still renders docs through the
existing custom UI so the public routes and visual styling remain unchanged.

### Add a new page

1. Create `docs/<section>/<slug>.mdx`. Export a `title` and write the body in
   Markdown. The public route remains `/docs/<slug>` regardless of the section
   folder:

   ```mdx
   export const title = 'My New Page'

   Intro paragraph in plain Markdown.

   ## A section

   Prose, tables, and lists are plain Markdown. Use the provided block
   components for richer content:

   <Callout label="Tip">

   Body text here (keep the blank lines inside the tag).

   </Callout>

   <CodeWindow filename="example.py" code={`print("hello")`} />
   ```

   Choose an existing section folder when possible: `getting-started`,
   `execution`, `api`, or `resources`.

2. Register the MDX file in `src/docs/registry.ts` by importing it and adding
   it to `DOCS_PAGES` with the desired public slug.

3. Add the page to the sidebar in `src/docs/sidebar.json` by referencing its slug
   under the desired group:

   ```json
   { "group": "Getting Started", "items": [{ "slug": "my-new-page" }] }
   ```

That's it — the page `<h1>`, the sidebar label, and the prev/next pager all come
from the exported `title`; the in-page TOC is built from the page's `##` headings.

### How rendering works

- `src/components/mdxComponents.tsx` maps Markdown elements onto the site's
  styled markup (headings, tables, lists, inline code, links).
- Block components available inside any `.mdx` without importing: `Lead`,
  `Callout`, `CodeWindow`.
- Docusaurus' MDX pipeline gives every `##` heading an id, so in-page anchors and the
  scrollspy work without hand-written ids.

## License

Licensed under the [Apache License 2.0](./LICENSE).
