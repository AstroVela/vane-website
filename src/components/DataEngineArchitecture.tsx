import {ArrowDownIcon, ArrowRightIcon, CodeIcon, FileTextIcon, ImageIcon, VideoIcon, SpeakerLoudIcon, TableIcon, CubeIcon, Component2Icon, MixerHorizontalIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../siteI18n'

export default function DataEngineArchitecture() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const inputs = [
    {icon: FileTextIcon, title: t('Text & documents', '文本与文档'), type: 'VARCHAR · FILE'},
    {icon: ImageIcon, title: t('Images', '图片'), type: 'IMAGEFILE · IMAGE'},
    {icon: SpeakerLoudIcon, title: t('Audio', '音频'), type: 'AUDIOFILE · TENSOR'},
    {icon: VideoIcon, title: t('Video', '视频'), type: 'VIDEOFILE · IMAGE'},
  ]
  const outputs = [
    {icon: CubeIcon, title: t('Structured fields', '结构化字段'), body: t('Model understanding as a STRUCT.', '模型理解成为 STRUCT 字段。')},
    {icon: Component2Icon, title: t('Embeddings', '向量'), body: t('Typed vectors, ready for search.', '有类型的向量，可继续检索。')},
    {icon: TableIcon, title: t('Queryable results', '可查询结果'), body: t('Filter, join, aggregate and write.', '筛选、关联、聚合与写出。')},
  ]
  return <figure className="data-engine-architecture" aria-label={t('Vane Data architecture', 'Vane Data 架构图')}>
    <div className="engine-inputs">
      <h3>{t('Multimodal inputs', '多模态输入')}</h3>
      <p className="engine-plane-copy">{t('Media and business fields in the same data model.', '媒体与业务字段进入同一数据模型。')}</p>
      <ul className="engine-input-list">{inputs.map(({icon: Icon,title,type}) => <li key={type}><Icon aria-hidden="true"/><div><strong>{title}</strong><code>{type}</code></div></li>)}</ul>
      <div className="engine-source-types"><span>{t('Tables', '数据表')}</span><span>{t('Local files', '本机文件')}</span><span>{t('Object storage', '对象存储')}</span></div>
    </div>
    <div className="engine-plane-arrow" aria-hidden="true"><ArrowRightIcon/><ArrowDownIcon/></div>
    <div className="engine-core">
      <div className="engine-core-heading"><strong>Vane Data</strong><span>{t('One data model. One execution plan.', '统一数据模型，统一执行计划。')}</span></div>
      <div className="engine-definition">
        <div className="engine-module-heading"><h3>{t('Relation pipeline', 'Relation 流水线')}</h3><span className="engine-interface"><CodeIcon aria-hidden="true"/>SQL / Python</span></div>
        <ol className="engine-stage-list">{[t('Read', '读取'),t('Filter', '筛选'),t('Prepare', '预处理'),t('Infer', '推理'),t('Query & write', '查询与写出')].map((name,i) => <li key={name}><span>{name}</span>{i<4&&<ArrowRightIcon aria-hidden="true"/>}</li>)}</ol>
        <div className="engine-functions">
          <div><code>Python UDF</code><p>{t('Custom logic & reusable state', '自定义逻辑与实例状态复用')}</p></div>
          <div><code>AI Functions</code><p><code>ai_prompt · ai_embed</code></p></div>
        </div>
        <div className="engine-providers"><span>{t('Model providers', '模型 Provider')}</span><strong>{t('vLLM · model APIs', 'vLLM · 模型 API')}</strong></div>
      </div>
      <div className="engine-plan-link"><ArrowDownIcon aria-hidden="true"/><span>{t('Logical plan → execution graph', '逻辑计划 → 执行图')}</span></div>
      <div className="engine-runtime">
        <div className="engine-module-heading"><h3>{t('Unified execution', '统一执行')}</h3><span>{t('Local / Ray', '本机 / Ray')}</span></div>
        <div className="engine-runtime-resources"><strong>I/O</strong><span>↔</span><strong>CPU</strong><span>↔</span><strong>GPU</strong></div>
        <div className="engine-runtime-mechanisms"><MixerHorizontalIcon aria-hidden="true"/><p>{t('Dynamic batching · Concurrency · Backpressure', '动态批处理 · 并发 · 背压')}</p></div>
        <p className="engine-runtime-state">{t('State reuse · Retry & recovery', '实例状态复用 · 重试与恢复')}</p>
      </div>
    </div>
    <div className="engine-plane-arrow" aria-hidden="true"><ArrowRightIcon/><ArrowDownIcon/></div>
    <div className="engine-outputs">
      <h3>{t('Typed results', '有类型的结果')}</h3>
      <p className="engine-plane-copy">{t('Understanding remains computable data.', '理解结果，仍然是可计算的数据。')}</p>
      <ul className="engine-output-list">{outputs.map(({icon: Icon,title,body}) => <li key={title}><Icon aria-hidden="true"/><div><strong>{title}</strong><p>{body}</p></div></li>)}</ul>
      <div className="engine-result-return"><strong>{t('Continue with Relation', '继续使用 Relation')}</strong><p>{t('Use the results in the next query or write them to your data store.', '参与下一次查询，或写入目标存储。')}</p></div>
    </div>
  </figure>
}
