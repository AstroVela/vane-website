import {useState} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowRightIcon, CheckIcon} from '@radix-ui/react-icons'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {insightFor} from '../content/showcases'

/** A curated explanation of processing and reuse, not a live service request. */
export default function ContextReuseStory() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [reused, setReused] = useState(false)
  const clip = useBaseUrl('/showcase/marketing/comp_001-blending.a20b043d09b6.webp')
  const insight = insightFor('blending')
  return <div className="reuse-story">
    <div className="reuse-controls"><div className="marketing-tabs" role="group" aria-label={t('Knowledge reuse example', '知识复用示例')}>
      <button type="button" aria-pressed={!reused} onClick={() => setReused(false)}>{t('First task', '首次任务')}</button>
      <button type="button" aria-pressed={reused} onClick={() => setReused(true)}>{t('A later task', '后续任务')}</button>
    </div><span>{t('Illustrated workflow', '工作方式示意')}</span></div>
    <div className="reuse-content" aria-live="polite">
      <div className="reuse-request"><span className="value-label">{t('What the agent needs', 'Agent 需要的资料')}</span>
        <h3>{reused ? t('Does this footage show the blender being used outdoors?', '这份素材里有户外搅拌的操作画面吗？') : t('Find an operating shot for an outdoor drink video.', '为户外饮品视频找一个操作镜头。')}</h3>
        <ol className="reuse-actions">{(reused ? [
          [t('Find published knowledge', '检索已发布知识'), t('The earlier observation matches this question.', '已有的动作与场景理解可以回答这次问题。')],
          [t('Check that it still applies', '检查知识仍然适用'), t('Reuse requires access to the source and a valid source version.', '核验来源权限和版本，确认已有知识仍然有效。')],
          [t('Return the relevant finding', '交付所需信息'), t('Use the existing observation and its reference. New questions can trigger further analysis.', '复用已有理解与引用；遇到新的问题，再补充分析。')],
        ] : [
          [t('Find the relevant moment', '定位相关片段'), t('Start with the available index and source information.', '先从已有索引与资料中找到候选片段。')],
          [t('Understand what is needed', '补充当前需要的理解'), t('Inspect the selected footage for the action and setting.', '针对选中的画面，核对操作动作与使用场景。')],
          [t('Keep reusable source knowledge', '沉淀可共享的来源知识'), t('Validated observations can be published with their source references.', '经校验的来源理解连同引用发布，供后续任务检索。')],
        ]).map(([title, body]) => <li key={title}><CheckIcon aria-hidden="true" /><div><strong>{title}</strong><p>{body}</p></div></li>)}</ol>
      </div>
      <div className="reuse-result"><div className="reuse-source"><img src={clip} width={480} height={854} loading="lazy" alt={t('Original footage of the blender running on the outdoor table.', '原视频中在户外桌面上启动搅拌机的画面。')} /><div><span className="value-label">{reused ? t('Reused source knowledge', '复用的来源知识') : t('Understanding to keep', '可以沉淀的理解')}</span><h3>{insight.title[locale]}</h3><p>{insight.explanation[locale]}</p><Link className="evidence-link" to="/solutions/video-research?media=video&insight=blending">00:05–00:07 <ArrowRightIcon aria-hidden="true" /></Link></div></div>
        <div className="reuse-handoff"><strong>{t('The agent receives', '交给 Agent')}</strong><p>{t('A relevant observation and a reference to the original clip. Read more only when the task needs it.', '与当前任务相关的理解，以及原始片段引用。需要更多细节时，再按引用续读。')}</p></div>
      </div>
    </div>
    <p className="marketing-note reuse-note">{t('Reuse depends on the task, source version and access. Shared source knowledge and private task context stay separate.', '是否复用取决于任务需求、来源版本和权限。共享来源知识与任务私有信息分别保留。')}</p>
  </div>
}
