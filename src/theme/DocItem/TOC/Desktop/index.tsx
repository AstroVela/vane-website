import Link from '@docusaurus/Link'
import {useDoc} from '@docusaurus/plugin-content-docs/client'
import { pickLocale, useSiteLocale } from '../../../../siteI18n'

export default function DocItemTOCDesktop() {
  const locale = useSiteLocale()
  const {toc} = useDoc()
  const title = pickLocale(locale, 'On this page', '本页内容')

  return (
    <aside className="toc theme-doc-toc-desktop">
      {toc.length > 0 && (
        <>
          <div className="tt">{title}</div>
          <ul className="table-of-contents table-of-contents__left-border">
            {toc.map((heading) => (
              <li key={heading.id}>
                <Link
                  to={`#${heading.id}`}
                  className="table-of-contents__link toc-highlight"
                  dangerouslySetInnerHTML={{__html: heading.value}}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}
