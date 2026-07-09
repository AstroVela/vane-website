import { DOCS_SIDEBAR as DATA_SIDEBAR, type DocsSidebarEntry } from './registry'
import type {SiteLocale} from '../siteI18n'

/* The product dimension layered on top of the existing single-product docs.
   `data` is shipped (`live`) and has a full doc tree; `agent` and `rl` are on
   the roadmap (`soon`) and render a single Coming-Soon teaser page — no doc
   tree. Keep this in sync with `vaneRoutes.ts`. */
export type ProductId = 'data' | 'agent' | 'rl'
export type ProductStatus = 'live' | 'soon'

export type Product = {
  id: ProductId
  name: string
  status: ProductStatus
  /** One-line description shown in the nav product menu. */
  tagline: string
  taglineZh: string
  /** Doc tree for live products; coming-soon products have none. */
  sidebar?: DocsSidebarEntry[]
  /** Coming-soon teaser copy (only set for `soon` products). */
  desc?: string
  descZh?: string
  caps?: string[]
  capsZh?: string[]
}

export const PRODUCTS: Record<ProductId, Product> = {
  data: {
    id: 'data',
    name: 'Vane Data',
    status: 'live',
    tagline: 'Multimodal-native data engine',
    taglineZh: '多模态原生数据引擎',
    sidebar: DATA_SIDEBAR,
  },
  agent: {
    id: 'agent',
    name: 'Vane Agent',
    status: 'soon',
    tagline: 'Production multimodal agents',
    taglineZh: '生产级多模态 Agent',
    desc: 'Production-grade multimodal agents backed by the Vane data engine — tools, memory, and retrieval built on the same SQL + Ray foundation that powers Vane Data.',
    descZh: '由 Vane 数据引擎支撑的生产级多模态 Agent。工具、记忆和检索都建立在与 Vane Data 相同的 SQL + Ray 基础之上。',
    caps: [
      'Multimodal tool calling',
      'Durable agent memory on Vane Data',
      'Streaming context windows',
      'One-line serving & observability',
    ],
    capsZh: [
      '多模态工具调用',
      '基于 Vane Data 的持久化 Agent 记忆',
      '流式上下文窗口',
      '一行代码完成服务化与可观测性',
    ],
  },
  rl: {
    id: 'rl',
    name: 'Vane RL',
    status: 'soon',
    tagline: 'RL for multimodal models',
    taglineZh: '面向多模态模型的强化学习',
    desc: 'Reinforcement learning for multimodal models — environments, reward models, and high-throughput rollouts running on the same distributed Ray runtime as the rest of Vane.',
    descZh: '面向多模态模型的强化学习：环境、奖励模型和 high-throughput rollout 与 Vane 其他部分运行在同一个分布式 Ray runtime 上。',
    caps: [
      'Distributed rollouts on Ray',
      'Pluggable reward models',
      'Multimodal environments',
      'Checkpointing & evaluation',
    ],
    capsZh: [
      '基于 Ray 的分布式 rollout',
      '可插拔奖励模型',
      '多模态环境',
      'Checkpoint 与评估',
    ],
  },
}

export const PRODUCT_ORDER: ProductId[] = ['data', 'rl', 'agent']
export const DEFAULT_PRODUCT: ProductId = 'data'

export function isProductId(value: string | undefined): value is ProductId {
  return Boolean(value && value in PRODUCTS)
}

export function productTagline(product: Product, locale: SiteLocale) {
  return locale === 'zh-CN' ? product.taglineZh : product.tagline
}

export function productDescription(product: Product, locale: SiteLocale) {
  return locale === 'zh-CN' ? product.descZh : product.desc
}

export function productCapabilities(product: Product, locale: SiteLocale) {
  return locale === 'zh-CN' ? product.capsZh : product.caps
}
