import {ChevronDownIcon, HamburgerMenuIcon, Cross2Icon, MagnifyingGlassIcon} from '@radix-ui/react-icons'
import {useEffect, useRef, useState, useSyncExternalStore} from 'react'
import {useHistory, useLocation} from '@docusaurus/router'
import {Link} from '../router'
import {pickLocale, useSiteLocale} from '../siteI18n'
import {marketingProducts} from '../content/products'
import {agentUseCases, casePagePath} from '../content/useCases'
import {GITHUB_URL} from '../siteLinks'
import Mark from './Mark'
import CommandPalette from './CommandPalette'
import {OPEN_DOCS_MOBILE_NAV_EVENT} from '../docs/mobileNavigation'

type NavProps = {data?: boolean; ctaReveal?: boolean; ctaTo?: string; ctaHref?: string; withSearch?: boolean; withCta?: boolean}
export default function Nav({data = false, ctaTo, ctaHref, withSearch = false, withCta = true}: NavProps) {
  const locale = useSiteLocale()
  const {pathname} = useLocation()
  const history = useHistory()
  // The static render has no query string. React must apply the live URL after hydration.
  const queryAndHash = useSyncExternalStore(history.listen, () => window.location.search + window.location.hash, () => '')
  const [menu, setMenu] = useState<string | null>(null)
  const hoverMenu = useRef<string | null>(null)
  const [mobile, setMobile] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileTrigger = useRef<HTMLButtonElement>(null)
  const mobilePanel = useRef<HTMLDivElement>(null)
  const mobileDialog = useRef<HTMLDialogElement>(null)
  const t = (en: string, zh: string) => pickLocale(locale, en, zh)
  const isData = data || pathname.includes('/docs/data')
  const path = pathname.replace(/^\/zh-CN(?=\/|$)/, '') || '/'
  const localePath = (locale === 'en' ? '/zh-CN' + (path === '/' ? '' : path) : path) + queryAndHash
  const close = () => {hoverMenu.current = null; setMenu(null); setMobile(false)}
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (mobile || menu)) {
        const trigger = mobile ? mobileTrigger.current : navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="nav-${menu}"]`)
        setMenu(null); setMobile(false); trigger?.focus()
      }
      if (withSearch && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {e.preventDefault(); setSearchOpen(v => !v)}

    }
    const onDown = (e: PointerEvent) => {if (!navRef.current?.contains(e.target as Node)) setMenu(null)}
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onDown)
    return () => {document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown)}
  }, [mobile, menu, withSearch])
  useEffect(() => {
    if (!mobile) return
    const previousOverflow = document.body.style.overflow
    const trigger=mobileTrigger.current
    const dialog=mobileDialog.current
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    mobilePanel.current?.querySelector<HTMLElement>('button, a')?.focus()
    return () => {dialog?.close(); document.body.style.overflow = previousOverflow; trigger?.focus()}
  }, [mobile])
  const developers = [
    {to: '/docs/data', name: t('Vane Data docs', 'Vane Data 文档')},
    {to: '/docs/data/tutorials', name: t('Vane Data examples', 'Vane Data 代码示例')},
    {to: GITHUB_URL, name: 'Vane Data GitHub ↗'},
    {to: '/docs/context', name: t('Vane Context integration', 'Vane Context 接入概览')},
  ]
  const resources = [
    {to: '/blog', name: t('Articles', '技术文章')}, {to: '/benchmarks', name: t('Data benchmarks', 'Data 基准测试')},
    {to: '/release-notes', name: t('Data releases', 'Data 版本更新')}, {to: '/contact', name: t('Contact', '联系')},
  ]
  const dropdown = (id: string, label: string, items: {to: string; name: string; description?: string}[]) =>
    <div className="nav-dd" onMouseEnter={() => {if (menu !== id) {hoverMenu.current = id; setMenu(id)}}} onMouseLeave={e => {hoverMenu.current = null; if (!e.currentTarget.contains(document.activeElement)) setMenu(null)}} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {hoverMenu.current = null; setMenu(null)}}}>
      <button className="ddt" type="button" aria-expanded={menu === id} aria-controls={'nav-' + id} onClick={() => {const open = menu !== id || hoverMenu.current === id; hoverMenu.current = null; setMenu(open ? id : null)}}>{label}<ChevronDownIcon className="caret" aria-hidden="true" /></button>
      {menu === id && <div className="dd-pan res-pan" id={'nav-' + id}><div className="dd-card site-nav-dropdown">{items.map(item =>
        item.to.startsWith('https:') ? <a key={item.to} href={item.to} target="_blank" rel="noreferrer" onClick={close}>{item.name}</a> :
        <Link key={item.to} to={item.to} onClick={close}><strong>{item.name}</strong>{item.description && <small>{item.description}</small>}</Link>
      )}</div></div>}
    </div>
  const productLinks = marketingProducts.map(p => ({to: p.path, name: p.name, description: p.badge[locale] + ' · ' + p.description[locale]}))
  const useCaseLinks = [{to: '/solutions', name: t('All use cases', '全部应用场景')}, ...agentUseCases.map(item => ({to: casePagePath(item.id), name: item.name[locale]}))]
  return <>
    <header className="nav navbar site-nav" ref={navRef}>
      <div className="wrap nav-in">
        <Link className="brand" to="/"><Mark size={26} /><span className="wm">vane</span></Link>
        <nav className="nav-links" aria-label={t('Main navigation', '主导航')}>
          {dropdown('products', t('Products', '产品'), productLinks)}
          {dropdown('use-cases', t('Use cases', '应用场景'), useCaseLinks)}
          {dropdown('developers', t('Developers', '开发者'), developers)}
          {dropdown('resources', t('Resources', '资源'), resources)}
        </nav>
        <div className="nav-right">
          {withSearch && <><button type="button" className="nav-docs-menu" aria-label={t('Open documentation navigation', '打开文档导航')} aria-controls="docs-mobile-navigation" onClick={() => window.dispatchEvent(new Event(OPEN_DOCS_MOBILE_NAV_EVENT))}><HamburgerMenuIcon aria-hidden="true" /></button>
            <button type="button" className="nav-search" onClick={() => setSearchOpen(true)} aria-label={t('Search docs', '搜索文档')}><MagnifyingGlassIcon aria-hidden="true" /><span className="sl">{t('Search', '搜索')}</span><span className="kbd">⌘ K</span></button></>}
          <a className="nav-locale" href={localePath} lang={locale === 'en' ? 'zh-CN' : 'en'}>{locale === 'en' ? '中文' : 'EN'}</a>
          {withCta && (ctaHref ? <a className="btn btn-solid btn-sm nav-main-cta" href={ctaHref}>{t('Start using', '开始使用')} →</a> :
            <Link className="btn btn-solid btn-sm nav-main-cta" to={ctaTo ?? (isData ? '/docs/data/quickstart/quickstart' : '/demo?source=nav')}>{isData ? t('Start using', '开始使用') : t('Request Demo', '预约演示')} →</Link>)}
          <button ref={mobileTrigger} className="site-menu-toggle" type="button" aria-expanded={mobile} aria-controls="site-mobile-navigation" aria-label={t('Open menu', '打开菜单')} onClick={() => setMobile(true)}><HamburgerMenuIcon aria-hidden="true" /></button>
        </div>
      </div>
      {mobile && <dialog ref={mobileDialog} className="site-mobile-backdrop" aria-label={t('Navigation', '导航')} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}><div ref={mobilePanel} id="site-mobile-navigation" className="site-mobile-panel" onKeyDown={e=>{
          if(e.key!=='Tab')return
          const items=Array.from(mobilePanel.current?.querySelectorAll<HTMLElement>('a,button')??[]).filter(el=>el.getClientRects().length>0)
          const first=items[0],last=items.at(-1)
          if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
          else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
        }}>
        <button type="button" className="site-mobile-close" onClick={close}><Cross2Icon aria-hidden="true" />{t('Close', '关闭')}</button>
        <h3>{t('Products', '产品')}</h3>{productLinks.map(p => <Link to={p.to} key={p.to} onClick={close}><strong>{p.name}</strong><small>{p.description}</small></Link>)}
        <h3>{t('Use cases', '应用场景')}</h3>{useCaseLinks.map(item => <Link to={item.to} key={item.to} onClick={close}>{item.name}</Link>)}
        <h3>{t('Developers', '开发者')}</h3>{developers.map(p => p.to.startsWith('https:') ? <a href={p.to} key={p.to} target="_blank" rel="noreferrer">{p.name}</a> : <Link key={p.to} to={p.to} onClick={close}>{p.name}</Link>)}
        <h3>{t('Resources', '资源')}</h3>{resources.map(p => <Link key={p.to} to={p.to} onClick={close}>{p.name}</Link>)}
        <Link to={ctaTo ?? '/demo?source=nav'} className="btn btn-solid" onClick={close}>{t('Request Demo', '预约演示')} →</Link>
      </div></dialog>}
    </header>
    {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
  </>
}
