# Static website preview and deployment

The website is entirely static. Contact and Demo pages display `pulse@astrovela.ai` and let visitors copy the address. They do not submit a form, call a reception API, store requests or send email. The selected solution can provide a discussion prompt on the Demo page. No database, mail-service account, API keys or background jobs are required.

## Local preview

```bash
npm ci
npm run build
npm run preview:local
```

Open `http://127.0.0.1:4328` or `/zh-CN`. The Node 24 preview serves the contents of `build/`; it creates no database. Copy `.env.example` to `.env.local` to change the local host, port or build directory. Docusaurus development and static hosting use the same contact behavior.

`npm run build` prepares Brotli and gzip versions of text assets. The preview negotiates compression. Content-hashed scripts, styles, fonts and showcase media are cached for one year; HTML revalidates on each visit, and other assets cache for one hour. Videos keep native HTTP byte-range delivery and fast-start MP4 indexes; they are not gzip-compressed. The preview accepts GET/HEAD only.

## Cloudflare publishing

```bash
npm run deploy:static
```

This builds both languages and publishes static assets using the existing `wrangler.jsonc`. The colleague responsible for Cloudflare can use the existing account, domain and publishing workflow. No D1 binding, Worker API entrypoint, Cron Trigger or email secrets are needed. Other static hosts can serve `build/` as well.

After publishing, check `/contact`, `/demo?source=contact`, `/privacy`, and their `/zh-CN` equivalents. Contact cards should have solid interiors. The demo page should show a selectable email address and a Copy email address button, with no form or availability check. Copying requires a secure browser context (HTTPS or localhost); if clipboard access is denied, the visible address can be selected and copied manually. Copying never indicates that a message was sent.

## Checks and media

Run typecheck, lint, unit tests, documentation checks, build, then `npm run test:browser` against a running preview. Browser tests cover static contact rendering, copying, denied clipboard access, scenario context and absence of form API calls. They send no email and write no request records.

Marketing content lives in `src/content`. Media source checksums, derivations and codecs are documented in [media-manifest.json](../public/showcase/marketing/media-manifest.json). Showcase results are authored examples of ideal capability, not live retrieval results or customer benchmarks.
