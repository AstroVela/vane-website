import MarketingLayout from '../../components/MarketingLayout'
import {Link} from '../../router'
import {useSiteLocale} from '../../siteI18n'
export default function NotFound() {
  const locale=useSiteLocale(),t=(en:string,zh:string)=>locale==='en'?en:zh
  return <MarketingLayout noIndex title={t('Page not found','未找到页面')} description={t('Explore Vane Context and Vane Data.','了解 Vane Context 与 Vane Data。')}><section className="section"><div className="wrap"><span>404</span><h1 className="h1">{t('Page not found.','未找到此页面。')}</h1><p className="lead">{t('Explore our products or return to the homepage.','你可以了解我们的产品，或返回首页。')}</p><div className="not-found-products"><Link to="/products/context">Vane Context →</Link><Link to="/products/data">Vane Data →</Link><Link to="/">{t('Home','首页')} →</Link></div></div></section></MarketingLayout>
}
