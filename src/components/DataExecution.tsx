import type {CSSProperties} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowRightIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../siteI18n'

// Coordinates preserve each batch's read → prepare → infer → write dependency.
const lanes = [
  {en: 'I/O read', zh: 'I/O 读取', blocks: [[0,14],[16,14],[32,14]]},
  {en: 'CPU prepare', zh: 'CPU 预处理', blocks: [[16,15],[33,15],[50,15]]},
  {en: 'GPU infer', zh: 'GPU 推理', blocks: [[33,22],[57,22],[81,22]]},
  {en: 'Write', zh: '结果写出', blocks: [[57,10],[81,10],[105,9]]},
]

export default function DataExecution() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const src = useBaseUrl(`/img/products/data-execution-${locale}.svg`)
  return <div className="data-execution">
    <img className="product-diagram-desktop" src={src} width={1400} height={630} loading="lazy"
      alt={t('Batch timeline: read C, prepare B and infer A overlap. Each batch advances from reading to preprocessing, inference and output. One model instance is reused. Bounded submission makes upstream wait when downstream slows.', '批次时间线：读取 C、预处理 B、推理 A 同时推进；各批次按读取、预处理、推理、写出依次完成。模型实例复用，有界提交使上游在下游变慢时等待。')}/>
    <div className="execution-mobile product-diagram-mobile">
      <div className="execution-mobile-heading"><strong>{t('Batch execution', '批次执行时间线')}</strong><small>{t('Illustration', '机制示意')}</small></div>
      <p>{t('Read C · prepare B · infer A together', '读取 C · 处理 B · 推理 A 同时推进')}</p>
      <div className="execution-timeline">
        {lanes.map(lane => <div className="execution-timeline-row" key={lane.en}><span>{t(lane.en,lane.zh)}</span><div className="execution-track"><i className="execution-overlap" aria-hidden="true"/>{lane.blocks.map(([start,width],i) => <span className={`timeline-batch batch-${i}`} key={i} style={{'--start':`${start/114*100}%`, '--width':`${width/114*100}%`} as CSSProperties}>{'ABC'[i]}</span>)}</div></div>)}
      </div>
      <p className="execution-model-note">{t('Initialize once → reuse the model in the current Actor.', '模型初始化一次 → 在当前 Actor 内复用。')}</p>
      <div className="execution-mobile-queue"><span>{t('Upstream', '上游批次')}</span><ArrowRightIcon aria-hidden="true"/><span>{t('Bounded queue', '有界提交')}</span><ArrowRightIcon aria-hidden="true"/><span>{t('Inference', '推理实例')}</span></div>
      <p className="execution-wait-note">↶ {t('Downstream slows → wait for space.', '下游变慢，上游等待可用空间。')}</p>
    </div>
    <div className="diagram-explanations">{[
      [t('Overlap the stages.', '各阶段同时推进。'), t('Read the next batch, prepare the current one and infer the previous one at the same time.', '读取下一批、准备当前批、推理上一批可以重叠进行，减少资源等待。')],
      [t('Bound the work in flight.', '控制在途数据。'), t('Batch and submission limits keep faster upstream work from overwhelming slower stages.', '批次与提交限制约束中间数据量，下游变慢时，上游等待可用容量。')],
      [t('Reuse expensive state.', '复用昂贵的实例状态。'), t('A stateful UDF keeps its model or client across batches within the same execution instance.', '有状态 UDF 在一次执行的实例内复用模型或客户端，减少重复初始化。')],
    ].map(([title,body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div>
    <p className="marketing-note">{t('Execution illustration; not measured timings. Retries follow the execution path and configured policies; AI Functions offer configurable error handling.', '执行机制示意，不表示实测耗时。重试遵循执行路径与配置策略，AI Function 支持配置错误处理方式。')}</p>
  </div>
}
