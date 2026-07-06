import {useDoc} from '@docusaurus/plugin-content-docs/client'
import {
  EditIcon,
  docsEditUrl,
  formatLastUpdated,
  lastUpdatedForDocSource,
} from '../../../docs/docsUi'
import { pickLocale, useSiteLocale } from '../../../siteI18n'

export default function DocItemFooter() {
  const locale = useSiteLocale()
  const {metadata} = useDoc()
  const lastUpdated = formatLastUpdated(lastUpdatedForDocSource(metadata.source), locale)
  const copy = pickLocale(
    locale,
    {
      edit: 'Edit this page',
      updated: 'Last updated on',
    },
    {
      edit: '编辑本页',
      updated: '最后更新于',
    },
  )

  return (
    <div className="doc-meta">
      <a className="doc-edit" href={docsEditUrl(metadata.source)} target="_blank" rel="noreferrer">
        <EditIcon />
        {copy.edit}
      </a>
      {lastUpdated && (
        <div className="doc-updated">
          {copy.updated} <strong>{lastUpdated}</strong>
        </div>
      )}
    </div>
  )
}
