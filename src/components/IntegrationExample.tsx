import {useState} from 'react'
import {useSiteLocale} from '../siteI18n'
import CodeWindow from './CodeWindow'
import {Link} from '../router'

// Examples mirror the delivered contracts in docs/context/search and integration.
const examples = {
  HTTP: `curl "$CONTEXT_URL/v1/search" \\\n  -H "Authorization: Bearer $CONTEXT_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"collection":"product-media",
       "query":"show the blending steps",
       "top_k":3}'`,
  Python: `from vane_context import VaneContext, SearchRequest

with VaneContext(base_url=service_url, api_key=token) as client:
    result = client.search(SearchRequest(
        collection="product-media",
        query="show the blending steps",
        top_k=3,
    ))`,
  TypeScript: `import {VaneContext} from '@astrovela/vane-context'

const client = new VaneContext({baseUrl: serviceUrl, apiKey: token})
const found = await client.search({
  collection: 'product-media',
  query: 'show the blending steps',
  top_k: 3,
})`,
  MCP: `context_search({
  "request": {
    "collection": "product-media",
    "query": "show the blending steps",
    "top_k": 3
  }
})`,
}
const language = {HTTP: 'bash', Python: 'python', TypeScript: 'typescript', MCP: 'json'}
export default function IntegrationExample({compact = false}: {compact?: boolean}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [active, setActive] = useState<keyof typeof examples>('HTTP')
  const [sdk, setSdk] = useState<'Python' | 'TypeScript'>('Python')
  const options = compact ? ['HTTP', 'SDK', 'MCP'] : Object.keys(examples)
  const current = active === 'Python' || active === 'TypeScript' ? 'SDK' : active
  const select = (key: string) => setActive(key === 'SDK' ? sdk : key as keyof typeof examples)
  return <div className="integration-example"><div className="marketing-tabs" role="group" aria-label={t('Integration examples', '接入示例')}>
    {options.map(key => <button type="button" key={key} aria-pressed={compact ? current === key : active === key} onClick={() => select(key)}>{key === 'HTTP' && compact ? 'API' : key}</button>)}
    {compact && current === 'SDK' && <select aria-label={t('SDK language', 'SDK 语言')} value={sdk} onChange={e => {const value = e.target.value as typeof sdk; setSdk(value); setActive(value)}}><option>Python</option><option>TypeScript</option></select>}
  </div><CodeWindow key={active} filename={active === 'HTTP' ? 'search.sh' : active === 'MCP' ? 'context_search' : active === 'Python' ? 'search.py' : 'search.ts'} language={language[active]} code={examples[active]} />
    <p className="marketing-note">{t('Search returns relevant evidence and source references. Credentials are supplied with commercial delivery.', '检索返回相关证据与来源引用。服务凭证通过商业交付获得。')}</p><Link to="/docs/context/integration">{t('View integration contracts', '查看接入契约')} →</Link>
  </div>
}
