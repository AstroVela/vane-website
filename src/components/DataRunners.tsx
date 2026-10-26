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
        <div className="runner-mobile-storage"><strong>{t('Inputs and output storage', '输入与结果存储')}</strong><p>{kind === 'local' ? t('Local files or accessible object storage.', '本机文件或可访问的对象存储。') : t('All workers need access to inputs, models, dependencies and output storage.', '所有执行节点需能访问输入、模型、依赖与输出存储。')}</p></div>
      </div>
      <h3>{kind === 'local' ? t('Develop and validate locally', '本地开发与验证') : t('Scale execution with Ray', '通过 Ray 扩展执行')}</h3>
      <p>{kind === 'local' ? t('Use the local runner for development, validation and on-demand processing, without starting Ray.', '使用本地执行器完成开发、验证与按需处理，无需启动 Ray。') : t('Run Ray on one machine or a cluster, scheduling CPU workers and GPU actors according to declared resource needs.', '在单机或集群中运行 Ray，按声明的资源需求调度 CPU Worker 与 GPU Actor。')}</p>
      <CodeWindow filename={kind === 'local' ? 'local_job.py' : 'job.py'} language="python" code={kind === 'local' ? local : ray}/>
    </div>)}</div>
    <p className="marketing-note">{t('Both examples use the same pipeline_sql. Configure credentials, dependencies and data access for your environment. Ray runs locally or on a cluster and handles GPU resource scheduling.', '示例复用同一份 pipeline_sql。执行前需准备相应凭据、依赖与数据访问；Ray 可在本机或集群运行，并负责 GPU 资源调度。')}</p>
    <Link className="arrow-link" to="/docs/data/deploy/deployment">{t('Deployment guide', '运行与部署指南')} →</Link>
  </div>
}
