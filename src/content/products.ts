import {l} from './types'
export const marketingProducts = [
  {id: 'context', name: 'Vane Context', path: '/products/context',
    badge: l('Commercial product', '商业产品'),
    description: l('Useful context for agents, with less repeated processing.', '让 Agent 用好多模态资料，减少重复处理。'),
    action: l('Request Demo', '预约演示'), actionPath: '/demo?source=product-context'},
  {id: 'data', name: 'Vane Data', path: '/products/data',
    badge: l('Open source · Apache-2.0', '开源 · Apache-2.0'),
    description: l('Build efficient multimodal pipelines with SQL and Python.', '用 SQL 与 Python 构建高效的多模态数据流程。'),
    action: l('Start using', '开始使用'), actionPath: '/docs/data/quickstart/quickstart'},
] as const
