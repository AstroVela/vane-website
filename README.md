# Vane site

Marketing and documentation site for **Vane** — a DuckDB-compatible engine for
multimodal data pipelines on Ray. Built with React 19 + Docusaurus, with the
documentation authored in MDX and rendered through the site's existing UI.

## Tech stack

- **React 19** + **Docusaurus 3** (Docusaurus docs plugin plus custom marketing routes)
- **MDX** for documentation content, rendered with the site's custom MDX components
- **ESLint** (flat config in `eslint.config.ts`)

## Getting started

Prerequisites: **Node 20.19+** (or 22.12+) and npm.

```bash
npm install        # install dependencies
npm run dev        # start the bilingual dev server (http://localhost:3000)
npm run dev:en     # start the English locale Docusaurus server only
npm run dev:zh-CN  # start the Chinese locale Docusaurus server only
npm run build      # production build to build/
npm run preview    # serve the production build locally
npm run lint       # run ESLint
npm run docs:lint  # check docs registry, sidebar, links, headings, and code fences
npm run docs:manifest        # regenerate docs/manifest.json
npm run docs:manifest:check  # verify docs/manifest.json is current
npm run docs:llms            # regenerate docs/llms.txt and docs/llms-full.txt
npm run docs:llms:check      # verify generated LLM docs files are current
```

The default `npm run dev` command starts one Docusaurus server per locale with
separate generated-file directories, then exposes them through one local proxy:
English routes such as `/docs/data` and Chinese routes such as `/zh-CN/docs/data`
are both available from `http://localhost:3000`. Use `npm run dev:en` or
`npm run dev:zh-CN` only when you intentionally want a single-locale Docusaurus
server.

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
    registry.ts        docs metadata registry and public doc slug ordering
    sidebar.data.json  Vane Data docs grouping / ordering
  index.css, pages.css global styles and design tokens

docs/
  data/
    index.mdx          docs home and audience-based entry points
    quickstart/        product intro, installation, SQL and Python quickstarts
    concepts/          architecture and mental models
    tutorials/         tutorial overview, examples, use cases, and reusable template
    deploy/            runner configuration and Ray deployment material
    contributing/      development and contribution workflow
  manifest.json        generated docs metadata manifest
  llms.txt             machine-readable docs index
  llms-full.txt        concatenated docs corpus for agent ingestion

i18n/
  zh-CN/
    docusaurus-plugin-content-docs-data/
      current/         Chinese docs mirror using the same English slugs
```

## Authoring documentation

The docs follow the same broad management pattern as larger Docusaurus sites
such as Apache Doris: MDX content lives under `docs/data/`, Docusaurus scans the
folder for public `/docs/data/...` routes, and sidebar order is generated from
`src/docs/sidebar.data.json`. Chinese docs live under
`i18n/zh-CN/docusaurus-plugin-content-docs-data/current/` with matching English
slugs, so `tutorials/examples/my-example.mdx` becomes
`/zh-CN/docs/data/tutorials/examples/my-example`.

### Add a new page

1. Create `docs/data/<section>/<slug>.mdx`. Add a `title` frontmatter field, then
   write the body in Markdown or MDX. Do not add a top-level `#` heading; the
   page title comes from frontmatter. The public Vane Data route mirrors the docs folder, for example
   `docs/data/tutorials/examples/my-example.mdx` becomes
   `/docs/data/tutorials/examples/my-example`.

   ```mdx
   ---
   title: My Example
   ---

   TODO.

   ## A section

   Prose, tables, lists, and links are plain Markdown. Fenced code blocks must
   include a language such as `python`, `sql`, or `bash`. Use MDX components
   such as `Callout`, `Lead`, and `CodeWindow` when a page needs richer
   presentation.
   ```

   Choose an existing section folder when possible: `quickstart`, `concepts`,
   `tutorials`, `deploy`, or `contributing`.

2. Register the MDX file in `src/docs/registry.ts` by adding it to `DOCS_PAGES`
   with the desired public slug, source path, and the same title.

3. Add the page to the sidebar in `src/docs/sidebar.data.json` by referencing
   its slug under the desired group:

   ```json
   {
     "group": "Tutorials",
     "items": [
       {
         "group": "Examples",
         "items": [{ "slug": "tutorials/examples/my-example" }]
       }
     ]
   }
   ```

4. Add or update the Chinese page at
   `i18n/zh-CN/docusaurus-plugin-content-docs-data/current/<section>/<slug>.mdx`.
   Keep the same file name and slug; translate the frontmatter title and body.

That's it — Docusaurus renders the MDX page, while `DOCS_PAGES` remains the
stable metadata registry used by docs tooling and product navigation.

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
