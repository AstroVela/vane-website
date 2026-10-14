import {useState} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowRightIcon} from '@radix-ui/react-icons'
import {Link} from '../router'
import CodeWindow from './CodeWindow'
import {useSiteLocale} from '../siteI18n'
import {assetFor, insightFor} from '../content/showcases'

const query = `SELECT source, subject, caption
FROM image_observations
WHERE scene = 'kitchen';`

/** Example output schema, derived from the approved image. No inference runs in the browser. */
export default function DataProcessingExample({eager = false}: {eager?: boolean}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [step, setStep] = useState<'source' | 'data' | 'query'>('data')
  const source = assetFor('comp_005'), image = useBaseUrl(source.url)
  const caption = insightFor('caption').sourceExcerpt!.text
  return <div className="data-flow focus-frame">
    <div className="data-flow-heading"><strong>{t('One image. Queryable data.', '一张图片，可查询的数据。')}</strong><span>{t('Output example', '产出示例')}</span></div>
    <div className="marketing-tabs" role="group" aria-label={t('Data processing example', '数据处理示例')}>{[
      ['source', t('Source', '原始文件')], ['data', t('Structured result', '结构化结果')], ['query', t('Query', '查询使用')],
    ].map(([key, label]) => <button key={key} type="button" aria-pressed={step === key} onClick={() => setStep(key as typeof step)}>{label}</button>)}</div>
    <div className="data-flow-panel" aria-live="polite">
      {step === 'source' ? <div className="data-source-view"><img src={image} width={576} height={1024} loading={eager ? 'eager' : 'lazy'} alt={source.alt[locale]} /><div><h3>{t('Keep the original file.', '保留原始文件。')}</h3><p>{t('Read the image, extract objects and text, and keep the source alongside the result.', '读取图片，提取对象与文字，将来源与理解结果一起保留。')}</p><span className="value-label">{t('Python UDF · AI Function · Relation', 'Python UDF · AI Function · Relation')}</span></div></div>
        : step === 'data' ? <div className="data-record-view"><img src={image} width={576} height={1024} loading={eager ? 'eager' : 'lazy'} alt={source.alt[locale]} /><dl>
          <div><dt>source <span>VARCHAR</span></dt><dd>comp_005</dd></div>
          <div><dt>subject <span>VARCHAR</span></dt><dd>blender cup</dd></div>
          <div><dt>scene <span>VARCHAR</span></dt><dd>kitchen</dd></div>
          <div><dt>caption <span>VARCHAR</span></dt><dd>{caption}</dd></div>
        </dl></div>
        : <div className="data-query-view"><CodeWindow filename="image_observations.sql" language="sql" code={query} /><div className="data-query-result"><span className="value-label">{t('Matching record', '匹配记录')}</span><strong>comp_005 · blender cup</strong><p>{caption}</p></div></div>}
    </div>
    <p className="marketing-note">{t('Illustrative schema and output. The query uses an image_observations relation prepared by your pipeline.', '示例字段与理解结果。查询使用处理流程生成的 image_observations 数据集。')}</p>
    <Link className="arrow-link" to="/blog/from-files-to-queryable-data">{t('See how the pipeline is built', '了解如何构建处理流程')}<ArrowRightIcon aria-hidden="true" /></Link>
  </div>
}
