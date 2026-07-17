import { pickLocale, type SiteLocale } from '../siteI18n'

const RAY_DATA_BENCHMARK_URL = 'https://www.anyscale.com/blog/ray-data-daft-benchmarking-multimodal-ai-workloads'

export default function BenchmarkScopeNote({ locale }: { locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      beforeLink: 'This single-node evaluation adapts the workload design from the',
      link: 'Ray Data multimodal AI benchmark',
      afterLink: ". Daft's OOMs on the image and audio workloads may reflect the test machine's limited memory, while the older 2080 Ti GPU also limits throughput. Given current hardware and compute-budget constraints, we have not reproduced the original benchmark's full cluster-scale setup; these results apply only to the recorded single-node environment.",
    },
    {
      beforeLink: '本次单机测试参考了',
      link: 'Ray Data 多模态 AI benchmark',
      afterLink: '的 workload 设计。Daft 在图像和音频 workload 中出现 OOM，可能与测试机器的可用内存有限有关；较早一代的 2080 Ti GPU 也限制了整体吞吐。受当前硬件与算力预算限制，我们尚未复现原 benchmark 的完整集群规模；这些结果仅代表所记录单机环境下的实测表现。',
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
