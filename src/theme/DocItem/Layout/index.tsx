import clsx from 'clsx'
import type {ReactNode} from 'react'
import {useWindowSize} from '@docusaurus/theme-common'
import {useDoc} from '@docusaurus/plugin-content-docs/client'
import ContentVisibility from '@theme/ContentVisibility'
import DocBreadcrumbs from '@theme/DocBreadcrumbs'
import DocItemContent from '@theme/DocItem/Content'
import DocItemFooter from '@theme/DocItem/Footer'
import DocItemPaginator from '@theme/DocItem/Paginator'
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocVersionBanner from '@theme/DocVersionBanner'

function useDocTOC() {
  const {frontMatter, toc} = useDoc()
  const windowSize = useWindowSize()
  const hidden = frontMatter.hide_table_of_contents
  const canRender = !hidden && toc.length > 0

  return {
    desktop: canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? <DocItemTOCDesktop /> : undefined,
    hidden,
  }
}

export default function DocItemLayout({children}: {children: ReactNode}) {
  const docTOC = useDocTOC()
  const {metadata} = useDoc()

  return (
    <div className="row docs-data-row">
      <div className={clsx('col', !docTOC.hidden && 'docs-data-doc-col')}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <article className="doc">
          <DocBreadcrumbs />
          <DocVersionBadge />
          <DocItemContent>{children}</DocItemContent>
          <DocItemFooter />
          <DocItemPaginator />
        </article>
      </div>
      {docTOC.desktop && <div className="col col--3 docs-data-toc-col">{docTOC.desktop}</div>}
    </div>
  )
}
