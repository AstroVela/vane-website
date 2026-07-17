import Head from '@docusaurus/Head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import Cta from '../components/Cta'
import BenchmarkScopeNote from '../components/BenchmarkScopeNote'
import {
  BENCHMARK_ENGINE_NAMES,
  BENCHMARK_ENVIRONMENT,
  BENCHMARK_RESULTS,
  DEFAULT_BATCH_BENCHMARK_RESULTS,
  type BenchmarkBatchSize,
  formatBatchSize,
  formatSeconds,
  runtimeChangePercent,
} from '../benchmarkData'
import { pickLocale, useSiteLocale } from '../siteI18n'
import { BENCHMARK_WORKFLOW_URL } from '../siteLinks'

const TUNED_CHART_MIN_SECONDS = 50
const TUNED_CHART_TICKS = [50, 300, 1000, 3000, 10000] as const
const DEFAULT_CHART_MIN_SECONDS = 100
const DEFAULT_CHART_TICKS = [100, 300, 1000, 3000, 10000] as const
const CHART_MAX_SECONDS = 10000

function Divider() {
  return <div className="wrap"><div className="ddiv" /></div>
}

function chartBarHeight(seconds: number, minSeconds: number) {
  const min = Math.log10(minSeconds)
  const range = Math.log10(CHART_MAX_SECONDS) - min
  return Math.max(0, Math.min(100, ((Math.log10(seconds) - min) / range) * 100))
}

function chartValueLabel(seconds: number) {
  if (seconds >= 1000) return `${(seconds / 1000).toFixed(2)}k`
  return Number.isInteger(seconds) ? `${seconds}` : seconds.toFixed(2)
}

function comparisonLabel(changePercent: number, lower: string, higher: string) {
  return `${Math.abs(changePercent).toFixed(1)}% ${changePercent < 0 ? lower : higher}`
}

type TunedRuntimeProps = {
  seconds: number | null
  batchSize: BenchmarkBatchSize
  batchSizeLabel: string
  notSet: string
  oom: string
}

function TunedRuntime({ seconds, batchSize, batchSizeLabel, notSet, oom }: TunedRuntimeProps) {
  if (seconds === null) return <span className="tagx oom">{oom}</span>

  return (
    <span className="benchmark-runtime">
      <strong>{formatSeconds(seconds)}</strong>
      {batchSize !== null && (
        <small>{batchSizeLabel}: {batchSize === 'not-set' ? notSet : batchSize}</small>
      )}
    </span>
  )
}

