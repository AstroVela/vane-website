import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowDownIcon} from '@radix-ui/react-icons'
import CodeWindow from './CodeWindow'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

const local = `import vane

vane.configure(runner="local")
con = vane.connect()
result = con.sql(pipeline_sql)
result.show()`
const ray = `import vane

# Ray is the default runner.
con = vane.connect()
result = con.sql(pipeline_sql)
result.show()`

export default function DataRunners() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const src = useBaseUrl(`/img/products/data-deployment-${locale}.svg`)
  return <div className="data-runners">
    <img className="product-diagram-desktop" src={src} width={1400} height={650} loading="lazy"
      alt={t('The same SQL or Python processing definition runs on a local machine with subprocess workers, or through a Ray scheduler and CPU workers / GPU Actors. All distributed workers need access to the inputs, dependencies and result storage.', '同一份 SQL 或 Python 定义，由本机子进程 Worker 执行，或由 Ray 调度 CPU Worker 与 GPU Actor。分布式执行要求所有 Worker 能访问输入、依赖和结果存储。')}/>
    <div className="runner-configurations">{(['local','ray'] as const).map(kind => <div className="runner-configuration" key={kind}>
      <div className="product-diagram-mobile runner-mobile-diagram">
        <p className="runner-shared-definition">{t('Same definition: read → prepare / UDF → AI → query & write', '同一定义：读取 → 预处理 / UDF → AI → 查询与写出')}</p>
        <ArrowDownIcon className="diagram-down" aria-hidden="true"/>
        <div className="runner-mobile-machine"><h3>{kind === 'local' ? t('One machine · Local Runner', '一台机器 · Local Runner') : 'Ray Runtime / Cluster'}</h3>
          <div className="runner-mobile-node">{kind === 'local' ? t('Application / Driver', '应用 / Driver') : 'Driver'}<code>import vane</code></div>
          <ArrowDownIcon className="diagram-down" aria-hidden="true"/>
          {kind === 'ray' && <><div className="runner-mobile-node runner-scheduler">{t('Ray scheduler · Tasks & resources', 'Ray 调度 · 任务与资源')}</div><ArrowDownIcon className="diagram-down" aria-hidden="true"/></>}
          <div className="runner-mobile-workers">{kind === 'local' ? <div className="runner-mobile-node">{t('Local worker / subprocess', '本机 Worker / 子进程')}<small>{t('CPU execution', 'CPU 执行')}</small></div> : <><div className="runner-mobile-node">CPU Worker</div><div className="runner-mobile-node">GPU Actor<small>{t('Model instance reuse', '模型实例复用')}</small></div></>}</div>
        </div>
        <div className="runner-mobile-storage"><strong>{t('Inputs & result storage', '数据源与结果存储')}</strong><p>{kind === 'local' ? t('Local files or accessible object storage.', '本机文件或可访问的对象存储。') : t('Every worker needs access to the data, models, dependencies and output.', '所有 Worker 均需访问数据、模型、依赖和输出。')}</p></div>
      </div>
      <h3>{kind === 'local' ? t('Develop and run locally.', '在本机开发与运行。') : t('Schedule the resources you need.', '按需求调度计算资源。')}</h3>
      <p>{kind === 'local' ? t('For development, validation and on-demand processing. Local workers can use subprocesses; no Ray runtime is required.', '用于开发、验证和按需处理。本机 Worker 可使用子进程，无需 Ray。') : t('Run Ray on one machine or an existing cluster. Schedule CPU workers and GPU Actors according to resource declarations.', 'Ray 可在单机或已有集群中运行，按资源声明调度 CPU Worker 与 GPU Actor。')}</p>
      <CodeWindow filename={kind === 'local' ? 'local_job.py' : 'job.py'} language="python" code={kind === 'local' ? local : ray}/>
      {kind === 'ray' && <div className="runner-launch"><p>{t('On the head node of an existing Ray cluster:', '在已有 Ray 集群的 head 节点启动：')}</p><CodeWindow filename="terminal" language="bash" code="RAY_ADDRESS=auto python job.py"/></div>}
    </div>)}</div>
    <p className="marketing-note">{t('Configuration excerpts share the same pipeline_sql. Prepare credentials, dependencies and shared data access for your environment. Without RAY_ADDRESS, Ray can start on the current machine; use Ray for GPU resource scheduling.', '两份执行配置共用 pipeline_sql。按环境准备凭据、依赖与数据访问；未设置 RAY_ADDRESS 时可在当前机器启动 Ray。GPU 资源调度使用 Ray。')}</p>
    <Link className="arrow-link" to="/docs/data/deploy/deployment">{t('Deployment guide', '运行与部署文档')} →</Link>
  </div>
}
