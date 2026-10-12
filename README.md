# Vane site

Bilingual marketing and documentation site for two products:

- **Vane Context**: a commercial multimodal context service. The website presents
  illustrative results and accepts demo requests; it does not run live analysis.
- **Vane Data**: the Apache-2.0 open source data engine. Installation, examples,
  benchmarks, engineering articles, and release notes remain available.

Built with React 19 and Docusaurus. A small Node server serves the generated site
and saves demo requests in an embedded SQLite file.

## Tech stack

- **React 19** + **Docusaurus 3** (Docusaurus docs and blog plugins plus custom marketing routes)
- **MDX** for documentation and blog content, rendered with the site's custom MDX components
- **ESLint** (flat config in `eslint.config.ts`)
- **Node 24** and its built-in **SQLite** module for demo request reception
- **Playwright** for browser acceptance checks

## Getting started

Prerequisites: **Node 24+** and npm.

```bash
npm install        # install dependencies
npm run dev        # start the bilingual dev server (http://localhost:3000)
npm run dev:en     # start the English locale Docusaurus server only
npm run dev:zh-CN  # start the Chinese locale Docusaurus server only
npm run build      # production build to build/
npm run preview    # build both locales and serve http://127.0.0.1:4328
npm run preview:local # serve an existing build with SQLite (no email in local mode)
npm run lint       # run ESLint
npm run docs:lint  # check docs registry, sidebar, links, headings, and code fences
npm run docs:manifest        # regenerate docs/manifest.json
npm run docs:manifest:check  # verify docs/manifest.json is current
npm run docs:llms            # regenerate docs/llms.txt and docs/llms-full.txt
npm run docs:llms:check      # verify generated LLM docs files are current
npm run docs:context:check   # verify bilingual Context documentation artifacts
npm run showcase:check       # verify media, locators, and result references
npm test                     # unit and SQLite service tests
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
  pages/               product, scenario, demo, and resource pages
  content/             localized products, scenarios, and showcase definitions
  components/          shared UI (Nav, Footer, CodeWindow, …)
  docs/
    registry.ts        docs metadata registry and public doc slug ordering
    sidebar.data.json  Vane Data docs grouping / ordering
  index.css, pages.css global styles and design tokens

docs/
  context/             commercial integration guides (independent docs plugin)
  data/
    index.mdx          docs home and audience-based entry points
    quickstart/        product intro, installation, SQL and Python quickstarts
    concepts/          architecture and mental models
    tutorials/         tutorial overview, examples, use cases, and reusable template
    reference/         API reference pages
    deploy/            runner configuration and Ray deployment material
    contributing/      development and contribution workflow
  manifest.json        generated docs metadata manifest
  llms.txt             machine-readable docs index
  llms-full.txt        concatenated docs corpus for agent ingestion

blog/
  YYYY-MM-DD-slug.mdx  English blog posts

i18n/
  zh-CN/
    docusaurus-plugin-content-blog/
      YYYY-MM-DD-slug.mdx  Chinese blog post translations
    docusaurus-plugin-content-docs-context/
      current/         Chinese Context guides
    docusaurus-plugin-content-docs-data/
      current/         Chinese docs mirror using the same English slugs
```

## Marketing pages and demo reception

- `/` and `/zh-CN`: interactive media results, analysis, and source references.
- `/products/context` and `/products/data`: product-specific capabilities and actions.
- `/solutions`: scenarios linked to the appropriate product.
- `/demo`: durable request receipt, validation, and safe retries.
- `/docs/context`: six bilingual commercial integration guides.
- `/docs/data`: existing open source documentation.

Marketing copy and showcase definitions live in `src/content/`. Media assets and
creation details live in `public/showcase/v1/` ([provenance](public/showcase/v1/PROVENANCE.md)).
Examples represent an authored ideal result; they are not customer records or live
service outputs. Query parameters remember the chosen task and result. Citation
previews retain that selection. Only one video or audio element can play at a time.

The preview stores requests at `.local-data/demo.sqlite`, which is ignored by Git.
SQLite runs inside the website Node process and has no separate process or port.
Local mode never sends email. The Docusaurus development servers serve pages only;
use the Node preview to test form reception. Deployment configuration, notification
retries, retention, reverse proxy settings, and backups are described in
[server/README.md](server/README.md). Keep the SQLite path on persistent storage in
production. `npm run deploy:static` remains available for static hosting; that mode
requires a separately routed request API before the form can accept submissions.

For browser checks, build and start the local preview, then run:

```bash
npx playwright install chromium
npm run test:browser
```

Screenshots and failure traces are saved under `.tmp-visual-check/` and ignored by
Git. The browser suite covers both languages, mobile navigation, all four media
types, citation return behavior, request persistence, and response-loss retries.

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
   `tutorials`, `reference`, `deploy`, or `contributing`.

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
  `Callout`, `CodeWindow`, and `DataArchitecture`.
- Docusaurus' MDX pipeline gives every `##` heading an id, so in-page anchors and the
  scrollspy work without hand-written ids.
- `docs/manifest.json` is generated from `src/docs/registry.ts`,
  `src/docs/sidebar.data.json`, and page frontmatter. It is the stable
  machine-readable source to build future search, LLM, or registry generation
  workflows.
- `docs/llms.txt` and `docs/llms-full.txt` are generated from the manifest and
  MDX source. Regenerate them after changing docs content or ordering.

## Authoring blog posts

English posts live under `blog/`. Chinese translations live under
`i18n/zh-CN/docusaurus-plugin-content-blog/` with the same file name, slug, and
date. Use frontmatter for the title and metadata, keep only one locale in each
file, and add `<!-- truncate -->` after the list-page excerpt. Shared MDX
components such as `DataArchitecture` are available without an explicit import.

## Authoring release notes

Release notes cover published Vane Data versions. They use a separate Docusaurus
blog instance at `/release-notes`, independent of engineering posts in `/blog`.
Add English MDX under `release-notes/` and the matching Chinese translation under
`i18n/zh-CN/docusaurus-plugin-content-blog-release-notes/`.

Use `YYYY-MM-DD-vX.Y.Z.mdx`, the actual release date, and a stable `vX.Y.Z` slug
in both locales. Include one `<!-- truncate -->` marker after the summary. Verify
claims against the corresponding GitHub Release and tag, preserve experimental
status and limitations, and link to that release and tagged source. Do not infer
historical capabilities from `main` or current documentation. Add compatibility
and upgrade guidance only when supported by the release evidence. Review both
translations when upstream release notes are corrected.

Check the GitHub Releases API before updating the inventory; search-engine
snapshots may omit recent versions. Keep independently released provider
artifacts and candidates out of the Vane Data runtime version list.

## License

Website source is licensed under the [Apache License 2.0](./LICENSE). This does
not grant a license to the separate commercial Vane Context product.
