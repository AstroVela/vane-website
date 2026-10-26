import {l} from './types'

export const dataSolutions = [
  {id: 'training', path: '/solutions/training', product: 'Vane Data',
    name: l('Multimodal training data', '多模态训练数据'),
    summary: l('Prepare images, video and audio for training: filter, transform, label and export reproducible datasets with SQL and Python.', '用 SQL 与 Python 筛选、转换、标注图片、视频和音频，产出可复现的训练数据集。')},
  {id: 'enterprise-agent', path: '/solutions/enterprise-agent', product: 'Vane Data',
    name: l('Enterprise data pipelines', '企业多模态数据流水线'),
    summary: l('Turn enterprise files and media into structured, searchable records. Keep business identifiers and source references for your retrieval and agent applications.', '将企业文件与媒体整理成结构化、可检索的记录，保留业务标识与来源，供检索系统和 Agent 使用。')},
] as const
