import {DOCS_SIDEBAR as DATA_SIDEBAR, type DocsSidebarEntry} from './registry'
import type {SiteLocale} from '../siteI18n'
export type ProductId = 'data' | 'context'
export type ProductStatus = 'live'
export type Product = {
  id: ProductId; name: string; status: ProductStatus
  tagline: string; taglineZh: string; sidebar?: DocsSidebarEntry[]
  desc?: string; descZh?: string; caps?: string[]; capsZh?: string[]
}
export const PRODUCTS: Record<'data', Product> = {
  data: {id:'data',name:'Vane Data',status:'live',tagline:'Multimodal data engine',taglineZh:'多模态数据引擎',sidebar:DATA_SIDEBAR},
}
export const PRODUCT_ORDER = ['data'] as const
export const DEFAULT_PRODUCT: ProductId = 'data'
export function isProductId(value: string | undefined): value is ProductId {return Boolean(value && value in PRODUCTS)}
export function productTagline(product: Product, locale: SiteLocale) {return locale === 'zh-CN' ? product.taglineZh : product.tagline}
export function productDescription(product: Product, locale: SiteLocale) {return locale === 'zh-CN' ? product.descZh : product.desc}
export function productCapabilities(product: Product, locale: SiteLocale) {return locale === 'zh-CN' ? product.capsZh : product.caps}
