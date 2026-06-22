/* Maps MDX (Markdown) output onto the doc's existing styled markup so authored
   content renders with the existing CSS classes.

   - Headings (h1/h2/h3) -> .dh/.ds/.dss. Pages set heading ids with explicit
     <h2 id> tags (the `{#id}` shorthand can't be used — it's MDX expression
     syntax); these maps also style any plain markdown `##`.
   - Inline `code` -> the `.link` underline style used throughout the prose.
   - Markdown tables -> `.dt`, lists -> `.dl`. Internal links -> SPA router <Link>.
   - Block components (CodeWindow, Callout, Lead) are provided here too, so
   `.mdx` files can use them without importing. */
import type {ComponentPropsWithoutRef, PropsWithChildren} from 'react'
import type {MDXComponents} from 'mdx/types'
import CodeWindow from './CodeWindow'
import { Link } from '../router'

type CalloutProps = PropsWithChildren<{
  label?: string
}>

function Callout({ label = 'Note', children }: CalloutProps) {
  // Body comes from MDX as a markdown paragraph (blank lines inside the tag),
  // which already supplies the <p> — don't wrap it again.
  return (
    <div className="callout">
      <span className="cb">{label}.</span>
      {children}
    </div>
  )
}

function Lead({ children }: PropsWithChildren) {
  return <p className="dintro">{children}</p>
}

function Anchor({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) {
    return <Link to={href} {...rest}>{children}</Link>
  }
  return <a href={href} {...rest}>{children}</a>
}

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="dh" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="ds" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="dss" {...props} />,
  table: (props: ComponentPropsWithoutRef<'table'>) => <table className="dt" {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="dl" {...props} />,
  code: (props: ComponentPropsWithoutRef<'code'>) => <span className="link" {...props} />,
  a: Anchor,
  // block components usable directly inside .mdx
  CodeWindow,
  Callout,
  Lead,
}
