import { DOCS_SIDEBAR as DATA_SIDEBAR, type DocsSidebarGroup } from './registry'

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
  /** Doc tree for live products; coming-soon products have none. */
  sidebar?: DocsSidebarGroup[]
  /** Coming-soon teaser copy (only set for `soon` products). */
  desc?: string
  caps?: string[]
}

export const PRODUCTS: Record<ProductId, Product> = {
  data: {
    id: 'data',
    name: 'Vane Data',
    status: 'live',
    tagline: 'Multimodal-native data engine',
    sidebar: DATA_SIDEBAR,
  },
  agent: {
    id: 'agent',
    name: 'Vane Agent',
    status: 'soon',
    tagline: 'Production multimodal agents',
    desc: 'Production-grade multimodal agents backed by the Vane data engine — tools, memory, and retrieval built on the same SQL + Ray foundation that powers Vane Data.',
    caps: [
      'Multimodal tool calling',
      'Durable agent memory on Vane Data',
      'Streaming context windows',
      'One-line serving & observability',
    ],
  },
  rl: {
    id: 'rl',
    name: 'Vane RL',
    status: 'soon',
    tagline: 'RL for multimodal models',
    desc: 'Reinforcement learning for multimodal models — environments, reward models, and high-throughput rollouts running on the same distributed Ray runtime as the rest of Vane.',
    caps: [
      'Distributed rollouts on Ray',
      'Pluggable reward models',
      'Multimodal environments',
      'Checkpointing & evaluation',
    ],
  },
}

export const PRODUCT_ORDER: ProductId[] = ['data', 'rl', 'agent']
export const DEFAULT_PRODUCT: ProductId = 'data'

export function isProductId(value: string | undefined): value is ProductId {
  return Boolean(value && value in PRODUCTS)
}
