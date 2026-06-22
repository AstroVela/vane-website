import { Link } from '../router'
import Mark from './Mark'
import { GITHUB_URL } from '../siteLinks'

/* Paper footer with ink text. The `home` variant carries the longer blurb +
   the `pip install` line and uses in-page anchors for Product; the default
   variant (Use Cases / Benchmarks pages) routes Product across pages. */
export default function Footer({ home = false }: { home?: boolean }) {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-top">
          <div>
            <div className="brand">
              <Mark size={22} />
              <span className="wm" style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.04em' }}>
                vane
              </span>
            </div>
            {home ? (
              <>
                <p className="mut" style={{ fontSize: 13, maxWidth: 270, marginTop: 13, lineHeight: 1.55 }}>
                  DuckDB-compatible pipelines for AI workloads. Run SQL, Python UDFs, embeddings, and model inference on Ray.
                </p>
                <div style={{ marginTop: 13, fontSize: 12.5 }}>
                  <span className="p" style={{ color: 'var(--green-ink)' }}>$</span> pip install vane-ai
                </div>
              </>
            ) : (
              <p className="mut" style={{ fontSize: 13, maxWidth: 270, marginTop: 13, lineHeight: 1.55 }}>
                The multimodal-native data engine for AI workloads.
              </p>
            )}
          </div>

          {home ? (
            <div>
              <h4>Product</h4>
              <a href="#use-cases">Use Cases</a>
              <a href="#benchmarks">Benchmarks</a>
              <a href="#blog">Blog</a>
            </div>
          ) : (
            <div>
              <h4>Product</h4>
              <Link to="/use-cases">Use Cases</Link>
              <Link to="/benchmarks">Benchmarks</Link>
              <Link to="/docs">Docs</Link>
              <a href="#">Blog</a>
            </div>
          )}

          <div>
            <h4>Docs</h4>
            <Link to="/docs">Getting Started</Link>
            <Link to="/docs/sql-api">SQL / Relation API</Link>
            <Link to="/docs/ai-functions">AI Functions</Link>
            <Link to="/docs/ray-runner">Ray Runner</Link>
          </div>

          <div>
            <h4>Community</h4>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
            <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noreferrer">Discussions</a>
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer">Changelog</a>
            <a href="#">Status</a>
          </div>
        </div>
        <div className="ft-bot">
          <span>© 2026 Vane · Apache-2.0</span>
          <span>Built for engineers.</span>
        </div>
      </div>
    </footer>
  )
}
