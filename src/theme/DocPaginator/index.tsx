import {translate} from '@docusaurus/Translate'
import {Link} from '../../router'
import { pickLocale, useSiteLocale } from '../../siteI18n'
import {docPageTitle, isDocSlug} from '../../docs/registry'

type DocPaginatorItem = {
  permalink: string
  title: string
}

type DocPaginatorProps = {
  className?: string
  next?: DocPaginatorItem
  previous?: DocPaginatorItem
}

function localizedTitle(item: DocPaginatorItem, locale: ReturnType<typeof useSiteLocale>) {
  if (locale !== 'zh-CN') return item.title
  const path = item.permalink.replace(/^\/zh-CN(?=\/|$)/, '').replace(/\/$/, '')
  const slug = path === '/docs/data'
    ? 'index'
    : path.startsWith('/docs/data/')
      ? path.slice('/docs/data/'.length)
      : undefined

  return isDocSlug(slug)
    ? docPageTitle(slug, locale)
    : item.title
}

export default function DocPaginator({previous, next}: DocPaginatorProps) {
  const locale = useSiteLocale()
  if (!previous && !next) return null
  const navLabel = pickLocale(locale, 'Docs pages', '文档页面')

  return (
    <nav
      className="pager"
      aria-label={locale === 'zh-CN' ? navLabel : translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
        description: 'The ARIA label for the docs pagination',
      })}
    >
      {previous && <Link to={previous.permalink}>← {localizedTitle(previous, locale)}</Link>}
      {next && (
        <Link className="nx" to={next.permalink}>
          {localizedTitle(next, locale)} →
        </Link>
      )}
    </nav>
  )
}
