import {l} from './types'
export const marketingProducts = [
  {id: 'context', name: 'Vane Context', path: '/products/context',
    description: l('Traceable, reusable multimodal context for agents.', '为 Agent 提供可追溯、可复用的多模态上下文。'),
    action: l('Request a demo', '预约演示'), actionPath: '/demo?source=product-context'},
  {id: 'data', name: 'Vane Data', path: '/products/data',
    description: l('Build multimodal data pipelines with SQL and Python.', '用 SQL 和 Python 构建多模态数据处理流水线。'),
    action: l('Get started', '开始使用'), actionPath: '/docs/data/quickstart/quickstart'},
] as const
