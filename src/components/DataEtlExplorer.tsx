import {useId, useState} from 'react'
import {ArrowRightIcon, FileTextIcon, ImageIcon, SpeakerLoudIcon, VideoIcon} from '@radix-ui/react-icons'
import CodeWindow from './CodeWindow'
import FeatureTabs from './FeatureTabs'
import {etlExamples, etlStages, type EtlStage} from '../content/dataEtl'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

const icons = {file: FileTextIcon, image: ImageIcon, audio: SpeakerLoudIcon, video: VideoIcon}

export default function DataEtlExplorer() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh, id = useId()
  const [stage, setStage] = useState<EtlStage>('native'), [variant, setVariant] = useState('file')
  const examples = etlExamples[stage], example = examples.find(item => item.id === variant) ?? examples[0]
  const Icon = icons[example.id as keyof typeof icons] ?? FileTextIcon
  const select = (value: string) => {const next = value as EtlStage; setStage(next); setVariant(etlExamples[next][0].id)}
  return <div className="etl-explorer" data-stage={stage}>
    <div className="etl-path" aria-hidden="true">{[t('Files & media', '文件与媒体'), t('Custom processing', '自定义处理'), t('Typed observations', '结构化观测'), t('Embeddings', '向量'), t('Business queries', '业务查询')].map((label, i) => <span key={label} data-active={etlStages[i].id === stage}>{label}{i < 4 && <ArrowRightIcon />}</span>)}</div>
    <FeatureTabs options={etlStages.map(item => ({id: item.id, label: item.label[locale]}))} value={stage} onChange={select} label={t('Multimodal ETL mechanisms', '多模态 ETL 机制')} panelId={id}/>
    <div className="etl-workspace" role="tabpanel" id={id} aria-labelledby={`${id}-${stage}`}>
      <div className="etl-code">
        <div className="etl-variants" role="group" aria-label={t('Code example', '代码示例')}>{examples.map(item => <button key={item.id} type="button" aria-pressed={example.id === item.id} onClick={() => setVariant(item.id)}>{item.label[locale]}</button>)}</div>
        <CodeWindow key={stage + example.id} filename={example.id + (example.language === 'python' ? '.py' : '.sql')} code={example.code} language={example.language}/>
        <details className="etl-setup"><summary>{t('Shared setup & parameters', '共享配置与参数')}</summary><code>import vane<br/>con = vane.connect()<br/>root = "s3://manufacturing/factory-a"</code><p>{t('SQL parameters, source relations, UDF registration and indexes are prepared in the complete example.', '完整案例提供 SQL 参数、输入关系、UDF 注册与检索索引。')}</p></details>
      </div>
      <div className="etl-result" key={example.id}>
        <span className="result-caption"><Icon aria-hidden="true"/>{t('Equipment inspection example', '设备巡检示例')}</span>
        <h3>{example.title[locale]}</h3>
        <dl>{example.rows.map(([field, value]) => <div key={field}><dt>{field}</dt><dd>{value}</dd></div>)}</dl>
        <p>{example.note[locale]}</p>
        {stage === 'query' && <details className="etl-evidence"><summary>{t('Inspect the example evidence', '展开示例依据')}</summary><blockquote>{t('“Vibration is 0.5 inches per second. Check the bearing and the mounting bolts.”', '“振动速度是 0.5 英寸每秒，需要检查轴承和固定螺栓。”')}</blockquote><code>A-017 / inspection.wav / 4.2–8.6 s</code></details>}
      </div>
    </div>
    <div className="feature-footnote"><span>{t('Illustrated results. Choose compatible models for each input.', '案例结果示意，各类输入需配置兼容模型。')}</span><Link className="arrow-link" to="/docs/data/tutorials/use-cases/equipment-observations">{t('View the complete example', '查看完整案例')}<ArrowRightIcon aria-hidden="true"/></Link></div>
  </div>
}
