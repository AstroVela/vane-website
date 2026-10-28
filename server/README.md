# SQLite Demo request service

Node 24 serves the built English/Chinese website and the Demo API. It uses Node's built-in `node:sqlite`, with one database file, WAL and a 5-second busy timeout. No database server, Docker or cloud database is required. Only product-demo requests are stored; media showcases are bundled files and do not call models.

## Local preview

```bash
npm ci
npm run build
npm run preview:local
```

Open `http://127.0.0.1:4328` or `/zh-CN`. The server creates `.local-data/demo.sqlite` automatically, persists submissions and sends no email. Copy `.env.example` to `.env.local` to change the port, database path or retention. Docusaurus development alone has no Demo API and shows the form's unavailable state.

`npm run build` prepares Brotli and gzip versions of text assets. The Node service negotiates compression in local and production modes. Content-hashed scripts, styles, fonts and showcase media are cached for one year; HTML revalidates on each visit, and other assets cache for one hour. Content changes use new media filenames. Demo API responses remain uncached. Videos keep native HTTP byte-range delivery and fast-start MP4 indexes; they are not gzip-compressed.

The showcase initially renders its heading, understanding and poster. After resolving the selected media type and painting the first screen, the visible player loads during idle time. Manual playback or an evidence click can start loading immediately. Video previews use 360/480-pixel derivatives chosen for the displayed size and pixel density; both retain the complete timeline and original AAC audio track. Full-resolution sources and derivation checksums remain in the media manifest.

## Production

Run the Node service behind your HTTPS reverse proxy. Set `NODE_ENV=production`, `DEMO_SITE_URL` to the public origin, and `DEMO_DB_PATH` to a persistent local disk. Verify a sender with Resend and configure `DEMO_FROM`, `RESEND_API_KEY` and a random `DEMO_RATE_LIMIT_SECRET`. `DEMO_TO` defaults to `pulse@astrovela.ai` and is server configuration. Keys never enter the browser bundle or Git.

```bash
NODE_ENV=production npm start
```

Both tables and the required production settings must be available for the form to accept requests. Missing configuration returns a real unavailable status. Configure the reverse proxy to overwrite `X-Real-IP`; set `DEMO_TRUST_PROXY=1` only when that proxy connects from loopback. Otherwise the socket peer is used for rate limits. Preserve the public Host header.

`npm run deploy:static` retains the existing Cloudflare static publishing option. It publishes pages without the SQLite service; the Demo form will be unavailable until its `/api/*` requests are routed to the Node service. The primary complete deployment is the Node service with its SQLite file.

## Request and notification behavior

- `GET /api/demo-status`: actual availability and retention, without private configuration or requests.
- `POST /api/demo-requests`: same-origin JSON with a UUID idempotency key, bounded body and shared client/server validation. Success is returned only after persistence.
- Replaying the same normalized business content with the same key returns the original receipt; changed content returns 409. Existing receipts bypass the rate limit.
- Email notification is independent of receipt. An atomic lease prevents competing sends. Six attempts: initial send, then delays of 1 minute, 5 minutes, 15 minutes, 1 hour and 6 hours. A five-minute scheduler handles due retries. Resend receives a stable request-specific idempotency key.
- Limit: 10 new requests per network address per ten-minute bucket. Store a bucket-specific address hash, never the raw address.
- `last_error_code` records only a category or HTTP status. Six failed notifications remain available for operator follow-up until retention expires.
- Retention defaults to 90 days and supports 1–365 days. Cleanup runs at startup and every five minutes. The form and privacy page read the same configuration.
- The browser stores only a successful request number for the tab session. Form contents are not persisted in browser storage; analytics events exclude personal fields.

There is no public request-list endpoint. Inspect the local database with SQLite tooling or Node's SQLite API:

```sql
SELECT request_id, created_at, attempts, notified_at, last_error_code
FROM demo_requests ORDER BY created_at DESC;
```

Back up the database using SQLite's backup tooling or stop the service before copying the database and its WAL files. Keep the database directory private. Application/database startup errors prevent acceptance; mail outages do not discard persisted requests.

## Checks and media

Run typecheck, lint, unit tests, content/document checks, build, then `npm run test:browser` against the running preview. Browser acceptance writes designated local test rows, never sends email, and saves screenshots under `.tmp-visual-check`.

Marketing content lives in `src/content`. Form validation is shared in `src/demoContract.ts`. Media source checksums, derivations and codecs are documented in [media-manifest.json](../public/showcase/marketing/media-manifest.json). Showcase results are authored examples of ideal capability, not live retrieval results or customer benchmarks.
