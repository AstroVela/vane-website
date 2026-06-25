import { Link } from '../router'
import Mark from './Mark'
import { GITHUB_URL } from '../siteLinks'

/* Paper footer with ink text, organized as a 5-column sitemap. The `home`
   variant carries the longer blurb + the `pip install` line in the brand
   column; the default variant (Use Cases / Benchmarks pages) shows the short
   tagline. The link columns are identical across variants. */
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

          <div>
            <h4>Product</h4>
            <Link to="/use-cases">Multimodal Data Pipeline</Link>
            <Link to="/use-cases">Enterprise Multimodal Agent</Link>
            <Link to="/benchmarks">Benchmarks</Link>
          </div>

          <div>
            <h4>Docs</h4>
            <Link to="/docs/quickstart">Quickstart</Link>
            <Link to="/docs">Guides</Link>
            <Link to="/use-cases">Examples</Link>
            <Link to="/docs/sql-api">References</Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">Contributing</a>
          </div>

          <div>
            <h4>Resources</h4>
            <Link to="/blog">Blog</Link>
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer">Release Notes</a>
          </div>

          <div>
            <h4>Community</h4>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noreferrer">Discussions</a>
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
