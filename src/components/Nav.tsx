import {ChevronDownIcon, HamburgerMenuIcon, Cross2Icon, MagnifyingGlassIcon} from '@radix-ui/react-icons'
import {useEffect, useRef, useState, useSyncExternalStore} from 'react'
import {useHistory, useLocation} from '@docusaurus/router'
import {Link} from '../router'
import {pickLocale, useSiteLocale} from '../siteI18n'
import {marketingProducts} from '../content/products'
import {agentUseCases, casePagePath} from '../content/useCases'
import {DISCORD_URL, GITHUB_REPO, GITHUB_URL} from '../siteLinks'
import {useGitHubStars} from './useGitHubStars'
import {dataSolutions} from '../content/dataSolutions'
import Mark from './Mark'
import CommandPalette from './CommandPalette'
import {OPEN_DOCS_MOBILE_NAV_EVENT} from '../docs/mobileNavigation'

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}


type NavProps = {data?: boolean; ctaReveal?: boolean; ctaTo?: string; ctaHref?: string; withSearch?: boolean; withCta?: boolean}
export default function Nav({withSearch = false}: NavProps) {
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
  const stars = useGitHubStars(GITHUB_REPO)
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
  ]
  const resources = [
    {to: '/blog', name: t('Blogs', '博客')}, {to: '/benchmarks', name: t('Vane Data benchmarks', 'Vane Data 性能测试')},
    {to: '/release-notes', name: t('Release Notes', '版本更新')}, {to: '/contact', name: t('Contact', '联系')},
  ]
  const dropdown = (id: string, label: string, items: {to: string; name: string; description?: string}[]) =>
    <div className="nav-dd" onMouseEnter={() => {if (menu !== id) {hoverMenu.current = id; setMenu(id)}}} onMouseLeave={e => {hoverMenu.current = null; if (!e.currentTarget.contains(document.activeElement)) setMenu(null)}} onBlurCapture={e => {if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {hoverMenu.current = null; setMenu(null)}}}>
      <button className="ddt" type="button" aria-expanded={menu === id} aria-controls={'nav-' + id} onClick={() => {const open = menu !== id || hoverMenu.current === id; hoverMenu.current = null; setMenu(open ? id : null)}}>{label}<ChevronDownIcon className="caret" aria-hidden="true" /></button>
      {menu === id && <div className="dd-pan res-pan" id={'nav-' + id}><div className="dd-card site-nav-dropdown">{items.map(item =>
        item.to.startsWith('https:') ? <a key={item.to} href={item.to} target="_blank" rel="noreferrer" onClick={close}>{item.name}</a> :
        <Link key={item.to} to={item.to} onClick={close}><strong>{item.name}</strong>{item.description && <small>{item.description}</small>}</Link>
      )}</div></div>}
    </div>
  const productLinks = marketingProducts.map(p => ({to: p.path, name: p.name, description: p.description[locale]}))
  const useCaseLinks = [{to: '/solutions', name: t('All solutions', '全部解决方案')}, ...agentUseCases.map(item => ({to: casePagePath(item.id), name: item.name[locale]})), ...dataSolutions.map(item => ({to: item.path, name: item.name[locale]}))]
  return <>
    <header className="nav navbar site-nav" ref={navRef}>
      <div className="wrap nav-in">
        <Link className="brand" to="/"><Mark size={26} /><span className="wm">vane</span></Link>
        <nav className="nav-links" aria-label={t('Main navigation', '主导航')}>
          {dropdown('products', t('Products', '产品'), productLinks)}
          {dropdown('use-cases', t('Solutions', '解决方案'), useCaseLinks)}
          {dropdown('developers', t('Developers', '开发者'), developers)}
          {dropdown('resources', t('Resources', '资源'), resources)}
        </nav>
        <div className="nav-right">
          {withSearch && <><button type="button" className="nav-docs-menu" aria-label={t('Open documentation navigation', '打开文档导航')} aria-controls="docs-mobile-navigation" onClick={() => window.dispatchEvent(new Event(OPEN_DOCS_MOBILE_NAV_EVENT))}><HamburgerMenuIcon aria-hidden="true" /></button>
            <button type="button" className="nav-search" onClick={() => setSearchOpen(true)} aria-label={t('Search docs', '搜索文档')}><MagnifyingGlassIcon aria-hidden="true" /><span className="sl">{t('Search', '搜索')}</span><span className="kbd">⌘ K</span></button></>}
          <a className="nav-discord" href={DISCORD_URL} target="_blank" rel="noreferrer" aria-label={t('Join Discord', '加入 Discord')}><DiscordIcon /></a>
          <a className="ghp" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label={t('Star Vane on GitHub', '在 GitHub 上为 Vane 点 Star')}><GitHubIcon /><span>Star</span>{stars && <b>{stars}</b>}</a>
          <Link className="nav-contact" to="/contact">{t('Contact us', '联系我们')}</Link>
          <a className="nav-locale" href={localePath} lang={locale === 'en' ? 'zh-CN' : 'en'} aria-label={t('Switch to Chinese', '切换到英文')}>{locale === 'en' ? '中文' : 'EN'}</a>
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
        <h3>{t('Solutions', '解决方案')}</h3>{useCaseLinks.map(item => <Link to={item.to} key={item.to} onClick={close}>{item.name}</Link>)}
        <h3>{t('Developers', '开发者')}</h3>{developers.map(p => p.to.startsWith('https:') ? <a href={p.to} key={p.to} target="_blank" rel="noreferrer">{p.name}</a> : <Link key={p.to} to={p.to} onClick={close}>{p.name}</Link>)}
        <h3>{t('Resources', '资源')}</h3>{resources.map(p => <Link key={p.to} to={p.to} onClick={close}>{p.name}</Link>)}
        <h3>{t('Community', '社区')}</h3><a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord ↗</a><a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub · Star ↗</a>
        <Link to="/contact" className="btn btn-solid" onClick={close}>{t('Contact us', '联系我们')} →</Link>
      </div></dialog>}
    </header>
    {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
  </>
}
