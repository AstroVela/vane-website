import {useCallback, useRef} from 'react'
import {ArrowRightIcon} from '@radix-ui/react-icons'
import useBaseUrl from '@docusaurus/useBaseUrl'
import MarketingLayout from '../components/MarketingLayout'
import HeroShowcase, {type HeroShowcaseHandle} from '../components/showcase/HeroShowcase'
import Button from '../components/Button'
import IntegrationExample from '../components/IntegrationExample'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {track} from '../analytics'
import {BENCHMARK_RESULTS} from '../benchmarkData'
import {GITHUB_URL} from '../siteLinks'
import type {MediaKind} from '../content/types'

export default function Home() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const controller = useRef<HeroShowcaseHandle | null>(null)
  const hero = useRef<HTMLElement>(null)
  const register = useCallback((value: HeroShowcaseHandle | null) => {controller.current = value}, [])
  const view = (kind: MediaKind, insight: string) => {
    controller.current?.select(kind, insight)
    hero.current?.scrollIntoView({block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'})
    hero.current?.querySelector<HTMLElement>('.showcase-stage')?.focus({preventScroll: true})
  }
  const poster = useBaseUrl('/showcase/marketing/comp_001-poster.45b2669dc293.webp')
  const image = useBaseUrl('/showcase/marketing/comp_005-image.b3187abe73e8.webp')
  return <MarketingLayout title={t('Multimodal context for AI', '让多模态资料成为 AI 可用的上下文')} description={t('Understand videos, images and audio. Find useful content and inspect its source with Vane Context. Build media pipelines with open source Vane Data.', '理解视频、图片与音频，定位可用信息并核对原始依据。通过 Vane Context 接入应用，或使用开源 Vane Data 构建处理流水线。')}>
    <section className="context-home-hero" ref={hero}><div className="wrap"><HeroShowcase onController={register} /></div></section>
    <section className="section marketing-section capability-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Understand the content.', '理解内容，')}<br />{t('Find what matters. Inspect the source.', '找到所需信息，核对每一处依据。')}</h2></div>
      <div className="capability-rows">
        <div className="capability-row"><div><h3>{t('Multimodal understanding', '多模态理解')}</h3><p>{t('Recognize objects, read the words in an image and understand spoken content.', '识别画面中的对象与文字，理解声音中表达的内容。')}</p></div><button className="result-teaser image-teaser" type="button" onClick={() => view('image', 'caption')}><img src={image} alt="" loading="lazy" /><span><span lang="nl">Aardbeien + Chocolade smoothie</span><strong>{t('Strawberry + chocolate smoothie', '草莓＋巧克力奶昔')}</strong><span className="teaser-action">{t('Inspect the source image', '核对原图')}<ArrowRightIcon /></span></span></button></div>
        <div className="capability-row"><div><h3>{t('The relevant moment', '内容定位')}</h3><p>{t('Go directly to the action or statement that answers your question.', '直接回到回答问题的动作或语句，省去反复翻看素材。')}</p></div><button className="result-teaser time-teaser" type="button" onClick={() => view('video', 'ingredients')}><span className="time-stamp">00:01–00:04</span><span><strong>{t('Pour the drink. Add ice.', '倒入饮料与冰块')}</strong><span className="teaser-action">{t('Watch the exact moment', '观看对应片段')}<ArrowRightIcon /></span></span></button></div>
        <div className="capability-row"><div><h3>{t('Evidence you can inspect', '依据可核验')}</h3><p>{t('Every insight leads back to the original words, image or video.', '每项理解都对应原始画面或原话，信息可用，也有据可查。')}</p></div><button className="result-teaser quote-teaser" type="button" onClick={() => view('audio', 'portable')}><span><span lang="en">“I can take it anywhere and blend smoothies anytime.”</span><span className="teaser-action">00:03–00:07 · {t('Listen to the source', '听原话')}<ArrowRightIcon /></span></span></button></div>
      </div>
    </div></section>
    <section className="section marketing-section products-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Choose where to start.', '选择适合你的起点。')}</h2><p>{t('A ready-to-integrate service, or the engine to build with.', '接入现成的上下文服务，或从引擎开始构建。')}</p></div>
      <div className="product-panels"><article className="product-panel context-panel"><span className="product-badge">{t('Commercial product', '商业产品')}</span><h3>Vane Context</h3><p>{t('Multimodal search, understanding and source references for your applications and agents.', '为应用与 Agent 提供多模态检索、理解与来源引用。')}</p><div className="product-visual context-visual"><img src={poster} alt="" loading="lazy" /><div><strong>{t('Pour the drink. Add ice.', '倒入饮料与冰块')}</strong><p>{t('A useful action, linked to its source.', '可用的动作信息，带原始画面依据。')}</p><span className="time-stamp">00:01–00:04</span></div></div><div className="product-features"><span>{t('Ingestion & understanding', '摄取与理解')}</span><span>{t('Search & analysis', '检索与分析')}</span><span>API · SDK · MCP</span></div><div className="marketing-actions"><Button solid to="/products/context" arrow>{t('Explore Vane Context', '了解 Vane Context')}</Button><Link to="/demo?source=home">{t('Request Demo', '预约演示')}</Link></div></article>
      <article className="product-panel data-panel"><span className="product-badge">{t('Open source · Apache-2.0', '开源 · Apache-2.0')}</span><h3>Vane Data</h3><p>{t('Build multimodal processing pipelines with SQL and Python, from your machine to Ray.', '用 SQL 与 Python 构建多模态数据处理流程，从本机扩展到 Ray。')}</p><div className="product-visual data-visual"><code>resize(decode_image_file(source, 'RGB'), 224, 224)</code><div><span>FILE → IMAGEFILE → IMAGE</span><strong>224 × 224</strong></div></div><div className="product-features"><span>{t('Native media types', '原生媒体类型')}</span><span>SQL + Python</span><span>{t('Extensible execution', '可扩展执行')}</span></div><div className="marketing-actions"><Button solid to="/docs/data/quickstart/quickstart" arrow onClick={() => track('data_docs_click', {product: 'data', locale})}>{t('Start using', '开始使用')}</Button><Link to="/products/data">{t('Explore product', '了解产品')}</Link></div></article></div>
      <p className="product-relationship">{t('Vane Context is built on Vane Data.', 'Vane Context 基于 Vane Data 构建。')}</p>
    </div></section>
    <section className="section marketing-section" id="scenarios"><div className="wrap"><div className="featured-use-case"><div className="featured-media"><img src={poster} alt={t('A real drink preparation video at a campsite.', '真实露营场景中的饮品制作视频。')} loading="lazy" /></div><div><span className="product-badge">Vane Context</span><h2 className="h2">{t('Turn existing assets into your next creative starting point.', '看懂已有素材，')}<br />{t('', '为下一次创作准备资料。')}</h2><p>{t('Research scenes, visual details and the words in advertising. Keep the clips, image regions and quotes that support your work.', '研究广告中的场景、画面信息与口头表达，获得可借鉴的片段、画面要点和关键原话。')}</p><Link className="arrow-link" to="/solutions/video-research">{t('Explore the marketing use case', '查看营销场景')}<ArrowRightIcon /></Link></div></div></div></section>
    <section className="section marketing-section integration-section"><div className="wrap"><div className="section-heading"><h2 className="h2">{t('Connect your existing applications and agents.', '接入你已有的应用和 Agent。')}</h2><p>{t('Keep your application’s workflow. Get the context it needs.', '保留应用的工作方式，获取它需要的上下文。')}</p></div><IntegrationExample compact />
      <div className="data-proof"><div><strong>Vane Data</strong><p>{t('Public code, runnable tutorials and reproducible media workloads.', '公开代码、可运行教程，以及可复现的媒体工作负载。')}</p><div className="proof-links"><a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a><Link to="/docs/data/tutorials">{t('Tutorials', '教程')} →</Link><Link to="/benchmarks">{t('Published benchmarks', '已发布基准')} →</Link></div></div><div className="proof-workloads">{BENCHMARK_RESULTS.map(r => <span key={r.id}>{r.id}<strong>{r.vaneSeconds}s</strong></span>)}</div></div>
    </div></section>
    <section className="section marketing-final-cta"><div className="wrap"><h2 className="h2">{t('Put your data to work.', '让你的资料进入实际工作。')}</h2><div className="marketing-actions"><Button solid to="/demo?source=home" arrow>{t('Request Demo', '预约演示')}</Button><Link to="/docs/data/quickstart/quickstart">{t('Start with Vane Data', '开始使用 Vane Data')}<ArrowRightIcon /></Link></div></div></section>
  </MarketingLayout>
}
