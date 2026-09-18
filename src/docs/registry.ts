import docsSidebar from './sidebar.data.json'
import type {SiteLocale} from '../siteI18n'

export type DocPage = {
  source: string
  title: string
  titleZh: string
}

export const DOCS_PAGES = {
  index: {
    source: 'docs/data/index.mdx',
    title: 'Overview',
    titleZh: '概览',
  },
  'quickstart/installation': {
    source: 'docs/data/quickstart/installation.mdx',
    title: 'Installation',
    titleZh: '安装',
  },
  'quickstart/quickstart': {
    source: 'docs/data/quickstart/quickstart.mdx',
    title: 'Quickstart',
    titleZh: '快速开始',
  },
  'concepts/sql-vs-python': {
    source: 'docs/data/concepts/sql-vs-python.mdx',
    title: 'SQL vs Python',
    titleZh: 'SQL 与 Python',
  },
  'concepts/udfs': {
    source: 'docs/data/concepts/udfs.mdx',
    title: 'UDFs',
    titleZh: 'UDF',
  },
  'concepts/ai-functions': {
    source: 'docs/data/concepts/ai-functions.mdx',
    title: 'AI Functions',
    titleZh: 'AI 函数',
  },
  tutorials: {
    source: 'docs/data/tutorials/index.mdx',
    title: 'Overview',
    titleZh: '概览',
  },
  'tutorials/examples/common-crawl': {
    source: 'docs/data/tutorials/examples/common-crawl.mdx',
    title: 'Working with Common Crawl',
    titleZh: '处理 Common Crawl 数据',
  },
  'tutorials/examples/minhash-dedupe': {
    source: 'docs/data/tutorials/examples/minhash-dedupe.mdx',
    title: 'MinHash Text Deduplication',
    titleZh: 'MinHash 文本去重',
  },
  'tutorials/examples/llms-red-pajamas': {
    source: 'docs/data/tutorials/examples/llms-red-pajamas.mdx',
    title: 'Semantic Search on Red Pajamas',
    titleZh: 'Red Pajamas 语义检索',
  },
  'tutorials/examples/querying-images': {
    source: 'docs/data/tutorials/examples/querying-images.mdx',
    title: 'Querying Image Data',
    titleZh: '查询图像数据',
  },
  'tutorials/examples/image-generation': {
    source: 'docs/data/tutorials/examples/image-generation.mdx',
    title: 'Generating Images from Text',
    titleZh: '从文本生成图像',
  },
  'tutorials/examples/voice-ai-analytics': {
    source: 'docs/data/tutorials/examples/voice-ai-analytics.mdx',
    title: 'Voice AI Analytics',
    titleZh: '语音 AI 分析',
  },
  'tutorials/examples/basic-prompt': {
    source: 'docs/data/tutorials/examples/basic-prompt.mdx',
    title: 'Basic Prompt',
    titleZh: '基础 Prompt',
  },
  'tutorials/use-cases/claims-disposition': {
    source: 'docs/data/tutorials/use-cases/claims-disposition.mdx',
    title: 'Claims Disposition from Multimodal Evidence',
    titleZh: '基于多模态证据的理赔处置',
  },
  'tutorials/use-cases/enterprise-agent-evidence': {
    source: 'docs/data/tutorials/use-cases/enterprise-agent-evidence.mdx',
    title: 'Governing Evidence for Enterprise Agents',
    titleZh: '企业 Agent 证据治理',
  },
  'tutorials/use-cases/multimodal-training-data': {
    source: 'docs/data/tutorials/use-cases/multimodal-training-data.mdx',
    title: 'Building a Multimodal Training Release',
    titleZh: '构建多模态训练数据发布集',
  },
  'tutorials/use-cases/procurement-compliance-audit': {
    source: 'docs/data/tutorials/use-cases/procurement-compliance-audit.mdx',
    title: 'Procurement Compliance Audit',
    titleZh: '采购合规审计',
  },
  'tutorials/use-cases/web-text-deduplication': {
    source: 'docs/data/tutorials/use-cases/web-text-deduplication.mdx',
    title: 'Web Text Deduplication with Global LSH',
    titleZh: '基于全局 LSH 的网页文本去重',
  },
  'reference/udf': {
    source: 'docs/data/reference/udf/index.mdx',
    title: 'UDF reference',
    titleZh: 'UDF API 参考',
  },
  'reference/udf/expression': {
    source: 'docs/data/reference/udf/expression/index.mdx',
    title: 'Expression UDFs',
    titleZh: 'Expression UDF',
  },
  'reference/udf/expression/vane-func': {
    source: 'docs/data/reference/udf/expression/vane-func.mdx',
    title: 'vane.func',
    titleZh: 'vane.func',
  },
  'reference/udf/expression/vane-func-batch': {
    source: 'docs/data/reference/udf/expression/vane-func-batch.mdx',
    title: 'vane.func.batch',
    titleZh: 'vane.func.batch',
  },
  'reference/udf/expression/vane-cls': {
    source: 'docs/data/reference/udf/expression/vane-cls.mdx',
    title: 'vane.cls',
    titleZh: 'vane.cls',
  },
  'reference/udf/expression/vane-cls-batch': {
    source: 'docs/data/reference/udf/expression/vane-cls-batch.mdx',
    title: 'vane.cls.batch',
    titleZh: 'vane.cls.batch',
  },
  'reference/udf/expression/vane-attach-function': {
    source: 'docs/data/reference/udf/expression/vane-attach-function.mdx',
    title: 'vane.attach_function',
    titleZh: 'vane.attach_function',
  },
  'reference/udf/expression/vane-detach-function': {
    source: 'docs/data/reference/udf/expression/vane-detach-function.mdx',
    title: 'vane.detach_function',
    titleZh: 'vane.detach_function',
  },
  'reference/udf/relation/relation-map': {
    source: 'docs/data/reference/udf/relation/relation-map.mdx',
    title: 'Relation.map',
    titleZh: 'Relation.map',
  },
  'reference/udf/relation/relation-flat-map': {
    source: 'docs/data/reference/udf/relation/relation-flat-map.mdx',
    title: 'Relation.flat_map',
    titleZh: 'Relation.flat_map',
  },
  'reference/udf/relation/relation-map-batches': {
    source: 'docs/data/reference/udf/relation/relation-map-batches.mdx',
    title: 'Relation.map_batches',
    titleZh: 'Relation.map_batches',
  },
  'reference/ai': {
    source: 'docs/data/reference/ai/index.mdx',
    title: 'AI Functions API reference',
    titleZh: 'AI 函数 API 参考',
  },
  'reference/ai/prompt': {
    source: 'docs/data/reference/ai/prompt.mdx',
    title: 'vane.ai.prompt',
    titleZh: 'vane.ai.prompt',
  },
  'reference/ai/embed': {
    source: 'docs/data/reference/ai/embed.mdx',
    title: 'vane.ai.embed',
    titleZh: 'vane.ai.embed',
  },
  'reference/ai/sql/ai-prompt': {
    source: 'docs/data/reference/ai/sql/ai-prompt.mdx',
    title: 'SQL ai_prompt',
    titleZh: 'SQL ai_prompt',
  },
  'reference/ai/sql/ai-embed': {
    source: 'docs/data/reference/ai/sql/ai-embed.mdx',
    title: 'SQL ai_embed',
    titleZh: 'SQL ai_embed',
  },
  'reference/media': {
    source: 'docs/data/reference/media/index.mdx',
    title: 'Media reference',
    titleZh: '媒体 API 参考',
  },
  'reference/media/image': {
    source: 'docs/data/reference/media/image/index.mdx',
    title: 'Image functions',
    titleZh: '图像函数',
  },
  'reference/media/image/image-file-metadata': {
    source: 'docs/data/reference/media/image/image-file-metadata.mdx',
    title: 'image_file_metadata',
    titleZh: 'image_file_metadata',
  },
  'reference/media/image/decode-image-file': {
    source: 'docs/data/reference/media/image/decode-image-file.mdx',
    title: 'decode_image_file',
    titleZh: 'decode_image_file',
  },
  'reference/media/image/decode-image': {
    source: 'docs/data/reference/media/image/decode-image.mdx',
    title: 'decode_image',
    titleZh: 'decode_image',
  },
  'reference/media/image/crop': {
    source: 'docs/data/reference/media/image/crop.mdx',
    title: 'crop',
    titleZh: 'crop',
  },
  'reference/media/image/resize': {
    source: 'docs/data/reference/media/image/resize.mdx',
    title: 'resize',
    titleZh: 'resize',
  },
  'reference/media/image/convert-image': {
    source: 'docs/data/reference/media/image/convert-image.mdx',
    title: 'convert_image',
    titleZh: 'convert_image',
  },
  'reference/media/image/encode-image': {
    source: 'docs/data/reference/media/image/encode-image.mdx',
    title: 'encode_image',
    titleZh: 'encode_image',
  },
  'reference/media/image/image-hash': {
    source: 'docs/data/reference/media/image/image-hash.mdx',
    title: 'image_hash',
    titleZh: 'image_hash',
  },
  'reference/media/image/image-to-tensor': {
    source: 'docs/data/reference/media/image/image-to-tensor.mdx',
    title: 'image_to_tensor',
    titleZh: 'image_to_tensor',
  },
  'reference/media/image/accessors': {
    source: 'docs/data/reference/media/image/accessors.mdx',
    title: 'Image accessors',
    titleZh: 'IMAGE 访问器',
  },
  'reference/media/audio': {
    source: 'docs/data/reference/media/audio/index.mdx',
    title: 'Audio functions',
    titleZh: '音频函数',
  },
  'reference/media/audio/audio-metadata': {
    source: 'docs/data/reference/media/audio/audio-metadata.mdx',
    title: 'audio_metadata',
    titleZh: 'audio_metadata',
  },
  'reference/media/audio/resample': {
    source: 'docs/data/reference/media/audio/resample.mdx',
    title: 'resample',
    titleZh: 'resample',
  },
  'reference/media/audio/native-audio-resample-profile': {
    source: 'docs/data/reference/media/audio/native-audio-resample-profile.mdx',
    title: 'native_audio_resample_profile',
    titleZh: 'native_audio_resample_profile',
  },
  'reference/media/video': {
    source: 'docs/data/reference/media/video/index.mdx',
    title: 'Video functions',
    titleZh: '视频函数',
  },
  'reference/media/video/video-metadata': {
    source: 'docs/data/reference/media/video/video-metadata.mdx',
    title: 'video_metadata',
    titleZh: 'video_metadata',
  },
  'reference/media/video/video-frames': {
    source: 'docs/data/reference/media/video/video-frames.mdx',
    title: 'video_frames',
    titleZh: 'video_frames',
  },
  'reference/media/video/video-keyframes': {
    source: 'docs/data/reference/media/video/video-keyframes.mdx',
    title: 'video_keyframes',
    titleZh: 'video_keyframes',
  },
  'reference/media/video/get-video-frame-by-idx': {
    source: 'docs/data/reference/media/video/get-video-frame-by-idx.mdx',
    title: 'get_video_frame_by_idx',
    titleZh: 'get_video_frame_by_idx',
  },
  'reference/media/video/read-video-frames': {
    source: 'docs/data/reference/media/video/read-video-frames.mdx',
    title: 'read_video_frames',
    titleZh: 'read_video_frames',
  },
  'reference/media/video/build-video-index': {
    source: 'docs/data/reference/media/video/build-video-index.mdx',
    title: 'build_video_index',
    titleZh: 'build_video_index',
  },
  'reference/media/video/video-index-info': {
    source: 'docs/data/reference/media/video/video-index-info.mdx',
    title: 'video_index_info',
    titleZh: 'video_index_info',
  },
  'reference/media/video/video-scan-stats': {
    source: 'docs/data/reference/media/video/video-scan-stats.mdx',
    title: 'video_scan_stats',
    titleZh: 'video_scan_stats',
  },
  'reference/file': {
    source: 'docs/data/reference/file/index.mdx',
    title: 'File functions',
    titleZh: '文件函数',
  },
  'reference/file/constructors': {
    source: 'docs/data/reference/file/constructors.mdx',
    title: 'File constructors',
    titleZh: '文件构造器',
  },
  'reference/file/inspection': {
    source: 'docs/data/reference/file/inspection.mdx',
    title: 'File inspection',
    titleZh: '文件检查',
  },
  'reference/file/identity': {
    source: 'docs/data/reference/file/identity.mdx',
    title: 'File identity',
    titleZh: '文件身份',
  },
  'reference/file/listing': {
    source: 'docs/data/reference/file/listing.mdx',
    title: 'File listing and reading',
    titleZh: '文件列举与读取',
  },
  'reference/types': {
    source: 'docs/data/reference/types.mdx',
    title: 'Multimodal types',
    titleZh: '多模态类型',
  },
  'reference/tensor': {
    source: 'docs/data/reference/tensor.mdx',
    title: 'Tensor functions',
    titleZh: '张量函数',
  },
  'deploy/deployment': {
    source: 'docs/data/deploy/deployment.mdx',
    title: 'Deployment',
    titleZh: '部署',
  },
  'contributing/development': {
    source: 'docs/data/contributing/development.mdx',
    title: 'Development',
    titleZh: '开发',
  },
} satisfies Record<string, DocPage>

