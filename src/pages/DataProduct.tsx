import {useRef, useState} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import {Cross2Icon, ZoomInIcon} from '@radix-ui/react-icons'
import MarketingLayout from '../components/MarketingLayout'
import Button from '../components/Button'
import CodeWindow from '../components/CodeWindow'
import HomeHeroExecution from '../components/HomeHeroExecution'
import DataEtlExplorer from '../components/DataEtlExplorer'
import DataExecution from '../components/DataExecution'
import DataRunners from '../components/DataRunners'
import BenchmarkPreview from '../components/BenchmarkPreview'
import BenchmarkScopeNote from '../components/BenchmarkScopeNote'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {GITHUB_URL} from '../siteLinks'
import {track} from '../analytics'

const heroCode = `import vane

con = vane.connect()
images = con.sql("""
    SELECT image_file(
        'quickstart-images/large.png'
    ) AS source
""")

images.select("""
    source,
    image_file_metadata(source).width AS width,
    resize(decode_image_file(source, 'RGB'),
           224, 224) AS thumbnail
""").show()`

function ArchitectureImage() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const src = useBaseUrl(`/img/blog/ai-workloads-need-a-new-data-engine/vane-data-architecture-${locale === 'en' ? 'en' : 'zh-cn'}.png`)
  const dialog = useRef<HTMLDialogElement>(null), [open, setOpen] = useState(false)
  const show = () => {setOpen(true); dialog.current?.showModal()}
  const close = () => {dialog.current?.close(); setOpen(false)}
  return <div className="data-architecture-image"><button type="button" className="architecture-image-button" onClick={show}><img src={src} width={1873} height={840} loading="lazy" alt={t('Vane Data architecture: multimodal inputs, Relation pipeline, unified runtime and typed outputs.', 'Vane Data 架构：多模态输入、Relation 流水线、统一运行时与有类型的输出。')}/><span><ZoomInIcon aria-hidden="true"/>{t('Enlarge architecture', '放大架构图')}</span></button><dialog ref={dialog} className="architecture-modal" aria-label={t('Vane Data architecture', 'Vane Data 架构图')} onClose={() => setOpen(false)} onClick={e => {if (e.target === e.currentTarget) close()}}><button type="button" onClick={close}><Cross2Icon aria-hidden="true"/>{t('Close', '关闭')}</button>{open && <img src={src} width={1873} height={840} alt={t('Vane Data architecture, enlarged.', '放大的 Vane Data 架构图。')}/>}</dialog></div>
}

