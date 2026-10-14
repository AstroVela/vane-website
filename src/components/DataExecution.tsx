import {useId, useState} from 'react'
import {CheckIcon, ReloadIcon} from '@radix-ui/react-icons'
import FeatureTabs from './FeatureTabs'
import {useSiteLocale} from '../siteI18n'

export default function DataExecution() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh, id = useId()
  const [mode, setMode] = useState('parallel')
  const options = [{id: 'parallel', label: t('Overlapped resources', '资源并行')}, {id: 'backpressure', label: t('Batching & backpressure', '批处理与背压')}, {id: 'state', label: t('Instance reuse', '实例复用')}, {id: 'retry', label: t('Error handling', '错误处理')}]
  const copy = {
    parallel: [t('Keep I/O, CPU and GPU working together.', '让 I/O、CPU 与 GPU 同时工作。'), t('Read the next batch while preparing the current batch and running inference on the previous one.', '读取下一批数据的同时，准备当前批次，并对上一批进行推理。')],
    backpressure: [t('Bound the work waiting downstream.', '限制等待下游的在途数据。'), t('When inference slows, bounded queues reduce upstream submissions and accumulated intermediate data.', '推理变慢时，有界队列减少上游提交与中间数据积压。')],
    state: [t('Initialize once per instance.', '每个实例初始化一次。'), t('Reuse models, clients and decoders across batches instead of repeatedly loading them.', '在批次间复用模型、客户端和解码器，减少重复加载。')],
    retry: [t('Make failures visible and actionable.', '让失败可定位、可处理。'), t('Apply configured retry and error policies. Preserve the boundary of work that can safely be replayed.', '按配置应用重试与错误策略，保留可安全重放的处理范围。')],
  }[mode]!
  return <div className="data-execution" data-mechanism={mode}>
    <FeatureTabs options={options} value={mode} onChange={setMode} label={t('Execution mechanisms', '执行机制')} panelId={id}/>
    <div className="execution-mechanism" role="tabpanel" id={id} aria-labelledby={`${id}-${mode}`}>
      <div className="execution-lanes" aria-label={t('Illustration of batch execution', '批次执行示意')}>
        <div className="execution-model">{mode === 'state' ? <CheckIcon aria-hidden="true"/> : <ReloadIcon aria-hidden="true"/>}<span>{mode === 'state' ? t('Model ready, reused across batches', '模型已就绪，在批次间复用') : mode === 'retry' ? t('Retry the failed unit according to policy', '按策略重试失败单元') : mode === 'backpressure' ? t('Downstream slowdown, bounded queue', '下游变慢，队列有界') : t('Overlapped execution', '重叠执行')}</span></div>
        {['I/O', 'CPU', 'GPU'].map((resource, i) => <div className="execution-lane" key={resource}><strong>{resource}</strong><div className="execution-batches">{[0, 1, 2, 3].map(batch => <span key={batch} className={'execution-batch' + (mode === 'parallel' && batch === i ? ' executing' : '') + (mode === 'backpressure' && i === 0 && batch > 1 ? ' held' : '') + (mode === 'retry' && i === 2 && batch === 1 ? ' retrying' : '')}>{t('Batch', '批次')} {batch + 1}{mode === 'retry' && i === 2 && batch === 1 ? ' ↻' : ''}</span>)}</div></div>)}
      </div><div className="execution-description"><h3>{copy[0]}</h3><p>{copy[1]}</p><span className="marketing-note">{t('Mechanism illustration, not measured throughput.', '执行机制示意，不表示实测吞吐。')}</span></div>
    </div>
  </div>
}
