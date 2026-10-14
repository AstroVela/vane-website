import {agentUseCases, type UseCaseId} from '../../content/useCases'
import {useSiteLocale} from '../../siteI18n'
import {l} from '../../content/types'

const plans = {
  'meeting-intelligence': [l('Transcripts, speakers, shared content and referenced entities.', '转写、说话人、共享内容与提及的业务对象。'), l('Align people, customers, projects and event times across sources.', '对齐跨来源的人、客户、项目与事件时间。'), l('Look up a historical reference, verify a conflict and return cited background.', '发现历史引用时补查资料，核对冲突，返回带引用的背景。')],
  'customer-support': [l('Extract case facts, shipment evidence and relevant policy clauses.', '提取客户问题、配送证据与相关政策条款。'), l('Connect the customer, order, shipment and current case state.', '关联客户、订单、物流与当前 Case 状态。'), l('Investigate missing facts, compare evidence and hand the case back to the resolution agent.', '调查缺失事实、比较证据，再把资料交给解决问题的 Agent。')],
  'equipment-diagnosis': [l('Locate observations in video, sound, alarms and maintenance records.', '定位视频、声音、报警与维修记录中的观测。'), l('Align equipment identifiers, measurement units and event timelines.', '对齐设备标识、测量单位与事件时间线。'), l('Retrieve discriminating observations and cite their exact source windows.', '寻找可区分故障假设的观测，并引用具体来源窗口。')],
  'personal-work': [l('Extract reusable ideas, style examples and content assets.', '提取可复用观点、风格示例与内容资产。'), l('Organize topics, projects and explicitly supplied preferences.', '组织主题、项目与用户明确提供的偏好。'), l('Retrieve relevant prior work while preserving its context and personal scope.', '检索相关历史作品，保留原始语境与个人范围。')],
  'marketing-campaigns': [l('Identify openings, demonstrations, brand messages and useful clips.', '识别开场、演示动作、品牌表达与可用片段。'), l('Link creative IDs to campaign records and agreed metrics.', '关联素材 ID、投放记录与已约定的指标口径。'), l('Compare creative references, inspect the evidence and honor brand constraints.', '比较创作参考、核验依据并遵循品牌要求。')],
  'commerce-sales': [l('Extract product facts from specifications, images and demonstrations.', '从规格、图片与演示中提取商品事实。'), l('Align product variants, units, preferences, prices and availability.', '对齐商品规格、单位、偏好、价格与可售状态。'), l('Find support for each recommendation and distinguish fresh records from durable facts.', '为推荐寻找依据，区分实时记录与稳定商品事实。')],
} satisfies Record<UseCaseId, ReturnType<typeof l>[]>

export default function UseCaseDeliveryPlan({id}: {id: UseCaseId}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const scenario = agentUseCases.find(item => item.id === id)!, plan = plans[id]
  return <div className="usecase-delivery-plan">{[
    [t('Connect the data', '接入数据'), scenario.sources.map(source => source[locale]).join(', ')],
    [t('Tailor the parsing', '定制解析'), plan[0][locale]],
    [t('Define business meaning', '组织业务语义'), plan[1][locale]],
    [t('Equip the agent with a Skill', '交付 Agent Skill'), plan[2][locale]],
  ].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div>
}
