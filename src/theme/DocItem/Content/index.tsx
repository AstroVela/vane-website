import clsx from 'clsx'
import type {ReactNode} from 'react'
import {ThemeClassNames} from '@docusaurus/theme-common'
import {useDoc} from '@docusaurus/plugin-content-docs/client'
import MDXContent from '@theme/MDXContent'

export default function DocItemContent({children}: {children: ReactNode}) {
  const {metadata, frontMatter, contentTitle} = useDoc()
  const syntheticTitle =
    !frontMatter.hide_title && typeof contentTitle === 'undefined' ? metadata.title : undefined

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && <h1 className="dh" id={metadata.id}>{syntheticTitle}</h1>}
      <MDXContent>{children}</MDXContent>
    </div>
  )
}
