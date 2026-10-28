import EvidenceGallery from './EvidenceGallery'
import {useSiteLocale} from '../siteI18n'
import type {MediaKind} from '../content/types'

export default function MarketingDeliverable({onInspect}: {onInspect?: (kind: MediaKind, insight: string) => void}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <div className="marketing-deliverable">
    <div className="delivery-request"><strong>{t('Example task', '示例任务')}</strong><p>{t('Prepare material for a drink-making video: an operating shot, visual details and useful spoken references.', '为饮品制作视频准备资料：可借鉴的操作镜头、画面细节，以及可参考的口头表达。')}</p></div>
    <EvidenceGallery onInspect={onInspect} />
    <div className="delivery-summary"><div><h3>{t('Ready to inform the next draft', '带着资料，继续创作')}</h3><p>{t('The agent can reference a specific action, inspect ingredients and quote the narrator, with a source for each.', 'Agent 可以引用具体操作、核对画面食材、参考旁白表达，每项资料都保留来源。')}</p></div><div><h3>{t('Keep product claims grounded', '明确资料能证明什么')}</h3><p>{t('Footage supports what is visible. Narration records what was said. Product performance, safety and campaign conversion need separate evidence.', '画面说明看到了什么，旁白记录说过什么。产品性能、安全性和投放转化仍需相应资料核实。')}</p></div></div>
  </div>
}
