import { pickLocale, type SiteLocale } from '../siteI18n'

const RAY_DATA_BENCHMARK_URL = 'https://www.anyscale.com/blog/ray-data-daft-benchmarking-multimodal-ai-workloads'

export default function BenchmarkScopeNote({ locale }: { locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      beforeLink: 'This single-node evaluation follows the workload design of the',
      link: 'Ray Data multimodal AI benchmark',
      afterLink: ". Results apply to the documented single-node hardware, data and settings. Daft results are retained from the previous run and were not retested; OOM indicates out of memory in that run.",
    },
    {
      beforeLink: '本次单机测试参考',
      link: 'Ray Data 多模态 AI 基准测试',
      afterLink: '的工作负载设计。结果仅适用于列明的单机硬件、数据与配置。Daft 沿用历史测试，本轮未重测；OOM 表示该次测试中内存不足。',
    },
  )

  return (
    <p className="home-chart-footnote">
      {copy.beforeLink}{' '}
      <a className="benchmark-source-link" href={RAY_DATA_BENCHMARK_URL} target="_blank" rel="noreferrer">{copy.link}</a>
      {copy.afterLink}
    </p>
  )
}