export default function Benchmarks() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      title: 'Single-node multimodal pipeline benchmarks — Vane Data',
      description: 'Observed end-to-end wall-clock results for document, image, audio, and video workloads on one 36-core single-node environment.',
      eyebrow: 'Benchmarks',
      heading: 'Single-node multimodal pipeline benchmarks',
      leadPrefix: 'The benchmark workflow is',
      leadSeparator: ' ',
      leadLink: 'here',
      leadSuffix: '.',
      environment: 'Test environment',
      singleNode: 'single node',
      cpuCores: 'CPU cores',
      memory: 'RAM',
      gpuMemory: 'GPU memory',
      modifiedVram: 'modified VRAM',
      summary: 'Primary result',
      summaryTitle: 'Tuned batch-size results',
      table: {
        workload: 'Workload',
        versusRay: 'vs Ray Data',
        versusDaft: 'vs Daft',
      },
      batchSize: 'Batch size',
      notSet: 'Not set',
      lowerChange: 'lower',
      higherChange: 'higher',
      oom: 'OOM',
      workloads: {
        document: 'Document',
        image: 'Image',
        audio: 'Audio',
        video: 'Video',
      },
      tunedLogScale: 'Tuned batch sizes · log scale · lower is better',
      tunedChartAria: 'Grouped tuned elapsed-time bars for Vane Data, Ray Data, and Daft across four workloads',
      defaultEyebrow: 'Reference',
      defaultTitle: 'Default batch-size results',
      defaultLead: 'Results from the same recorded single-node environment before per-engine batch-size tuning.',
      elapsedTime: 'Elapsed time (seconds)',
      defaultLogScale: 'Default batch size · log scale · lower is better',
      engineLegend: 'Engines',
      chartAria: 'Grouped default batch-size elapsed-time bars for Vane Data, Ray Data, and Daft across four workloads',
      readDocs: 'Read the Docs',
      explore: 'Explore use cases',
    },
    {
      title: '单机多模态流水线基准测试 — Vane Data',
      description: '在一台 36 核单机环境中，对文档、图像、音频和视频 workload 进行端到端 wall-clock 耗时对比。',
      eyebrow: '基准测试',
      heading: '单机多模态流水线基准测试',
      leadPrefix: 'Benchmark 测试流程见',
      leadSeparator: '',
      leadLink: '这里',
      leadSuffix: '。',
      environment: '测试环境',
      singleNode: '单机',
      cpuCores: '个 CPU 核心',
      memory: '内存',
      gpuMemory: '显存',
      modifiedVram: '显存改装版',
      summary: '主要结果',
      summaryTitle: 'batch size 调优结果',
      table: {
        workload: '工作负载',
        versusRay: '对比 Ray Data',
        versusDaft: '对比 Daft',
      },
      batchSize: 'Batch size',
      notSet: '未设置',
      lowerChange: '更低',
      higherChange: '更高',
      oom: 'OOM',
      workloads: {
        document: '文档',
        image: '图像',
        audio: '音频',
        video: '视频',
      },
      tunedLogScale: 'batch size 调优后 · 对数尺度 · 越低越好',
      tunedChartAria: 'Vane Data、Ray Data 和 Daft 在四类 workload 中调优 batch size 后的分组耗时柱状图',
      defaultEyebrow: '参考结果',
      defaultTitle: '默认 batch size 结果',
      defaultLead: '同一台已记录单机环境中，未按引擎调整 batch size 时的结果。',
      elapsedTime: '端到端耗时（秒）',
      defaultLogScale: '默认 batch size · 对数尺度 · 越低越好',
      engineLegend: '引擎',
      chartAria: 'Vane Data、Ray Data 和 Daft 在四类 workload 中使用默认 batch size 的分组耗时柱状图',
      readDocs: '阅读文档',
      explore: '浏览用例',
    },
  )
  return (
    <>
      <Head>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
      </Head>

      <Nav />

      <section className="intro benchmark-intro">
        <div className="wrap">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 className="h1">{copy.heading}</h1>
          <p className="lead">
            {copy.leadPrefix}{copy.leadSeparator}
            <a className="benchmark-workflow-link" href={BENCHMARK_WORKFLOW_URL} target="_blank" rel="noreferrer">{copy.leadLink}</a>
            {copy.leadSuffix}
          </p>
        </div>
      </section>

      <Divider />

      <section className="bm-sec">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.summary}</Eyebrow>
            <h2 className="h2">{copy.summaryTitle}</h2>
          </div>
          <p className="benchmark-environment">
            <strong>{copy.environment}:</strong>{' '}
            {copy.singleNode} · {BENCHMARK_ENVIRONMENT.cpuCores} {copy.cpuCores} ·{' '}
            {BENCHMARK_ENVIRONMENT.memoryGb} GB {copy.memory} · {BENCHMARK_ENVIRONMENT.gpu}
            {BENCHMARK_ENVIRONMENT.gpuMemoryModified ? ` (${copy.modifiedVram})` : ''} ·{' '}
            {BENCHMARK_ENVIRONMENT.gpuMemoryGb} GB {copy.gpuMemory}
          </p>
          <Box flat className="home-benchmark-chart benchmark-tuned-chart">
            <div className="azt">{copy.elapsedTime}</div>
            <div className="home-chart-meta">
              <span>{copy.tunedLogScale}</span>
              <div className="home-chart-legend" aria-label={copy.engineLegend}>
                <span><i className="vane" />{BENCHMARK_ENGINE_NAMES.vaneData}</span>
                <span><i className="ray" />{BENCHMARK_ENGINE_NAMES.rayData}</span>
                <span><i className="daft" />{BENCHMARK_ENGINE_NAMES.daft}</span>
              </div>
            </div>
            <div className="home-chart-plot" aria-label={copy.tunedChartAria}>
              <div className="home-chart-axis" aria-hidden="true">
                {TUNED_CHART_TICKS.map((seconds) => (
                  <span style={{ bottom: `${chartBarHeight(seconds, TUNED_CHART_MIN_SECONDS)}%` }} key={seconds}>
                    {seconds >= 1000 ? `${seconds / 1000}k` : seconds}
                  </span>
                ))}
              </div>
              <div className="home-chart-area">
                <div className="home-chart-grid" aria-hidden="true">
                  {TUNED_CHART_TICKS.map((seconds) => (
                    <i style={{ bottom: `${chartBarHeight(seconds, TUNED_CHART_MIN_SECONDS)}%` }} key={seconds} />
                  ))}
                </div>
                <div className="home-chart-groups">
                  {BENCHMARK_RESULTS.map((result) => {
                    const engines = [
                      { id: 'vane', label: BENCHMARK_ENGINE_NAMES.vaneData, seconds: result.vaneSeconds, batchSize: result.batchSizes.vaneData },
                      { id: 'ray', label: BENCHMARK_ENGINE_NAMES.rayData, seconds: result.rayDataSeconds, batchSize: result.batchSizes.rayData },
                      { id: 'daft', label: BENCHMARK_ENGINE_NAMES.daft, seconds: result.daftSeconds, batchSize: result.batchSizes.daft },
                    ]
                    return (
                      <div className="home-chart-group" key={result.id}>
                        <div className="home-chart-bars">
                          {engines.map((engine) => {
                            const description = [
                              engine.label,
                              copy.workloads[result.id],
                              engine.seconds === null ? copy.oom : formatSeconds(engine.seconds),
                              formatBatchSize(engine.batchSize),
                            ].filter(Boolean).join(' · ')
                            const height = engine.seconds === null ? 0 : chartBarHeight(engine.seconds, TUNED_CHART_MIN_SECONDS)
                            return (
                              <span className="home-chart-slot" key={engine.id}>
                                {engine.seconds === null ? (
                                  <span className="home-chart-oom" role="img" aria-label={description} title={description}>{copy.oom}</span>
                                ) : (
                                  <>
                                    <span className="home-chart-value" style={{ bottom: `calc(${height}% + 5px)` }}>
                                      {chartValueLabel(engine.seconds)}
                                    </span>
                                    <span
                                      className={`home-chart-bar ${engine.id}`}
                                      style={{ height: `${height}%` }}
                                      role="img"
                                      aria-label={description}
                                      title={description}
                                    />
                                  </>
                                )}
                              </span>
                            )
                          })}
                        </div>
                        <span className="home-chart-workload">{copy.workloads[result.id]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <BenchmarkScopeNote locale={locale} />
          </Box>
          <Box flat className="benchmark-table-wrap">
            <table className="summary benchmark-summary">
              <thead>
                <tr>
                  <th>{copy.table.workload}</th>
                  <th>{BENCHMARK_ENGINE_NAMES.vaneData}</th>
                  <th>{BENCHMARK_ENGINE_NAMES.rayData}</th>
                  <th>{BENCHMARK_ENGINE_NAMES.daft}</th>
                  <th>{copy.table.versusRay}</th>
                  <th>{copy.table.versusDaft}</th>
                </tr>
              </thead>
              <tbody>
                {BENCHMARK_RESULTS.map((result) => {
                  const rayChange = runtimeChangePercent(result.vaneSeconds, result.rayDataSeconds)
                  const daftChange = result.daftSeconds === null
                    ? null
                    : runtimeChangePercent(result.vaneSeconds, result.daftSeconds)
                  return (
                    <tr key={result.id}>
                      <td>{copy.workloads[result.id]}</td>
                      <td>
                        <TunedRuntime
                          seconds={result.vaneSeconds}
                          batchSize={result.batchSizes.vaneData}
                          batchSizeLabel={copy.batchSize}
                          notSet={copy.notSet}
                          oom={copy.oom}
                        />
                      </td>
                      <td>
                        <TunedRuntime
                          seconds={result.rayDataSeconds}
                          batchSize={result.batchSizes.rayData}
                          batchSizeLabel={copy.batchSize}
                          notSet={copy.notSet}
                          oom={copy.oom}
                        />
                      </td>
                      <td>
                        <TunedRuntime
                          seconds={result.daftSeconds}
                          batchSize={result.batchSizes.daft}
                          batchSizeLabel={copy.batchSize}
                          notSet={copy.notSet}
                          oom={copy.oom}
                        />
                      </td>
                      <td className={rayChange <= 0 ? 'runtime-change better' : 'runtime-change regression'}>
                        {comparisonLabel(rayChange, copy.lowerChange, copy.higherChange)}
                      </td>
                      <td className={daftChange === null ? 'runtime-change' : daftChange <= 0 ? 'runtime-change better' : 'runtime-change regression'}>
                        {daftChange === null
                          ? <span className="tagx oom">{copy.oom}</span>
                          : comparisonLabel(daftChange, copy.lowerChange, copy.higherChange)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Box>
        </div>
      </section>

      <Divider />
      <section className="bm-sec" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.defaultEyebrow}</Eyebrow>
            <h2 className="h2">{copy.defaultTitle}</h2>
            <p className="lead">{copy.defaultLead}</p>
          </div>
          <Box flat className="home-benchmark-chart benchmark-default-chart">
            <div className="azt">{copy.elapsedTime}</div>
            <div className="home-chart-meta">
              <span>{copy.defaultLogScale}</span>
              <div className="home-chart-legend" aria-label={copy.engineLegend}>
                <span><i className="vane" />{BENCHMARK_ENGINE_NAMES.vaneData}</span>
                <span><i className="ray" />{BENCHMARK_ENGINE_NAMES.rayData}</span>
                <span><i className="daft" />{BENCHMARK_ENGINE_NAMES.daft}</span>
              </div>
            </div>
            <div className="home-chart-plot" aria-label={copy.chartAria}>
              <div className="home-chart-axis" aria-hidden="true">
                {DEFAULT_CHART_TICKS.map((seconds) => (
                  <span style={{ bottom: `${chartBarHeight(seconds, DEFAULT_CHART_MIN_SECONDS)}%` }} key={seconds}>
                    {seconds >= 1000 ? `${seconds / 1000}k` : seconds}
                  </span>
                ))}
              </div>
              <div className="home-chart-area">
                <div className="home-chart-grid" aria-hidden="true">
                  {DEFAULT_CHART_TICKS.map((seconds) => (
                    <i style={{ bottom: `${chartBarHeight(seconds, DEFAULT_CHART_MIN_SECONDS)}%` }} key={seconds} />
                  ))}
                </div>
                <div className="home-chart-groups">
                  {DEFAULT_BATCH_BENCHMARK_RESULTS.map((result) => {
                    const engines = [
                      { id: 'vane', label: BENCHMARK_ENGINE_NAMES.vaneData, seconds: result.vaneSeconds },
                      { id: 'ray', label: BENCHMARK_ENGINE_NAMES.rayData, seconds: result.rayDataSeconds },
                      { id: 'daft', label: BENCHMARK_ENGINE_NAMES.daft, seconds: result.daftSeconds },
                    ]
                    return (
                      <div className="home-chart-group" key={result.id}>
                        <div className="home-chart-bars">
                          {engines.map((engine) => {
                            const description = [
                              engine.label,
                              copy.workloads[result.id],
                              engine.seconds === null ? copy.oom : formatSeconds(engine.seconds),
                            ].join(' · ')
                            const height = engine.seconds === null ? 0 : chartBarHeight(engine.seconds, DEFAULT_CHART_MIN_SECONDS)
                            return (
                              <span className="home-chart-slot" key={engine.id}>
                                {engine.seconds === null ? (
                                  <span className="home-chart-oom" role="img" aria-label={description} title={description}>{copy.oom}</span>
                                ) : (
                                  <>
                                    <span className="home-chart-value" style={{ bottom: `calc(${height}% + 5px)` }}>
                                      {chartValueLabel(engine.seconds)}
                                    </span>
                                    <span
                                      className={`home-chart-bar ${engine.id}`}
                                      style={{ height: `${height}%` }}
                                      role="img"
                                      aria-label={description}
                                      title={description}
                                    />
                                  </>
                                )}
                              </span>
                            )
                          })}
                        </div>
                        <span className="home-chart-workload">{copy.workloads[result.id]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <BenchmarkScopeNote locale={locale} />
          </Box>
        </div>
      </section>

      <Divider />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>{copy.readDocs}</Button>
            <Button to="/solutions">{copy.explore}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
