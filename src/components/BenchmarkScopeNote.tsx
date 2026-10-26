import { pickLocale, type SiteLocale } from '../siteI18n'

const RAY_DATA_BENCHMARK_URL = 'https://www.anyscale.com/blog/ray-data-daft-benchmarking-multimodal-ai-workloads'

export default function BenchmarkScopeNote({ locale }: { locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      beforeLink: 'This single-node evaluation follows the workload design of the',
      link: 'Ray Data multimodal AI benchmark',
      afterLink: ". Results apply to the documented hardware, data and settings. Daft ran out of memory on the image and audio workloads. See the benchmark page for methodology and scripts.",
    },
    {
      beforeLink: '本次单机测试参考',
      link: 'Ray Data 多模态 AI 基准测试',
      afterLink: '的工作负载设计。结果仅适用于列明的硬件、数据与配置。Daft 在本次图片和音频负载中出现内存不足（OOM）；完整测试方法与脚本见性能测试页。',
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