export default function DataProduct() {
  const anchors = useBrokenLinks()
  for (const id of ['architecture', 'processing', 'execution', 'runners', 'benchmarks', 'quickstart']) anchors.collectAnchor(id)
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout data title={t('Vane Data: multimodal processing with SQL and Python', 'Vane Data：用 SQL 和 Python 处理多模态数据')} description={t('Native media types, custom UDFs and AI Functions in one data engine. Build locally, query typed results and scale execution with Ray.', '将原生媒体类型、自定义 UDF 与 AI Function 接入同一数据引擎，本地构建、查询结构化结果，并用 Ray 扩展执行。')}>
    <section className="marketing-product-hero data-product-hero"><div className="wrap data-hero-grid"><div><span className="product-badge">{t('Open source · Apache-2.0', '开源 · Apache-2.0')}</span><h1 className="h1">{t('Multimodal data.', '用 SQL 和 Python，')}<br/>{t('SQL and Python.', '处理多模态数据。')}</h1><p className="lead">{t('Connect files, model inference and relational computation in one pipeline. Start locally and extend with Ray.', '将文件、模型推理与关系计算组织在同一条数据流水线中，从本地运行扩展到 Ray。')}</p><div className="marketing-actions"><Button solid to="/docs/data/quickstart/quickstart" arrow onClick={() => track('data_docs_click', {product: 'data', locale})}>Quickstart</Button><a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={() => track('data_github_click', {product: 'data', locale})}>GitHub ↗</a></div><div className="data-install"><code>pip install vane-ai</code></div></div><div className="data-hero-code"><CodeWindow filename="quickstart.py" language="python" code={heroCode}/><div className="hero-code-output"><span>{t('Original width', '原图宽度')} <strong>640</strong></span><span>{t('Thumbnail', '缩略图')} <strong>224 × 224</strong></span></div><Link className="arrow-link" to="/docs/data/quickstart/quickstart">{t('Create the sample and run this example', '创建样本并运行示例')} →</Link></div></div></section>
    <section className="section marketing-section" id="architecture"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Data, models and compute. One engine.', '数据、模型与计算资源，在同一个引擎中协同。')}</h2></div><ArchitectureImage/><div className="architecture-summary">{[[t('One data model', '统一数据模型'), t('Files and business fields share a Relation.', '文件与业务字段进入同一条 Relation。')], [t('Composable processing', '统一处理表达'), t('Compose SQL, Python UDFs and AI Functions.', '组合 SQL、Python UDF 与 AI Function。')], [t('Unified execution', '统一执行机制'), t('Coordinate batches, concurrency and resources.', '协调批次、并发与计算资源。')]].map(([title, body]) => <div key={title}><strong>{title}</strong><p>{body}</p></div>)}</div><Link className="arrow-link" to="/blog/ai-workloads-need-a-new-data-engine">{t('Read the architecture walkthrough', '阅读架构详解')} →</Link></div></section>
    <section className="section marketing-section" id="processing"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Write multimodal work like an ETL pipeline.', '像编写 ETL 一样，处理文件、调用模型、查询理解结果。')}</h2><p>{t('Follow an equipment-inspection example across native types, custom functions, AI understanding, embeddings and business queries.', '用设备巡检案例，串起原生类型、自定义函数、AI 理解、向量化与业务查询。')}</p></div><DataEtlExplorer/></div></section>
    <section className="section marketing-section" id="execution"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Keep I/O, CPU and GPU working together.', '让 I/O、CPU 与 GPU 持续协同工作。')}</h2><p>{t('Coordinate variable object sizes, model instances and resource demand inside the execution engine.', '在引擎内部协调不同大小的对象、模型实例与计算资源需求。')}</p></div><DataExecution/><Link className="arrow-link" to="/blog/why-we-need-a-multimodal-native-engine">{t('Explore execution mechanisms', '了解执行机制')} →</Link></div></section>
    <section className="section marketing-section" id="runners"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('From local development to distributed execution.', '从本地开发，扩展到分布式执行。')}</h2><p>{t('Reuse your processing logic with Local and Ray runners. Adapt runtime configuration to the workload.', '使用 Local 与 Ray Runner 复用处理逻辑，根据负载调整运行配置。')}</p></div><DataRunners/></div></section>
    <section className="section marketing-section" id="benchmarks"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Compare real workloads.', '查看真实工作负载下的性能。')}</h2><p>{t('Published timings with the workload, hardware and tuning conditions visible.', '公开耗时，并保留工作负载、硬件与调优条件。')}</p></div><BenchmarkPreview/><BenchmarkScopeNote locale={locale}/><Link className="arrow-link" to="/benchmarks">{t('Methodology, scripts and complete results', '方法、脚本与完整结果')} →</Link></div></section>
    <section className="section marketing-section" id="quickstart"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Run your first multimodal query.', '从第一条多模态查询开始。')}</h2><p>{t('Install, run the sample and inspect its result. The first example needs no model credentials.', '安装、运行样例、查看结果，第一个示例无需模型凭证。')}</p></div><div className="data-start-layout"><HomeHeroExecution/><div><h3>{t('Install and run', '安装与运行')}</h3><CodeWindow filename="install.sh" language="bash" code="pip install 'vane-ai[image]'"/><p>{t('The Python sample creates its own images. Continue with AI Functions, UDFs or Ray when you are ready.', 'Python 样例自带图片输入，随后可继续使用 AI Function、UDF 或 Ray。')}</p><div className="marketing-actions"><Button solid to="/docs/data/quickstart/quickstart" arrow>Quickstart</Button></div><div className="quickstart-next"><Link to="/docs/data/concepts/ai-functions">AI Functions →</Link><Link to="/docs/data/concepts/udfs">Python UDF →</Link><Link to="/docs/data/deploy/deployment">Ray →</Link></div></div></div></div></section>
  </MarketingLayout>
}
