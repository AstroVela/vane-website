import { useState } from 'react'
import MarketingLayout from '../components/MarketingLayout'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import Cta from '../components/Cta'
import BenchmarkScopeNote from '../components/BenchmarkScopeNote'
import BenchmarkPreview from '../components/BenchmarkPreview'
import BenchmarkHighlights from '../components/BenchmarkHighlights'
import {
  BENCHMARK_ENGINE_NAMES,
  BENCHMARK_ENVIRONMENT,
  BENCHMARK_RESULTS,
  DEFAULT_BATCH_BENCHMARK_RESULTS,
  benchmarkEngines,
  formatSeconds,
  runtimeChangePercent,
} from '../benchmarkData'
import { pickLocale, useSiteLocale } from '../siteI18n'
import { BENCHMARK_WORKFLOW_URL } from '../siteLinks'

export default function Benchmarks() {
  const locale = useSiteLocale()
  const [batchMode, setBatchMode] = useState<'tuned' | 'default'>('tuned')
  const copy = pickLocale(locale, {
    title: 'Vane Data benchmarks',
    description: 'Compare Vane Local, Vane Ray, and Ray Data 2.58.0 on document, image, audio, and video pipelines, with default and tuned batch sizes.',
    eyebrow: 'Benchmarks',
    heading: 'Faster multimodal data processing.',
    lead: 'Compare both Vane execution modes across four single-node workloads, with default and tuned batch sizes.',
    environment: 'Test environment',
    singleNode: 'Single node',
    cpuCores: 'CPU cores',
    memory: 'RAM',
    gpuMemory: 'GPU memory',
    modifiedVram: 'modified VRAM',
    results: 'Compare the results',
    batchMode: 'Batch-size configuration',
    tuned: 'Tuned batch sizes',
    default: 'Default batch sizes',
    tunedTitle: 'Tuned batch-size results',
    defaultTitle: 'Default batch-size results',
    tunedLead: 'Each engine uses tuned batch sizes. The highlights above use this configuration.',
    defaultLead: 'Each engine uses its default batch size. The highlights above refer to the tuned results.',
    workload: 'Workload',
    less: 'less time vs Ray',
    more: 'more time vs Ray',
    equal: 'same time as Ray',
    tableHint: 'Exact elapsed times in seconds. Percentages compare each Vane mode with Ray Data in the selected configuration.',
    workloads: { document: 'Document', image: 'Image', audio: 'Audio', video: 'Video' },
    methodology: 'About this benchmark',
    versionNote: 'Ray Data and Vane Ray use Ray',
    modes: 'Vane Local runs locally; Vane Ray uses the Ray execution backend. Both modes are measured on the same single-node setup.',
    audioNote: 'Ray Data has the lowest audio elapsed time in both configurations. Video results are close across Ray Data and the two Vane modes.',
    batchNote: 'The retest records default and tuned configurations; exact per-engine batch sizes are not listed here.',
    readingGuide: 'These results measure pipeline elapsed time; they do not measure model accuracy, context quality or token savings.',
    workflow: 'Benchmark code and workflow',
    readDocs: 'Read the Docs',
    explore: 'Explore use cases',
  }, {
    title: 'Vane Data 性能测试',
    description: '对比 Vane Local、Vane Ray 和 Ray Data 2.58.0 在文档、图像、音频与视频流水线中的性能，包含默认及调优 batch size 结果。',
    eyebrow: '基准测试',
    heading: '更快完成多模态数据处理',
    lead: '两种 Vane 执行模式，四类单机工作负载，分别对比默认和调优 batch size 下的实测表现。',
    environment: '测试环境',
    singleNode: '单机',
    cpuCores: '个 CPU 核心',
    memory: '内存',
    gpuMemory: '显存',
    modifiedVram: '显存改装版',
    results: '对比测试结果',
    batchMode: 'Batch size 配置',
    tuned: '调优 batch size',
    default: '默认 batch size',
    tunedTitle: 'batch size 调优结果',
    defaultTitle: '默认 batch size 结果',
    tunedLead: '各引擎分别调优 batch size。上方加速数据基于这组结果。',
    defaultLead: '各引擎使用默认 batch size。上方加速数据对应调优后的结果。',
    workload: '工作负载',
    less: '耗时减少，对比 Ray',
    more: '耗时增加，对比 Ray',
    equal: '与 Ray 耗时相同',
    tableHint: '精确耗时，单位为秒。百分比为当前配置下，各 Vane 模式相对 Ray Data 的耗时变化。',
    workloads: { document: '文档', image: '图像', audio: '音频', video: '视频' },
    methodology: '测试说明',
    versionNote: 'Ray Data 与 Vane Ray 均使用 Ray',
    modes: 'Vane Local 在本地执行，Vane Ray 使用 Ray 执行后端。两种模式均在同一台单机环境中测试。',
    audioNote: '两组配置中，Ray Data 的音频耗时最低；视频耗时在 Ray Data 与两种 Vane 模式之间接近。',
    batchNote: '本轮测试区分默认与调优配置，页面暂未列出各引擎的具体 batch size。',
    readingGuide: '这些数据衡量流水线执行耗时，不衡量模型准确率、上下文质量或 Token 节省。',
    workflow: '测试代码与复现流程',
    readDocs: '阅读文档',
    explore: '浏览用例',
  })
  const results = batchMode === 'tuned' ? BENCHMARK_RESULTS : DEFAULT_BATCH_BENCHMARK_RESULTS
  const resultTitle = batchMode === 'tuned' ? copy.tunedTitle : copy.defaultTitle

  return (
    <MarketingLayout data title={copy.title} description={copy.description}>
      <section className="intro benchmark-intro">
        <div className="wrap">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 className="h1">{copy.heading}</h1>
          <p className="lead">{copy.lead}</p>
          <BenchmarkHighlights locale={locale} headingLevel={2} />
        </div>
      </section>

      <div className="wrap"><div className="ddiv" /></div>
      <section className="bm-sec">
        <div className="wrap">
          <div className="shead"><h2 className="h2">{copy.results}</h2></div>
          <p className="benchmark-environment">
            <strong>{copy.environment}:</strong>{' '}
            {copy.singleNode} / {BENCHMARK_ENVIRONMENT.cpuCores} {copy.cpuCores} /{' '}
            {BENCHMARK_ENVIRONMENT.memoryGb} GB {copy.memory} / {BENCHMARK_ENVIRONMENT.gpu}
            {BENCHMARK_ENVIRONMENT.gpuMemoryModified ? ` (${copy.modifiedVram})` : ''} /{' '}
            {BENCHMARK_ENVIRONMENT.gpuMemoryGb} GB {copy.gpuMemory}
          </p>
          <div className="benchmark-mode-switch" role="group" aria-label={copy.batchMode}>
            {(['tuned', 'default'] as const).map((mode) => (
              <button type="button" key={mode} aria-pressed={batchMode === mode} aria-controls="benchmark-results" onClick={() => setBatchMode(mode)}>
                {copy[mode]}
              </button>
            ))}
          </div>
          <div id="benchmark-results" role="region" aria-labelledby="benchmark-result-title">
            <Box flat className="benchmark-panel">
              <div className="benchmark-panel-heading">
                <h3 id="benchmark-result-title" aria-live="polite">{resultTitle}</h3>
                <span>Ray {BENCHMARK_ENVIRONMENT.rayVersion}</span>
              </div>
              <p className="benchmark-config-note">{batchMode === 'tuned' ? copy.tunedLead : copy.defaultLead}</p>
              <BenchmarkPreview compact results={results} showHighlights={false} />
            </Box>
            <p className="benchmark-table-hint">{copy.tableHint}</p>
            <Box flat className="benchmark-table-wrap" role="region" aria-label={resultTitle} tabIndex={0}>
              <table className="summary benchmark-summary">
                <caption className="benchmark-table-caption">{resultTitle}. {copy.tableHint}</caption>
                <thead>
                  <tr>
                    <th scope="col">{copy.workload}</th>
                    <th scope="col">{BENCHMARK_ENGINE_NAMES.vaneLocal}</th>
                    <th scope="col">{BENCHMARK_ENGINE_NAMES.vaneRay}</th>
                    <th scope="col">{BENCHMARK_ENGINE_NAMES.rayData}</th>
                    <th scope="col">{BENCHMARK_ENGINE_NAMES.daft}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <th scope="row">{copy.workloads[result.id]}</th>
                      {benchmarkEngines(result).map((engine) => {
                        const isVane = engine.id === 'vaneLocal' || engine.id === 'vaneRay'
                        const change = engine.seconds === null ? null : runtimeChangePercent(engine.seconds, result.rayDataSeconds)
                        return (
                          <td key={engine.id}>
                            <span className="benchmark-runtime">
                              <strong>{engine.seconds === null ? 'OOM' : formatSeconds(engine.seconds)}</strong>
                              {isVane && change !== null && (
                                <small>{change === 0 ? copy.equal : `${Math.abs(change).toFixed(1)}% ${change < 0 ? copy.less : copy.more}`}</small>
                              )}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </div>

          <div className="benchmark-methodology benchmark-reading-guide">
            <h3>{copy.methodology}</h3>
            <p>{copy.versionNote} {BENCHMARK_ENVIRONMENT.rayVersion}. {copy.modes}</p>
            <p>{copy.audioNote}</p>
            <p>{copy.readingGuide}</p>
            <p>{copy.batchNote}</p>
            <BenchmarkScopeNote locale={locale} />
            <a className="benchmark-workflow-link" href={BENCHMARK_WORKFLOW_URL} target="_blank" rel="noreferrer">{copy.workflow}</a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>{copy.readDocs}</Button>
            <Button to="/solutions">{copy.explore}</Button>
          </Cta>
        </div>
      </section>
    </MarketingLayout>
  )
}
