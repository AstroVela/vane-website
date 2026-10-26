import {useSiteLocale} from '../siteI18n'

export default function ProductManagement() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const topics = [
    [t('Verify results against the source', '核验分析结果'),
      t('Open the original image, document page or media time window behind a result. Compare the source with the interpretation, and distinguish observed facts from inferred conclusions.', '从结果打开对应的原图、文档页或音视频时间窗口，对照原始资料核验理解，区分资料中的事实与模型推断。')],
    [t('Manage processing and semantic definitions', '管理解析与语义定义'),
      t('Choose processing channels and models. Review business models, relationships and metric definitions before publication, and manage the knowledge your agents can use.', '选择处理通道与模型，审阅业务模型、关联关系与指标口径，再发布供 Agent 使用的知识。')],
    [t('Track tasks and troubleshoot issues', '跟踪任务，排查问题'),
      t('Follow processing and context tasks. Locate the affected file, failed step and reported cause, then retry the work that needs attention.', '查看资料处理和上下文任务的进展，定位受影响的文件、失败步骤与原因，针对需要处理的工作重试。')],
    [t('Monitor usage and costs', '监控用量与成本'),
      t('Review token usage, estimated costs, reuse and compression by model, task and processing stage. Missing usage or pricing is clearly labeled.', '按模型、任务与处理阶段查看 Token 用量、估算成本及复用和压缩记录。未返回用量或未配置价格的项目会明确标注。')],
  ]
  return <div className="product-management">{topics.map(([title,body]) => <div className="management-topic" key={title}><h3>{title}</h3><p>{body}</p></div>)}</div>
}
