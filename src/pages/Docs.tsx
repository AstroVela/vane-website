import {Redirect} from '@docusaurus/router'
import Head from '@docusaurus/Head'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import MarketingLayout from '../components/MarketingLayout'
import Box from '../components/Box'
import Button from '../components/Button'
import {Link,useRouter} from '../router'
import {useSiteLocale} from '../siteI18n'
import {resolveLegacyDocSlug} from '../docs/legacySlugs'
import {GITHUB_URL} from '../siteLinks'

function RedirectFallback({to}: {to:string}) {
  const locale=useSiteLocale(),{siteConfig}=useDocusaurusContext()
  return <><Head><meta httpEquiv="refresh" content={`0;url=${to}`}/><meta name="robots" content="noindex,follow"/><link rel="canonical" href={new URL(to,siteConfig.url).href}/></Head><main className="doc"><h1>{locale==='en'?'Opening the current Vane Data documentation.':'正在打开当前 Vane Data 文档。'}</h1><Link to={to}>{locale==='en'?'Open current page':'打开当前页面'}</Link></main><Redirect to={to}/></>
}
export default function Docs() {
  const locale=useSiteLocale(),{path}=useRouter(),t=(en:string,zh:string)=>locale==='en'?en:zh
  const normalized=path.replace(/^\/zh-CN(?=\/|$)/,'').replace(/\/$/,'')
  const slug=normalized.replace(/^\/docs\/(data\/)?/,'')
  const canonical=resolveLegacyDocSlug(slug)??slug
  const to=useBaseUrl(canonical==='index'?'/docs/data':'/docs/data/'+canonical)
  if(normalized!=='/docs') return <RedirectFallback to={to}/>
  return <MarketingLayout title={t('Developer resources','开发者资源')} description={t('Start with the open source Vane Data engine or explore commercial Vane Context integration.','开始使用开源 Vane Data 引擎，或了解商业版 Vane Context 接入。')}>
    <section className="docs-product-intro"><div className="wrap"><h1 className="h1">{t('Build with Vane.','用 Vane 构建。')}</h1><p className="lead">{t('Choose the product that fits your application.','选择适合你应用的产品。')}</p><div className="marketing-two-grid">
      <Box className="product-card"><span className="product-badge">{t('Commercial','商业产品')}</span><h3>Vane Context</h3><p>{t('Search, analyze and reference multimodal evidence through API, SDK or MCP.','通过 API、SDK 和 MCP 检索、分析和引用多模态资料。')}</p><div className="marketing-actions"><Button solid to="/docs/context">{t('Integration overview','接入概览')}</Button><Link to="/demo?source=developer">{t('Request Demo','预约演示')} →</Link></div></Box>
      <Box className="product-card"><span className="product-badge">{t('Open source · Apache-2.0','开源 · Apache-2.0')}</span><h3>Vane Data</h3><p>{t('Install the engine, run an example and build SQL + Python media pipelines.','安装引擎、运行示例，构建 SQL + Python 媒体处理流水线。')}</p><div className="marketing-actions"><Button solid to="/docs/data/quickstart/quickstart">{t('Quickstart','快速入门')}</Button><Link to="/docs/data/tutorials">{t('Examples','示例')}</Link><a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a></div></Box>
    </div></div></section>
  </MarketingLayout>
}
