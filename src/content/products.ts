import {l} from './types'
export const marketingProducts = [
  {id: 'context', name: 'Vane Context', path: '/products/context',
    badge: l('Commercial product', '商业产品'),
    description: l('Find, understand and cite your multimodal data.', '检索、理解你的多模态资料，并返回可追溯的依据。'),
    action: l('Request Demo', '预约演示'), actionPath: '/demo?source=product-context'},
  {id: 'data', name: 'Vane Data', path: '/products/data',
    badge: l('Open source · Apache-2.0', '开源 · Apache-2.0'),
    description: l('Process multimodal data with SQL and Python. Scale from local to Ray.', '用 SQL 和 Python 处理多模态数据，从本机扩展到 Ray。'),
    action: l('Start using', '开始使用'), actionPath: '/docs/data/quickstart/quickstart'},
] as const
