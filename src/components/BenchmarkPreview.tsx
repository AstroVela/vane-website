import type {CSSProperties} from 'react'
import {BENCHMARK_ENVIRONMENT, BENCHMARK_RESULTS, benchmarkEngines, formatSeconds, runtimeChangePercent, type BenchmarkElapsedResult} from '../benchmarkData'
import BenchmarkHighlights from './BenchmarkHighlights'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function BenchmarkPreview({compact = false, results = BENCHMARK_RESULTS, showHighlights = true}: {
  compact?: boolean
  results?: readonly BenchmarkElapsedResult[]
  showHighlights?: boolean
}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const names = {document: t('Documents', '文档'), image: t('Images', '图片'), audio: t('Audio', '音频'), video: t('Video', '视频')}
  const descriptions = {
    document: t('Document extraction and processing.', '文档内容提取与处理。'),
    image: t('Image processing pipeline.', '图像处理流水线。'),
    audio: t('Audio processing pipeline.', '音频处理流水线。'),
    video: t('Video processing pipeline.', '视频处理流水线。'),
  }
  const comparison = (seconds: number, baseline: number) => {
    const change = runtimeChangePercent(seconds, baseline)
    return `${Math.abs(change).toFixed(1)}% ${change < 0 ? t('less time than Ray Data', '相比 Ray Data 耗时降低') : t('more time than Ray Data', '相比 Ray Data 耗时增加')}`
  }
  return <div className={'benchmark-preview' + (compact ? ' compact' : '')}>
    {showHighlights && <BenchmarkHighlights locale={locale}/>}
    <div className="benchmark-legend"><span className="vane-local">Vane Local</span><span className="vane-ray">Vane Ray</span><span className="ray">Ray Data</span><span className="daft">Daft</span><small>{t('Elapsed time in seconds. Lower is better.', '执行耗时（秒），越低越好。')}</small></div>
    <p className="benchmark-scale-note">{t('Each workload uses its own linear scale starting at zero.', '各工作负载独立采用从零开始的线性尺度。')}</p>
    <div className="benchmark-plots">{results.map(result => {
      const engines = benchmarkEngines(result)
      const max = Math.max(...engines.map(engine => engine.seconds ?? 0))
      return <article className="benchmark-plot" key={result.id}>
        <h3>{names[result.id]}</h3>
        <div className="benchmark-bars">{engines.map(engine => <div key={engine.id} className={'benchmark-bar-row ' + engine.id}>
          <span>{engine.label}</span><div className="benchmark-bar-space" aria-hidden="true">{engine.seconds !== null && <i style={{'--bar-size': `${engine.seconds / max * 100}%`} as CSSProperties}/>}</div><strong>{engine.seconds !== null ? formatSeconds(engine.seconds) : <abbr title={t('Out of memory in the previous run', '历史测试中内存不足')}>OOM</abbr>}</strong>
        </div>)}</div>
        <p className="benchmark-comparison"><span>Vane Local: {comparison(result.vaneLocalSeconds, result.rayDataSeconds)}</span><span>Vane Ray: {comparison(result.vaneRaySeconds, result.rayDataSeconds)}</span></p>
        {!compact && <details><summary>{t('Workload and configuration', '工作负载与配置')}</summary><p>{descriptions[result.id]}</p><p>{t('Both Vane modes and Ray Data were retested on this single node. See the full results for default and tuned batch-size configurations.', '两种 Vane 模式与 Ray Data 均在该单机环境重测。默认与调优 batch size 的结果见完整测试页。')}</p><Link to="/benchmarks">{t('Workload definitions and scripts', '工作负载定义与脚本')} →</Link></details>}
      </article>
    })}</div>
    <p className="marketing-note">{BENCHMARK_ENVIRONMENT.cpuCores} CPU / {BENCHMARK_ENVIRONMENT.memoryGb} GB RAM / {BENCHMARK_ENVIRONMENT.gpu}, {BENCHMARK_ENVIRONMENT.gpuMemoryGb} GB {t('modified VRAM. Single node.', '改装显存。单机测试。')} Ray {BENCHMARK_ENVIRONMENT.rayVersion}.{showHighlights && t(' Tuned batch sizes.', ' batch size 调优结果。')}</p>
  </div>
}
