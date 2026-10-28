import {useId, useState} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowRightIcon, FileTextIcon, TableIcon, Link2Icon} from '@radix-ui/react-icons'
import FeatureTabs from './FeatureTabs'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function ContextDataExperience() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh, id = useId()
  const [selected, setSelected] = useState('media')
  const image = useBaseUrl('/showcase/marketing/comp_001-poster.45b2669dc293.webp')
  const options = [{id: 'media', label: t('Files & media', '文件与媒体')}, {id: 'tables', label: t('Business data', '业务数据表')}, {id: 'semantics', label: t('Semantic layer', '语义层')}]
  return <div className="context-data-experience">
    <FeatureTabs options={options} value={selected} onChange={setSelected} label={t('Enterprise data sources', '企业数据来源')} panelId={id}/>
    <div className="connected-data" role="tabpanel" id={id} aria-labelledby={`${id}-${selected}`}>
      <div className={'connected-media' + (selected === 'media' ? ' selected' : '')}><img src={image} width={480} height={854} loading="lazy" alt={t('Original campsite video.', '原始露营视频素材。')}/><div><FileTextIcon aria-hidden="true"/><h3>comp_001</h3><p>{t('Original video, transcripts, action clips and source references.', '原始视频、转写、动作片段与来源定位。')}</p><code>creative_id: comp_001</code><Link className="arrow-link" to="/solutions/video-research?media=video&insight=blending">{t('View the source clip', '查看动作片段')} →</Link></div></div>
      <div className="connected-business"><div className={'connected-table' + (selected === 'tables' ? ' selected' : '')}><TableIcon aria-hidden="true"/><h3>ad_daily</h3><dl><div><dt>creative_id</dt><dd>comp_001</dd></div><div><dt>{t('Business fields', '业务字段')}</dt><dd>date / impressions / clicks / conversions</dd></div></dl></div><div className={'connected-semantic' + (selected === 'semantics' ? ' selected' : '')}><Link2Icon aria-hidden="true"/><h3>{t('Campaign performance', '投放表现')}</h3><code>ad_daily.creative_id = creatives.id</code><p>{t('Conversion rate = conversions / clicks. Compare the same reporting period and scope.', '转化率 = 转化数 / 点击数；比较时使用相同统计周期与范围。')}</p></div></div>
    </div>
    <div className="connection-caption"><ArrowRightIcon aria-hidden="true"/><p>{selected === 'media' ? t('Link the source clip to business records through its asset ID.', '通过素材 ID，将原始片段关联到业务记录。') : selected === 'tables' ? t('Trace a business record back to its creative and source media.', '从业务记录定位对应创意与原始素材。') : t('Semantic definitions explain table relationships and metric calculations to the agent.', '通过语义定义，向 Agent 说明表关系与指标口径。')}</p></div>
    <p className="marketing-note">{t('Example data connections. Campaign metrics are supplied by the relevant business records.', '接入关系示例；投放指标需由相应业务数据提供。')}</p>
    <div className="feature-footnote"><span>{t('Connect local files, object storage, business databases, data catalogs and external semantic layers.', '支持本地文件、对象存储、业务数据库、数据目录和外部语义层接入。')}</span><Link className="arrow-link" to="/demo?source=data-connections">{t('Discuss your data sources', '咨询数据接入')} →</Link></div>
  </div>
}
