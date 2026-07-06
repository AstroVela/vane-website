import {Redirect} from '@docusaurus/router'
import Head from '@docusaurus/Head'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Nav from '../components/Nav'
import ComingSoon from './ComingSoon'
import ProductGlyph from '../docs/ProductGlyph'
import {Link, useRouter} from '../router'
import { pickLocale, useSiteLocale } from '../siteI18n'
import {
  DEFAULT_PRODUCT,
  PRODUCTS,
  isProductId,
  type ProductId,
} from '../docs/products'
import {resolveLegacyDocSlug} from '../docs/legacySlugs'

function dataDocPath(slug?: string) {
  return slug ? `/docs/data/${slug}` : '/docs/data'
}

function parseDocsPath(path: string): {product: ProductId; slug?: string} {
  const normalizedPath = path.replace(/^\/zh-CN(?=\/|$)/, '') || '/'
  const segs = normalizedPath.replace(/^\/docs\/?/, '').split('/').filter(Boolean)
  if (segs.length === 0) return {product: DEFAULT_PRODUCT}
  if (isProductId(segs[0])) return {product: segs[0], slug: segs.slice(1).join('/')}
  return {product: DEFAULT_PRODUCT, slug: segs.join('/')}
}

function RedirectFallback({to}: {to: string}) {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      title: 'Vane Data Docs',
      heading: 'Opening the Vane Data overview.',
      body: 'You are being redirected to the current docs overview.',
      action: 'Open overview',
    },
    {
      title: 'Vane Data 文档',
      heading: '正在打开 Vane Data 概览。',
      body: '页面会跳转到当前文档概览。',
      action: '打开概览',
    },
  )

  return (
    <>
      <Head>
        <title>{copy.title}</title>
        <meta httpEquiv="refresh" content={`0;url=${to}`} />
      </Head>
      <Nav withCta={false} />
      <main className="doc">
        <h1 className="dh">{copy.heading}</h1>
        <p>{copy.body}</p>
        <p>
          <Link className="dlink" to={to}>{copy.action}</Link>
        </p>
      </main>
      <Redirect to={to} />
    </>
  )
}

export default function Docs() {
  const locale = useSiteLocale()
  const {path} = useRouter()
  const {product, slug} = parseDocsPath(path)
  const prod = PRODUCTS[product]
  const dataTo = useBaseUrl(dataDocPath(resolveLegacyDocSlug(slug) ?? slug))

  if (product === 'data') {
    return <RedirectFallback to={dataTo} />
  }

  return (
    <>
      <Nav withCta={false} />
      <div className="docs">
        <nav className="side side-soon">
          <div className="prod">
            <span className="prod-ic">
              <ProductGlyph id={product} size={15} />
            </span>
            <div>
              <div className="prod-name">{prod.name}</div>
              <div className="prod-status">{pickLocale(locale, 'In development', '开发中')}</div>
            </div>
          </div>
        </nav>
        <main className="doc">
          <ComingSoon product={prod} />
        </main>
        <aside className="toc" aria-hidden="true" />
      </div>
    </>
  )
}
