import {useSiteLocale} from '../siteI18n'

export default function ProductManagement() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const topics = [
    [t('Verify every conclusion.', '对照依据，核验理解。'),
      t('Open the original image, document page or media time window behind a result. Compare the source with the interpretation, and distinguish observed facts from inferred conclusions.', '从结果打开对应的原图、文档页或音视频时间窗口，对照原始资料核验理解，区分资料中的事实与模型推断。')],
    [t('Shape how your data is understood.', '调整定义，管理知识。'),
      t('Choose processing channels and models. Review business models, relationships and metric definitions before publication, and manage the knowledge your agents can use.', '选择处理通道与模型，审阅业务模型、关联关系与指标口径，再发布供 Agent 使用的知识。')],
    [t('Know what needs attention.', '看清进展，定位问题。'),
      t('Follow processing and context tasks. Locate the affected file, failed step and reported cause, then retry the work that needs attention.', '查看资料处理和上下文任务的进展，定位受影响的文件、失败步骤与原因，针对需要处理的工作重试。')],
    [t('See where model usage goes.', '查看用量，识别成本来源。'),
      t('Inspect reported tokens and estimated costs by model, task and processing stage. See reuse and compression records, with missing usage or pricing clearly identified.', '按模型、任务和处理阶段查看已报告 Token 与估算成本，了解复用和压缩记录。用量缺失或价格未知时，明确显示。')],
  ]
  return <div className="product-management">{topics.map(([title,body]) => <div className="management-topic" key={title}><h3>{title}</h3><p>{body}</p></div>)}</div>
}
