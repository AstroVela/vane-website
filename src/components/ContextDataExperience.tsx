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
  const options = [{id: 'media', label: t('Files & media', '文件与媒体')}, {id: 'tables', label: t('Business tables', '业务数据表')}, {id: 'semantics', label: t('Business semantics', '业务语义')}]
  return <div className="context-data-experience">
    <FeatureTabs options={options} value={selected} onChange={setSelected} label={t('Enterprise data sources', '企业数据来源')} panelId={id}/>
    <div className="connected-data" role="tabpanel" id={id} aria-labelledby={`${id}-${selected}`}>
      <div className={'connected-media' + (selected === 'media' ? ' selected' : '')}><img src={image} width={480} height={854} loading="lazy" alt={t('Original campsite video.', '原始露营视频素材。')}/><div><FileTextIcon aria-hidden="true"/><h3>comp_001</h3><p>{t('Video, transcript, action windows and source references.', '视频、转写、动作片段与来源引用。')}</p><code>creative_id: comp_001</code><Link className="arrow-link" to="/solutions/video-research?media=video&insight=blending">{t('Inspect an action reference', '核验动作片段')} →</Link></div></div>
      <div className="connected-business"><div className={'connected-table' + (selected === 'tables' ? ' selected' : '')}><TableIcon aria-hidden="true"/><h3>ad_daily</h3><dl><div><dt>creative_id</dt><dd>comp_001</dd></div><div><dt>{t('Business fields', '业务字段')}</dt><dd>date / impressions / clicks / conversions</dd></div></dl></div><div className={'connected-semantic' + (selected === 'semantics' ? ' selected' : '')}><Link2Icon aria-hidden="true"/><h3>{t('Campaign performance', '投放表现')}</h3><code>ad_daily.creative_id = creatives.id</code><p>{t('Conversion rate = conversions / clicks. Compare the same reporting period and scope.', '转化率 = 转化数 / 点击数；比较时使用相同统计周期与范围。')}</p></div></div>
    </div>
    <div className="connection-caption"><ArrowRightIcon aria-hidden="true"/><p>{selected === 'media' ? t('The clip retains the identifier that links it to business records.', '素材保留业务标识，可以关联到对应业务记录。') : selected === 'tables' ? t('Business records can point back to the creative and its original media.', '业务记录可以回到对应素材和原始媒体。') : t('Definitions explain relationships and measurement meaning for the agent.', '语义定义为 Agent 说明关联关系和指标含义。')}</p></div>
    <p className="marketing-note">{t('Connection example. Media and business definitions are illustrative; no campaign performance is asserted.', '接入关系示意，业务定义为示例，不表示素材的实测投放表现。')}</p>
    <div className="feature-footnote"><span>{t('Local files, object storage, structured records, catalogs and semantic definitions.', '本地文件、对象存储、结构化记录、数据目录与语义定义。')}</span><Link className="arrow-link" to="/docs/context">{t('Discuss your data sources', '了解数据接入')} →</Link></div>
  </div>
}
