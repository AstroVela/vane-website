import {useState} from 'react'
import MarketingLayout from '../components/MarketingLayout'
import Button from '../components/Button'
import HomeHeroExecution from '../components/HomeHeroExecution'
import DataProcessingExample from '../components/DataProcessingExample'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {GITHUB_URL} from '../siteLinks'
import {track} from '../analytics'
import {BENCHMARK_RESULTS, BENCHMARK_ENVIRONMENT, runtimeChangePercent} from '../benchmarkData'
import BenchmarkScopeNote from '../components/BenchmarkScopeNote'

const media = [
  {type: 'IMAGEFILE → IMAGE', label: ['Images', '图片'], body: ['Decode, inspect, crop and resize images before model inference. Keep source fields alongside the output.', '在模型推理前解码、检查、裁剪和缩放图片，同时保留来源字段。'], code: "resize(decode_image_file(source, 'RGB'), 224, 224)", link: '/docs/data/reference/multimodal-data/image'},
  {type: 'VIDEOFILE', label: ['Video', '视频'], body: ['Read metadata and frames, run visual processing and retain source locations for later inspection.', '读取元数据与视频帧，执行视觉处理，保留来源定位供后续核对。'], code: 'VIDEOFILE → frames → model output', link: '/docs/data/reference/multimodal-data/video'},
  {type: 'AUDIOFILE', label: ['Audio', '音频'], body: ['Prepare audio for transcription or sound analysis and keep business fields with the result.', '为转写或声音分析准备音频，并将业务字段与处理结果一起保留。'], code: 'AUDIOFILE → audio → model input', link: '/docs/data/reference/multimodal-data/audio'},
  {type: 'FILE', label: ['Files', '文件'], body: ['Keep typed file references in a relation. Bring your parser and retain page, block or business identifiers as you expand the data.', '在数据集中保留有类型的文件引用。接入解析库，展开数据时保留页码、块序号或业务标识。'], code: 'FILE → pages / blocks → typed result', link: '/docs/data/reference/multimodal-data/file'},
]
export default function DataProduct() {
  const locale = useSiteLocale(), lang = locale === 'en' ? 0 : 1, [active, setActive] = useState(0)
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  const workloadNames = {document: t('Documents', '文档'), image: t('Images', '图像'), audio: t('Audio', '音频'), video: t('Video', '视频')}
  return <MarketingLayout data title={t('Vane Data: simpler multimodal pipelines, efficient execution', 'Vane Data：让多模态数据处理像 ETL 一样简单')} description={t('Connect files, Python models and SQL in one multimodal data engine. Reduce pipeline plumbing, reuse code and run locally or with Ray.', '将文件、Python 模型与 SQL 组织成统一数据流程，减少执行控制代码，复用现有能力，从本地运行扩展到 Ray。')}>
    <section className="marketing-product-hero data-product-hero"><div className="wrap data-hero-grid"><div><span className="product-badge">{t('Open source · Apache-2.0', '开源 · Apache-2.0')}</span><h1 className="h1">{t('Multimodal data.', '多模态处理，')}<br />{t('Familiar workflows.', '像 ETL 一样简单。')}</h1><p className="lead">{t('Use SQL and Python to turn media into queryable data. Let the engine coordinate execution.', '用 SQL 与 Python 将媒体变成可查询的数据，由引擎统一组织执行。')}</p><div className="marketing-actions"><Button solid to="/docs/data/quickstart/quickstart" arrow onClick={() => track('data_docs_click', {product: 'data', locale})}>{t('Start using', '开始使用')}</Button><a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={() => track('data_github_click', {product: 'data', locale})}>GitHub ↗</a></div><div className="data-install"><code>uv pip install 'vane-ai[image]'</code></div></div><DataProcessingExample eager /></div></section>

    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Keep the whole job in one data flow.', '从文件到业务数据，同一条处理流程。')}</h2><p>{t('A relation carries source references, business fields and model output. Each result is ready for the next operation.', 'Relation 将来源、业务字段与模型输出组织成有类型的数据集，每一步结果都能继续参与计算。')}</p></div>
      <div className="data-pipeline-steps">{[
        [t('Read and prepare', '读取与准备'), t('Files, images, audio, video', '文件、图片、音频、视频'), t('Keep source identifiers while decoding, splitting or expanding media.', '在解码、拆分和展开媒体时保留来源标识。')],
        [t('Understand and extract', '理解与提取'), t('Python UDF + AI Function', 'Python UDF + AI Function'), t('Use your parsers and models to produce typed fields, text or embeddings.', '复用解析库与模型，生成结构化字段、文本或向量。')],
        [t('Query and connect', '查询与关联'), t('SQL + business data', 'SQL + 业务数据'), t('Filter, join and aggregate the results, then write to your downstream system.', '筛选、关联和聚合处理结果，再写入下游系统。')],
      ].map(([title, label, body]) => <div key={title}><h3>{title}</h3><code>{label}</code><p>{body}</p></div>)}</div>
      <div className="data-relation-note"><strong>{t('The source stays with the result.', '结果始终找得到来源。')}</strong><p>{t('Carry document IDs, page numbers, timestamps and business keys through your transforms, so a query result can be traced back to the original content.', '在转换中保留文档 ID、页码、时间戳与业务主键，让查询结果可以回到原始内容。')}</p></div><Link className="arrow-link" to="/blog/from-files-to-queryable-data">{t('Walk through four media pipelines', '阅读四类媒体的完整处理示例')} →</Link>
    </div></section>

    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Reuse the code you already know.', '熟悉的代码，继续发挥作用。')}</h2><p>{t('Compose data operations, custom logic and model inference without building a separate execution system for each pipeline.', '组合数据操作、自定义逻辑与模型推理，减少每条流程重复建设执行系统的工作。')}</p></div>
      <div className="code-roles">{[
        ['SQL', t('Organize the data', '组织数据'), t('Select fields, filter records, join business tables and aggregate the result.', '字段计算、筛选记录、关联业务表、聚合结果。')],
        ['Python UDF', t('Bring your logic', '接入已有逻辑'), t('Reuse parsing libraries, media transforms and business rules in the same pipeline.', '将解析库、媒体转换和业务规则接入同一条流程。')],
        ['AI Function', t('Compute with models', '使用模型计算'), t('Add understanding and embeddings as fields that later steps can query.', '把内容理解和向量化结果变成后续步骤可查询的字段。')],
      ].map(([name, title, body]) => <div key={name}><span className="code-role-name">{name}</span><h3>{title}</h3><p>{body}</p></div>)}</div><div className="marketing-actions"><Link to="/docs/data/concepts/udfs">{t('Python UDFs', 'Python UDF')} →</Link><Link to="/docs/data/concepts/ai-functions">{t('AI Functions', 'AI Function')} →</Link></div>
    </div></section>

    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Let the engine organize the work.', '把执行组织工作交给引擎。')}</h2><p>{t('Variable file sizes, expanding records and mixed resources need more than a single concurrency setting.', '文件大小不同，中间数据不断展开，各阶段又依赖不同资源。引擎统一协调这些执行问题。')}</p></div>
      <div className="execution-benefits">{[
        [t('Control the work in flight', '控制在途数据'), t('Batching & backpressure', '批次控制与反压'), t('When model inference slows down, upstream production can slow with it, reducing accumulated intermediate data.', '模型处理变慢时，协调上游生产速度，减少中间结果积压与内存压力。')],
        [t('Keep expensive models ready', '复用昂贵的模型实例'), t('Stateful model instances', '有状态实例'), t('Initialize a model or connection once and reuse it across batches to reduce repeated setup.', '模型或连接初始化后服务多个批次，减少重复加载与初始化开销。')],
        [t('Coordinate available resources', '让计算资源协同工作'), t('I/O · CPU · GPU · model services', 'I/O · CPU · GPU · 模型服务'), t('Overlap reading, preparation and inference where possible, with resource settings for each stage.', '按阶段配置资源，让读取、准备和推理在条件允许时重叠运行。')],
        [t('Operate a pipeline consistently', '统一运行与排查方式'), t('Retries & execution diagnostics', '重试与执行诊断'), t('Apply error handling and retry policies within the execution path, with clear limits for safe replay.', '在执行路径内配置错误处理与重试策略，明确安全重放范围，便于定位失败与等待。')],
      ].map(([title, label, body]) => <div key={title}><span className="value-label">{label}</span><h3>{title}</h3><p>{body}</p></div>)}</div><Link className="arrow-link" to="/blog/why-we-need-a-multimodal-native-engine">{t('Why multimodal work needs an engine', '为什么多模态处理需要专门的引擎')} →</Link>
    </div></section>

    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Work with the media you have.', '让不同媒体进入同一套数据表达。')}</h2><p>{t('Native media types preserve file references and provide operations for the next processing step.', '原生媒体类型保留文件引用，为后续处理提供读取与转换能力。')}</p></div><div className="marketing-tabs" role="group" aria-label={t('Native media types', '原生媒体类型')}>{media.map((m, i) => <button type="button" key={m.type} aria-pressed={i === active} onClick={() => setActive(i)}>{m.label[lang]}</button>)}</div><div className="native-media-details"><div><h3>{media[active].type}</h3><p>{media[active].body[lang]}</p><Link to={media[active].link}>{t('Explore operators', '查看算子')} →</Link></div><code>{media[active].code}</code></div></div></section>

    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Start locally. Keep room to grow.', '从本地开始，保留扩展空间。')}</h2><p>{t('Use a local runner for embedded processing, or Ray for parallel and distributed execution. Configure resources for your workload.', '通过 Local Runner 进行本地与进程内处理，或使用 Ray 扩展并行和分布式执行，按工作负载配置资源。')}</p></div>
      <div className="execution-diagram"><div><strong>{t('Local development & applications', '本地开发与应用集成')}</strong><span>{t('Python library · local processing · existing functions', 'Python 库 · 本地处理 · 复用已有函数')}</span></div><span aria-hidden="true">→</span><div><strong>{t('Ray execution', 'Ray 执行')}</strong><span>{t('Parallel workers · shared sources · cluster resources', '并行 Worker · 共享来源 · 集群资源')}</span></div></div>
      <div className="connection-groups"><div><h3>{t('Connect existing storage', '连接已有存储')}</h3><p>Iceberg · Paimon · DuckLake · Lance · Vortex</p><Link className="arrow-link" to="/docs/data/extensions">{t('Provider setup and supported operations', 'Provider 配置与支持的操作')} →</Link></div><div><h3>{t('Write to downstream systems', '写入下游系统')}</h3><p>Milvus · Qdrant · Doris</p><Link className="arrow-link" to="/docs/data/deploy/deployment">{t('Execution and deployment requirements', '执行与部署要求')} →</Link></div></div>
    </div></section>

    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Measure the whole pipeline.', '用完整流水线检验执行效率。')}</h2><p>{t('Published end-to-end timings, with workload, hardware and tuning conditions kept visible.', '公开端到端耗时，同时保留工作负载、硬件与调优条件。')}</p></div><p className="marketing-note">Vane Data · Ray Data · Daft / {BENCHMARK_ENVIRONMENT.cpuCores} CPU / {BENCHMARK_ENVIRONMENT.memoryGb} GB RAM / {BENCHMARK_ENVIRONMENT.gpu} / {BENCHMARK_ENVIRONMENT.gpuMemoryGb} GB {t('modified VRAM', '改装显存')}</p>
      <div className="data-benchmark-table"><table><thead><tr><th>{t('Workload', '工作负载')}</th><th>Vane Data</th><th>Ray Data</th><th>Daft</th><th>{t('Time vs Ray Data', '相对 Ray Data 耗时')}</th></tr></thead><tbody>{BENCHMARK_RESULTS.map(r => {const change = runtimeChangePercent(r.vaneSeconds, r.rayDataSeconds); return <tr key={r.id}><th>{workloadNames[r.id]}</th><td>{r.vaneSeconds}s</td><td>{r.rayDataSeconds}s</td><td>{r.daftSeconds === null ? 'OOM' : r.daftSeconds + 's'}</td><td>{Math.abs(change).toFixed(1)}% {change < 0 ? t('lower', '更低') : t('higher', '更高')}</td></tr>})}</tbody></table></div>
      <p className="marketing-note">{t('Batch-size-tuned results. Document, image and audio runs took less time than Ray Data here; video took longer. These timings do not measure model quality or token savings.', '以上为 batch size 调优结果：该环境中文档、图像和音频耗时低于 Ray Data，视频耗时更高。这些数据衡量执行耗时，不衡量模型质量或 Token 节省。')}</p><BenchmarkScopeNote locale={locale} /><Link className="arrow-link" to="/benchmarks">{t('Environment, methodology and full results', '环境、方法与完整结果')} →</Link>
    </div></section>

    <section className="section marketing-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Start with a runnable example.', '先跑通一条真实流程。')}</h2><p>{t('Create sample images, filter their metadata and build thumbnails. Then add your own models and transformations.', '从生成样本图片、筛选元数据和创建缩略图开始，再接入自己的模型与转换逻辑。')}</p></div><div className="data-start-layout"><HomeHeroExecution /><div><h3>{t('Run it on your machine', '在自己的机器上运行')}</h3><p>{t('The complete Python example creates its own inputs and needs no model credentials. Follow the quickstart for installation and execution.', '完整 Python 示例自带输入，无需模型凭证。按快速入门完成安装与执行。')}</p><div className="marketing-actions"><Button solid to="/docs/data/quickstart/quickstart" arrow>{t('Start using', '开始使用')}</Button><Link to="/docs/data/tutorials">{t('More examples', '更多示例')} →</Link></div></div></div></div></section>
    <section className="section marketing-final-cta"><div className="wrap"><h2 className="h2">{t('Build your next media pipeline.', '开始构建你的多模态处理流程。')}</h2><div className="marketing-actions"><Button solid to="/docs/data/quickstart/quickstart" arrow>{t('Start using', '开始使用')}</Button><Link to="/solutions/training">{t('Training pipelines', '训练数据流水线')} →</Link></div></div></section>
  </MarketingLayout>
}
