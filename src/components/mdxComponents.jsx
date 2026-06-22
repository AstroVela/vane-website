/* Maps MDX (Markdown) output onto the doc's existing styled markup so authored
   content renders with the existing CSS classes.

   - Headings (h1/h2/h3) -> .dh/.ds/.dss. Pages set heading ids with explicit
     <h2 id> tags (the `{#id}` shorthand can't be used — it's MDX expression
     syntax); these maps also style any plain markdown `##`.
   - Inline `code` -> the `.link` underline style used throughout the prose.
   - Markdown tables -> `.dt`, lists -> `.dl`. Internal links -> SPA router <Link>.
   - Block components (CodeWindow, Callout, Lead) are provided here too, so
     `.mdx` files can use them without importing. */
import CodeWindow from './CodeWindow'
import { Link } from '../router'

function Callout({ label = 'Note', children }) {
  // Body comes from MDX as a markdown paragraph (blank lines inside the tag),
  // which already supplies the <p> — don't wrap it again.
  return (
    <div className="callout">
      <span className="cb">{label}.</span>
      {children}
    </div>
  )
}

function Lead({ children }) {
  return <p className="dintro">{children}</p>
}

function Anchor({ href = '', children, ...rest }) {
  if (href.startsWith('/')) {
    return <Link to={href} {...rest}>{children}</Link>
  }
  return <a href={href} {...rest}>{children}</a>
}

export const mdxComponents = {
  h1: (props) => <h1 className="dh" {...props} />,
  h2: (props) => <h2 className="ds" {...props} />,
  h3: (props) => <h3 className="dss" {...props} />,
  table: (props) => <table className="dt" {...props} />,
  ul: (props) => <ul className="dl" {...props} />,
  code: (props) => <span className="link" {...props} />,
  a: Anchor,
  // block components usable directly inside .mdx
  CodeWindow,
  Callout,
  Lead,
}
