import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export type SiteLocale = 'en' | 'zh-CN'

export function useSiteLocale(): SiteLocale {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext()

  return currentLocale === 'zh-CN' ? 'zh-CN' : 'en'
}

export function pickLocale<T>(locale: SiteLocale, en: T, zhCN: T): T {
  return locale === 'zh-CN' ? zhCN : en
}
