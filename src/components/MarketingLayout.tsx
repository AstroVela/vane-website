import {MediaPlaybackProvider} from './showcase/MediaPlaybackProvider'
import type {PropsWithChildren} from 'react'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import {useLocation} from '@docusaurus/router'
import Nav from './Nav'
import Footer from './Footer'
import {useSiteLocale} from '../siteI18n'
export default function MarketingLayout({title, description, data = false, noIndex = false, children}: PropsWithChildren<{title: string; description: string; data?: boolean; noIndex?: boolean}>) {
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
      <meta property="og:image" content={new URL('/showcase/marketing/comp_001-poster.webp', siteConfig.url).href} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_CN'} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={new URL(path, siteConfig.url).href} />
      <link rel="alternate" hrefLang="zh-CN" href={new URL('/zh-CN' + (path === '/' ? '' : path), siteConfig.url).href} />
      {noIndex && <meta name="robots" content="noindex,follow" />}
    </Head>
    <a className="skip-link" href="#main-content">{locale === 'en' ? 'Skip to content' : '跳到正文'}</a>
    <Nav data={data} />
    <main id="main-content" className="marketing-main" tabIndex={-1}>{children}</main>
    <Footer />
  </MediaPlaybackProvider>
}
