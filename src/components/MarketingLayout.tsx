import {MediaPlaybackProvider} from './showcase/MediaPlaybackProvider'
import {useEffect, useRef, type PropsWithChildren} from 'react'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import {useLocation} from '@docusaurus/router'
import Nav from './Nav'
import Footer from './Footer'
import {useSiteLocale} from '../siteI18n'
import '../useCases.css'
import '../contextShowcase.css'
export default function MarketingLayout({title, description, data = false, noIndex = false, ctaTo, children}: PropsWithChildren<{title: string; description: string; data?: boolean; noIndex?: boolean; ctaTo?: string}>) {
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return
    const sections = Array.from(main.current?.querySelectorAll<HTMLElement>('.marketing-section > .wrap, .marketing-final-cta > .wrap') ?? [])
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    }, {rootMargin: '0px 0px 40px 0px', threshold: 0.04})
    for (const section of sections) if (section.getBoundingClientRect().top > window.innerHeight) {
      section.classList.add('reveal-ready')
      observer.observe(section)
    }
    const revealAll = () => {if (motion.matches) sections.forEach(section => section.classList.add('is-revealed'))}
    motion.addEventListener('change', revealAll)
    return () => {observer.disconnect(); motion.removeEventListener('change', revealAll); sections.forEach(section => section.classList.remove('reveal-ready', 'is-revealed'))}
  }, [])
  const {siteConfig} = useDocusaurusContext()
  const {pathname} = useLocation()
  const locale = useSiteLocale()
  const path = pathname.replace(/^\/zh-CN(?=\/|$)/, '') || '/'
  const canonical = new URL(pathname, siteConfig.url).href
  return <MediaPlaybackProvider>
    <Head>
      <title>{title} | Vane</title><meta name="description" content={description} />
      <meta property="og:title" content={title + ' | Vane'} /><meta property="og:description" content={description} />
      <meta property="og:type" content="website" /><meta property="og:url" content={canonical} />
      <meta property="og:image" content={new URL('/showcase/marketing/comp_001-poster.45b2669dc293.webp', siteConfig.url).href} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_CN'} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={new URL(path, siteConfig.url).href} />
      <link rel="alternate" hrefLang="zh-CN" href={new URL('/zh-CN' + (path === '/' ? '' : path), siteConfig.url).href} />
      {noIndex && <meta name="robots" content="noindex,follow" />}
    </Head>
    <div className="marketing-site"><a className="skip-link" href="#main-content">{locale === 'en' ? 'Skip to content' : '跳到正文'}</a>
    <Nav data={data} ctaTo={ctaTo} />
    <main ref={main} id="main-content" className="marketing-main" tabIndex={-1}>{children}</main>
    <Footer /></div>
  </MediaPlaybackProvider>
}
