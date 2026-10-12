import {Link} from '../router'
import {pickLocale, useSiteLocale} from '../siteI18n'
import {CONTACT_EMAIL, CONTACT_MAILTO, DISCORD_URL, GITHUB_URL} from '../siteLinks'
import Mark from './Mark'
export default function Footer({home}: {home?: boolean} = {}) {
  const locale = useSiteLocale()
  const t = (en: string, zh: string) => pickLocale(locale, en, zh)
  return <footer className="site-footer" data-page={home ? 'home' : undefined}><div className="wrap">
    <div className="site-footer-grid">
      <div className="site-footer-brand"><Link className="brand" to="/"><Mark size={25}/><span className="wm">vane</span></Link><p className="mut">{t('Multimodal data. Usable context.', '多模态数据，可用的上下文。')}</p></div>
      <div><h4>{t('Products', '产品')}</h4><Link to="/products/context">Vane Context</Link><Link to="/products/data">Vane Data</Link><span className="footer-license">Vane Data · Apache-2.0</span></div>
      <div><h4>{t('Developers', '开发者')}</h4><Link to="/docs/context">{t('Context integration', 'Context 接入概览')}</Link><Link to="/docs/data">{t('Data documentation', 'Data 开发文档')}</Link><Link to="/docs/data/tutorials">{t('Data examples', 'Data 示例')}</Link><a href={GITHUB_URL} target="_blank" rel="noreferrer">Vane Data GitHub ↗</a></div>
      <div><h4>{t('Resources', '资源')}</h4><Link to="/solutions">{t('Use cases', '应用场景')}</Link><Link to="/blog">{t('Articles', '技术文章')}</Link><Link to="/benchmarks">{t('Data benchmarks', 'Data 基准测试')}</Link><Link to="/release-notes">{t('Data releases', 'Data 版本更新')}</Link></div>
      <div><h4>{t('Connect', '联系')}</h4><Link to="/demo?source=footer">{t('Request Demo', '预约演示')}</Link><a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a><a href={DISCORD_URL} target="_blank" rel="noreferrer">Data Discord ↗</a><Link to="/privacy">{t('Privacy', '隐私说明')}</Link></div>
    </div><div className="site-footer-bottom"><span>© 2026 AstroVela · Vane</span><span>{t('Built for multimodal work.', '为多模态工作而构建。')}</span></div>
  </div></footer>
}
