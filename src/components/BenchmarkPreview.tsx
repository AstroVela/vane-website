import type {CSSProperties} from 'react'
import {BENCHMARK_ENVIRONMENT, BENCHMARK_RESULTS, formatSeconds, runtimeChangePercent} from '../benchmarkData'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function BenchmarkPreview({compact = false}: {compact?: boolean}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const names = {document: t('Documents', '文档'), image: t('Images', '图片'), audio: t('Audio', '音频'), video: t('Video', '视频')}
  const descriptions = {
    document: t('Document extraction and processing.', '文档内容提取与处理。'),
    image: t('Image processing pipeline.', '图像处理流水线。'),
    audio: t('Audio processing pipeline.', '音频处理流水线。'),
    video: t('Video processing pipeline.', '视频处理流水线。'),
  }
  return <div className={'benchmark-preview' + (compact ? ' compact' : '')}>
    <div className="benchmark-legend"><span>Vane Data</span><span>Ray Data</span><span>Daft</span><small>{t('Elapsed time in seconds. Lower is better.', '执行耗时（秒），越低越好')}</small></div>
    <div className="benchmark-plots">{BENCHMARK_RESULTS.map(result => {
      const max = Math.max(result.vaneSeconds, result.rayDataSeconds, result.daftSeconds ?? 0)
      const change = runtimeChangePercent(result.vaneSeconds, result.rayDataSeconds)
      return <article className="benchmark-plot" key={result.id}>
        <h3>{names[result.id]}<span>{Math.abs(change).toFixed(1)}% {change < 0 ? t('less time than Ray Data', '相比 Ray Data 耗时降低') : t('more time than Ray Data', '相比 Ray Data 耗时增加')}</span></h3>
        <div className="benchmark-bars">{[['vane', 'Vane Data', result.vaneSeconds], ['ray', 'Ray Data', result.rayDataSeconds], ['daft', 'Daft', result.daftSeconds]].map(([key, name, value]) => <div key={key} className={'benchmark-bar-row ' + key}>
          <span>{name}</span><div className="benchmark-bar-space">{typeof value === 'number' && <i style={{'--bar-size': `${value / max * 100}%`} as CSSProperties}/>}</div><strong>{typeof value === 'number' ? formatSeconds(value) : 'OOM'}</strong>
        </div>)}</div>
        {!compact && <details><summary>{t('Workload and configuration', '工作负载与配置')}</summary><p>{descriptions[result.id]}</p><p>{t('Batch sizes', '批次大小')}：Vane {result.batchSizes.vaneData}, Ray {result.batchSizes.rayData}, Daft {result.batchSizes.daft === null ? 'OOM' : result.batchSizes.daft === 'not-set' ? t('not set', '未设置') : result.batchSizes.daft}.</p><Link to="/benchmarks">{t('Workload definitions and scripts', '工作负载定义与脚本')} →</Link></details>}
      </article>
    })}</div>
    <p className="marketing-note">{BENCHMARK_ENVIRONMENT.cpuCores} CPU / {BENCHMARK_ENVIRONMENT.memoryGb} GB RAM / {BENCHMARK_ENVIRONMENT.gpu}, {BENCHMARK_ENVIRONMENT.gpuMemoryGb} GB {t('modified VRAM. Single-node, batch-size-tuned results.', '改装显存。单机、批大小调优结果。')}</p>
  </div>
}
