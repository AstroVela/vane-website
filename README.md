# Vane site

Marketing and documentation site for **Vane** — a DuckDB-compatible engine for
multimodal data pipelines on Ray. Built with React 19 + Vite, with the
documentation authored in MDX.

## Tech stack

- **React 19** + **Vite 8** (SPA, custom history-API router in `src/router.jsx`)
- **MDX** for documentation content (`@mdx-js/rollup`, `remark-gfm`, `rehype-slug`)
- **ESLint** (flat config in `eslint.config.js`)

## Getting started

Prerequisites: **Node 20.19+** (or 22.12+) and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint       # run ESLint
```

## Project structure

```
src/
  App.jsx              route switch (path -> page)
  router.jsx           minimal history-API router (RouterProvider, Link, useRouter)
  pages/               Home, UseCases, Benchmarks, Docs
  components/          shared UI (Nav, Footer, CodeWindow, …)
  content/
    docs/              one .mdx file per documentation page
    docsNav.js         sidebar grouping / ordering
  index.css, pages.css global styles and design tokens
```

## Authoring documentation

The docs are a small MDX-driven system. Each topic is its own page; the sidebar
and the per-page "On this page" table of contents are generated automatically.

### Add a new page

1. Create `src/content/docs/<slug>.mdx`. Export a `title` and write the body in
   Markdown:

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

   The file name becomes the route: `/docs/<slug>`.

2. Add the page to the sidebar in `src/content/docsNav.js` by referencing its
   slug under the desired group:

   ```js
   { group: 'Getting Started', items: [{ slug: 'my-new-page' }] }
   ```

That's it — the page `<h1>`, the sidebar label, and the prev/next pager all come
from the exported `title`; the in-page TOC is built from the page's `##` headings.

### How rendering works

- `src/components/mdxComponents.jsx` maps Markdown elements onto the site's
  styled markup (headings, tables, lists, inline code, links).
- Block components available inside any `.mdx` without importing: `Lead`,
  `Callout`, `CodeWindow`.
- `rehype-slug` gives every `##` heading an id, so in-page anchors and the
  scrollspy work without hand-written ids.

## License

Licensed under the [Apache License 2.0](./LICENSE).
