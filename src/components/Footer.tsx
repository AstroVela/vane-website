import {Link} from '../router'
import {pickLocale, useSiteLocale} from '../siteI18n'
import {CONTACT_EMAIL, CONTACT_MAILTO, DISCORD_URL, GITHUB_URL} from '../siteLinks'
import Mark from './Mark'
export default function Footer({home}: {home?: boolean} = {}) {
  const locale = useSiteLocale()
  const t = (en: string, zh: string) => pickLocale(locale, en, zh)
  return <footer className="site-footer" data-page={home ? 'home' : undefined}><div className="wrap">
    <div className="site-footer-grid">
      <div className="site-footer-brand"><Link className="brand" to="/"><Mark size={25}/><span className="wm">vane</span></Link><p className="mut">{t('Multimodal data processing. Context for agents.', '多模态数据处理与 Agent 上下文。')}</p></div>
      <div><h4>{t('Products', '产品')}</h4><Link to="/products/context">Vane Context</Link><Link to="/products/data">Vane Data</Link></div>
      <div><h4>{t('Developers', '开发者')}</h4><Link to="/docs/data">{t('Vane Data documentation', 'Vane Data 文档')}</Link><Link to="/docs/data/tutorials">{t('Vane Data examples', 'Vane Data 示例')}</Link><a href={GITHUB_URL} target="_blank" rel="noreferrer">Vane Data GitHub ↗</a></div>
      <div><h4>{t('Resources', '资源')}</h4><Link to="/solutions">{t('Solutions', '解决方案')}</Link><Link to="/blog">{t('Blogs', '博客')}</Link><Link to="/benchmarks">{t('Vane Data benchmarks', 'Vane Data 性能测试')}</Link><Link to="/release-notes">{t('Release Notes', '版本更新')}</Link></div>
      <div><h4>{t('Connect', '联系')}</h4><Link to="/demo?source=footer">{t('Request a demo', '预约演示')}</Link><a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a><a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord ↗</a><Link to="/privacy">{t('Privacy policy', '隐私政策')}</Link></div>
    </div><div className="site-footer-bottom"><span>© 2026 AstroVela · Vane</span><span>{t('Built for multimodal data and agents.', '为多模态数据与 Agent 而构建。')}</span></div>
  </div></footer>
}
