import '../benchmark.css'
import { BENCHMARK_ENGINE_NAMES, BENCHMARK_RESULTS, formatSeconds, runtimeChangePercent } from '../benchmarkData'
import { pickLocale, type SiteLocale } from '../siteI18n'

export default function BenchmarkHighlights({ locale, headingLevel = 3 }: { locale: SiteLocale; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const copy = pickLocale(locale, {
    document: 'Document speedup',
    image: 'Image speedup',
    baseline: 'vs Ray Data, tuned batch sizes, single node',
    lessTime: 'Elapsed time reduction:',
  }, {
    document: '文档处理加速',
    image: '图像处理加速',
    baseline: '对比 Ray Data，单机调优结果',
    lessTime: '耗时减少',
  })
  const document = BENCHMARK_RESULTS.find(({ id }) => id === 'document')!
  const image = BENCHMARK_RESULTS.find(({ id }) => id === 'image')!
  const highlights = [
    { label: copy.image, engine: BENCHMARK_ENGINE_NAMES.vaneRay, seconds: image.vaneRaySeconds, baseline: image.rayDataSeconds },
    { label: copy.document, engine: BENCHMARK_ENGINE_NAMES.vaneLocal, seconds: document.vaneLocalSeconds, baseline: document.rayDataSeconds },
  ]

  return (
    <div className="benchmark-highlights">
      {highlights.map(({ label, engine, seconds, baseline }) => (
        <div className="benchmark-highlight" key={label}>
          <div className="benchmark-highlight-number">{(baseline / seconds).toFixed(2)}<span>×</span></div>
          <div>
            <Heading>{label}</Heading>
            <p>{engine} · {copy.baseline}</p>
            <p className="benchmark-highlight-detail">
              {formatSeconds(baseline)} → {formatSeconds(seconds)}
              <span>{copy.lessTime} {Math.abs(runtimeChangePercent(seconds, baseline)).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
