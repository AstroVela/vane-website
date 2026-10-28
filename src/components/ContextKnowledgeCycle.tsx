import {useId, useState} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowRightIcon, CheckIcon, UpdateIcon} from '@radix-ui/react-icons'
import FeatureTabs from './FeatureTabs'
import {useSiteLocale} from '../siteI18n'

export default function ContextKnowledgeCycle() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh, id = useId()
  const [state, setState] = useState('first')
  const image = useBaseUrl('/showcase/marketing/comp_001-blending.a20b043d09b6.webp')
  const reused = state === 'reuse', updated = state === 'update'
  return <div className="knowledge-cycle" data-state={state}>
    <div className="knowledge-preparation"><div><strong>{t('Continuous processing', '持续处理与更新')}</strong><p>{t('Extract content with source locations, and maintain embeddings, indexes and source versions.', '提取内容并保留来源定位，持续维护向量、索引与资料版本。')}</p></div><div className="knowledge-prepared-items">{[t('Source references', '来源引用'), t('Initial analysis', '初步分析结果'), t('Embeddings & indexes', '向量与索引')].map(label => <span key={label}><CheckIcon aria-hidden="true"/>{label}</span>)}</div></div>
    <FeatureTabs options={[{id: 'first', label: t('First task', '首次任务')}, {id: 'reuse', label: t('Related task', '后续相关任务')}, {id: 'update', label: t('Source updated', '来源更新后')}]} value={state} onChange={setState} label={t('Knowledge lifecycle', '知识生命周期')} panelId={id}/>
    <div className="knowledge-online" role="tabpanel" id={id} aria-labelledby={`${id}-${state}`}>
      <div><span className="result-caption">{t('Agent request', 'Agent 资料需求')}</span><h3>{t('Find footage that shows portable use, with evidence.', '找出体现便携使用的片段，并提供依据')}</h3><ol>{[
        [t('Retrieve the relevant part', '检索相关内容'), reused ? t('Retrieve the saved analysis result.', '直接检索已保存的分析结果。') : t('Locate candidate clips using existing indexes.', '利用已有索引定位候选片段。')],
        [reused ? t('Verify and reuse', '核验并复用') : updated ? t('Refresh changed content', '更新变化的内容') : t('Analyze the missing details', '分析缺失细节'), reused ? t('Check access and source version; use the valid finding.', '检查权限与来源版本，使用仍有效的理解。') : updated ? t('Reprocess the changed source; replace knowledge that no longer applies.', '更新变化的来源，替换已不适用的理解与索引。') : t('Analyze only the relevant clip.', '只分析选定的相关片段。')],
        [t('Return task-relevant context', '提供任务所需上下文'), t('Return the finding and its original reference.', '返回与任务相关的理解及原始引用。')],
      ].map(([title, description]) => <li key={title}><strong>{title}</strong><p>{description}</p></li>)}</ol></div>
      <div className="knowledge-kept"><div className="knowledge-source"><img src={image} width={480} height={854} loading="lazy" alt={t('Original product-action window.', '原始素材中的产品操作片段。')}/><div><span className="result-caption">{reused ? t('Reusable knowledge', '可复用知识') : updated ? t('Updated knowledge', '已更新知识') : t('New analysis', '本次新增分析')}</span><h3>{t('Blending at the campsite', '露营场景中的搅拌动作')}</h3><p>{t('The footage shows ingredients being blended on the outdoor table.', '片段显示在户外桌面上进行搅拌的操作。')}</p><code>comp_001 / 00:05–00:07</code></div></div><div className="knowledge-publish">{updated ? <UpdateIcon aria-hidden="true"/> : <CheckIcon aria-hidden="true"/>}<p>{reused ? t('Use valid knowledge. Analyze further only when the next question needs more detail.', '使用已有知识，新的问题需要更多细节时再补充理解。') : t('Validated analysis results are saved to the data space for future retrieval and reuse.', '通过校验的分析结果保存到数据空间，供后续任务检索与复用。')}</p></div></div>
    </div>
    <div className="knowledge-loop"><ArrowRightIcon aria-hidden="true"/><span>{t('Knowledge accumulates. Each task retrieves what it needs.', '知识持续积累，每次任务按需获取。')}</span></div>
  </div>
}
