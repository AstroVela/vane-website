import {useId, useState} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import FeatureTabs from './FeatureTabs'
import {useSiteLocale} from '../siteI18n'

export default function ProductManagement() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh, id = useId()
  const [topic, setTopic] = useState('verify')
  const topics = [
    {id: 'verify', label: t('Verify understanding', '核验理解'), image: 'data-space', title: t('Read knowledge alongside its original evidence.', '阅读知识，对照原始依据。'), body: t('Read prepared knowledge, open media and inspect source references.', '阅读已有知识、打开素材、核对来源引用。')},
    {id: 'definitions', label: t('Manage definitions', '管理定义'), image: 'parsing', title: t('Keep processing rules understandable.', '看清并调整资料的处理规则。'), body: t('Manage reusable parsing functions and select the definitions used by your data space.', '管理可复用解析函数，为数据空间选择适用的处理定义。')},
    {id: 'processing', label: t('Follow processing', '追踪处理'), image: 'processing', title: t('Locate the object that needs attention.', '找到需要关注的资料与处理。'), body: t('Inspect ongoing work and failed items, then open the affected object.', '查看进行中的处理与失败项，再进入受影响的对象。')},
    {id: 'usage', label: t('Inspect usage', '查看用量'), image: 'usage', title: t('See where model usage happens.', '了解模型消耗发生在哪些环节。'), body: t('Inspect reported tokens, actual reuse and compression, with unknown pricing kept visible.', '查看已报告 Token、实际复用与压缩记录，未知价格明确显示。')},
  ]
  const selected = topics.find(item => item.id === topic)!, src = useBaseUrl('/showcase/product/' + selected.image + '.png')
  return <div className="product-management"><FeatureTabs options={topics} value={topic} onChange={setTopic} label={t('Product management', '产品管理')} panelId={id}/><div className="management-preview" role="tabpanel" id={id} aria-labelledby={`${id}-${topic}`}><div className="management-caption"><h3>{selected.title}</h3><p>{selected.body}</p></div><img key={src} src={src} width={1440} height={900} loading="lazy" alt={selected.title}/></div><p className="marketing-note">{t('Actual product interface shown with isolated sample data.', '真实产品界面，以隔离样例数据呈现。')}</p></div>
}