export type DocSlug = keyof typeof DOCS_PAGES

export type DocsSidebarItem =
  | {
      slug: DocSlug
      label?: string
      key?: string
      to?: never
    }
  | {
      to: string
      label: string
      slug?: never
    }

export type DocsSidebarGroup = {
  group: string
  items: DocsSidebarEntry[]
}

export type DocsSidebarEntry = DocsSidebarItem | DocsSidebarGroup

export const DOCS_SIDEBAR = docsSidebar as DocsSidebarEntry[]

export function isDocsSidebarGroup(entry: DocsSidebarEntry): entry is DocsSidebarGroup {
  return 'group' in entry
}

function collectSidebarSlugs(entries: DocsSidebarEntry[]): DocSlug[] {
  return entries.flatMap((entry) =>
    isDocsSidebarGroup(entry)
      ? collectSidebarSlugs(entry.items)
      : entry.slug
        ? [entry.slug]
        : [],
  )
}

const sidebarSlugs = collectSidebarSlugs(DOCS_SIDEBAR)

if (process.env.NODE_ENV === 'development') {
  sidebarSlugs
    .filter((slug) => !DOCS_PAGES[slug])
    .forEach((slug) => console.warn(`docs sidebar: no page registered for slug "${slug}"`))
}

export const DOCS_ORDER = sidebarSlugs.filter((slug) => DOCS_PAGES[slug])
export const DEFAULT_DOC_SLUG: DocSlug = 'index'

