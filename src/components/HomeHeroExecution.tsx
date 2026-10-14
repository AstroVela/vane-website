import {useState} from 'react'
import CodeWindow from './CodeWindow'
import CodeLanguageSwitch, {type CodeLanguage} from './CodeLanguageSwitch'
import {quickstartFixtures, quickstartPython, quickstartSql} from '../content/dataQuickstart'
import {useSiteLocale} from '../siteI18n'

export default function HomeHeroExecution() {
  const [language, setLanguage] = useState<CodeLanguage>('sql'), locale = useSiteLocale()
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  const command = language === 'python' ? 'python3 quickstart.py'
    : `python3 -c 'import sys, vane; vane.configure(runner="local"); vane.connect().sql(sys.stdin.read()).show()' < quickstart.sql`
  return <div className="data-example focus-frame">
    <details className="quickstart-fixtures"><summary>{t('Prepare the same three images for either example', '先准备两种写法共用的三张图片')}</summary>
      <p>{t('Save as prepare_images.py and run python3 prepare_images.py once in your working directory.', '保存为 prepare_images.py，在工作目录中执行一次 python3 prepare_images.py。')}</p>
      <CodeWindow filename="prepare_images.py" language="python" code={quickstartFixtures}/>
    </details>
    <CodeWindow key={language} filename={'quickstart.' + (language === 'python' ? 'py' : 'sql')}
      language={language} code={language === 'python' ? quickstartPython : quickstartSql}
      headerMeta={<CodeLanguageSwitch value={language} onChange={setLanguage}/>}/>
    <div className="quickstart-run"><p>{t('Save the query above, then run:', '保存上面的查询，然后运行：')}</p>
      <CodeWindow key={command} filename="terminal" language="bash" code={command}/>
    </div>
    <div className="quickstart-output"><span>{t('The same result, with either interface', '两种接口，得到相同结果')}</span>
      <div className="quickstart-table"><table><thead><tr>{['source_width', 'source_height', 'width', 'height'].map(name => <th key={name}>{name}</th>)}</tr></thead>
        <tbody>{[[640,480,224,224],[320,240,224,224]].map(row => <tr key={row[0]}>{row.map((value,i) => <td key={i}>{value}</td>)}</tr>)}</tbody></table></div>
      <p className="marketing-note">{t('The 64 × 64 image is filtered out before pixel decoding. Selected images become native IMAGE values, resized to 224 × 224.', '64 × 64 的图片在像素解码前被过滤。其余图片转为原生 IMAGE，并缩放至 224 × 224。')}</p>
    </div>
  </div>
}
