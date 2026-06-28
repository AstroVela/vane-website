/* Maps MDX (Markdown) output onto the doc's existing styled markup so authored
   content renders with the existing CSS classes.

   - Headings (h1/h2/h3) -> .dh/.ds/.dss. Pages set heading ids with explicit
     <h2 id> tags (the `{#id}` shorthand can't be used — it's MDX expression
     syntax); these maps also style any plain markdown `##`.
   - Inline `code` -> the `.link` underline style used throughout the prose.
   - Fenced code blocks -> the site's CodeWindow shell.
   - Markdown tables -> `.dt`, lists -> `.dl`; blockquotes, media, and details
     get docs-safe wrappers. Internal links -> SPA router <Link>.
   - Block components (CodeWindow, Callout, Lead) are provided here too, so
   `.mdx` files can use them without importing. */
import { isValidElement, type ComponentPropsWithoutRef, type PropsWithChildren, type ReactNode } from 'react'
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
    return <Link className="dlink" to={href} {...rest}>{children}</Link>
  }
  return <a className="dlink" href={href} {...rest}>{children}</a>
}

function textFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textFromNode).join('')
  if (isValidElement(node)) {
    return textFromNode((node.props as { children?: ReactNode }).children)
  }
  return ''
}

function languageFromClassName(className?: string): string | undefined {
  return className
    ?.split(/\s+/)
    .find((name) => name.startsWith('language-'))
    ?.slice('language-'.length)
}

function filenameForLanguage(language?: string): string {
  switch (language) {
    case 'python':
      return 'example.py'
    case 'sql':
      return 'query.sql'
    case 'bash':
    case 'sh':
    case 'shell':
      return 'shell'
    case 'json':
      return 'data.json'
    case 'ts':
    case 'tsx':
      return 'example.tsx'
    case 'js':
    case 'jsx':
      return 'example.jsx'
    default:
      return language ?? 'code'
  }
}

function Code({ className, children, ...rest }: ComponentPropsWithoutRef<'code'>) {
  if (languageFromClassName(className)) {
    return <code className={className} {...rest}>{children}</code>
  }
  return <span className="link" {...rest}>{children}</span>
}

function Pre({ children, style }: ComponentPropsWithoutRef<'pre'>) {
  const codeProps = isValidElement(children)
    ? (children.props as { className?: string; children?: ReactNode })
    : undefined
  const language = languageFromClassName(codeProps?.className)
  const code = textFromNode(children).replace(/\n$/, '')
  // `language ?? 'text'` keeps the safe (React-escaped) Prism path even for
  // unlabeled fences; Prism renders unknown languages as plain text.
  return (
    <CodeWindow
      filename={filenameForLanguage(language)}
      code={code}
      language={language ?? 'text'}
      style={style}
    />
  )
}

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="dh" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="ds" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="dss" {...props} />,
  table: (props: ComponentPropsWithoutRef<'table'>) => <table className="dt" {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="dl" {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="dl dol" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => <blockquote className="dq" {...props} />,
  hr: (props: ComponentPropsWithoutRef<'hr'>) => <hr className="dr" {...props} />,
  img: (props: ComponentPropsWithoutRef<'img'>) => <img className="dimg" {...props} />,
  details: (props: ComponentPropsWithoutRef<'details'>) => <details className="ddetails" {...props} />,
  pre: Pre,
  code: Code,
  a: Anchor,
  // block components usable directly inside .mdx
  CodeWindow,
  Callout,
  Lead,
}