export function isDocSlug(slug: string | undefined): slug is DocSlug {
  return Boolean(slug && slug in DOCS_PAGES)
}

const DOC_GROUP_LABELS_ZH: Record<string, string> = {
  'Getting Started': '快速开始',
  Concepts: '核心概念',
  Tutorials: '教程',
  Examples: '示例',
  'Use cases': '端到端用例',
  Reference: 'API 参考',
  UDFs: 'UDF',
  'AI Functions': 'AI 函数',
  Media: '媒体',
  'Expression UDFs': 'Expression UDF',
  'Relation UDFs': 'Relation UDF',
  Operations: '运维',
  Contributing: '贡献',
}

export function docPageTitle(slug: DocSlug, locale: SiteLocale) {
  const page = DOCS_PAGES[slug]
  return locale === 'zh-CN' ? page.titleZh : page.title
}

export function docGroupLabel(group: string, locale: SiteLocale) {
  return locale === 'zh-CN' ? DOC_GROUP_LABELS_ZH[group] ?? group : group
}

export function getDocGroupPath(slug: DocSlug) {
  const find = (entries: DocsSidebarEntry[], path: string[]): string[] | undefined => {
    for (const entry of entries) {
      if (isDocsSidebarGroup(entry)) {
        const nextPath = [...path, entry.group]
        const found = find(entry.items, nextPath)
        if (found) return found
      } else if (entry.slug === slug) {
        return path
      }
    }
    return undefined
  }

  return find(DOCS_SIDEBAR, [])
}

export function getDocGroup(slug: DocSlug) {
  return getDocGroupPath(slug)?.join(' / ')
}
