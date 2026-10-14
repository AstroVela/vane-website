import {useId, useState} from 'react'
import {DesktopIcon, CubeIcon, ArrowRightIcon} from '@radix-ui/react-icons'
import CodeWindow from './CodeWindow'
import FeatureTabs from './FeatureTabs'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function DataRunners() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh, id = useId()
  const [runner, setRunner] = useState('local')
  return <div className="data-runners">
    <div className="runner-pipeline">{[t('Read', '读取'), t('Prepare', '准备'), t('Infer', '推理'), t('Query & write', '查询与写出')].map((title, i) => <span key={title}>{title}{i < 3 && <ArrowRightIcon aria-hidden="true"/>}</span>)}</div>
    <FeatureTabs options={[{id: 'local', label: 'Local'}, {id: 'ray', label: 'Ray'}]} value={runner} onChange={setRunner} label={t('Execution environment', '执行环境')} panelId={id}/>
    <div className="runner-workspace" role="tabpanel" id={id} aria-labelledby={`${id}-${runner}`}>
      <div className="runner-environment">{runner === 'local' ? <DesktopIcon aria-hidden="true"/> : <div className="ray-worker-grid">{[0, 1, 2, 3].map(i => <span key={i}><CubeIcon aria-hidden="true"/>Worker</span>)}</div>}<h3>{runner === 'local' ? t('Inside your application or workstation.', '在应用进程或工作站中运行。') : t('Across available cluster resources.', '使用集群中的计算资源。')}</h3><p>{runner === 'local' ? t('Develop, validate and process data on demand.', '开发、验证与按需处理。') : t('Schedule CPU and GPU workers for larger workloads.', '为更大规模负载调度 CPU 与 GPU Worker。')}</p></div>
      <div><CodeWindow key={runner} filename="runner.py" language="python" code={`import vane\n\nvane.configure(runner="${runner}")\ncon = vane.connect()\n\n# Reuse the same processing logic.\nresult = con.sql(pipeline_sql)`}/><p className="marketing-note">{t('Business logic remains reusable. Runtime configuration, source access and resource declarations follow your environment.', '业务逻辑可以复用，运行配置、数据访问与资源声明根据环境调整。')}</p><Link className="arrow-link" to="/docs/data/deploy/deployment">{t('Runner setup and resource requirements', '运行配置与资源要求')} →</Link></div>
    </div>
  </div>
}
