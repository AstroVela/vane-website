/* Seven detailed use cases backed by the canonical scripts under vane/examples. */
import type {PixelIconName} from '../components/PixelIcon'

export type UseCase = {
  id: string
  icon: PixelIconName
  title: string
  titleZh: string
  tag: string
  tagZh: string
  pipeline: string[]
  pipelineZh: string[]
  problem: string
  problemZh: string
  input: string
  inputZh: string
  output: string
  outputZh: string
  when: string
  whenZh: string
  filename: string
  example: string
  code: string
}

export const USE_CASES = [
  {
    id: 'embeddings',
    icon: 'embeddings',
    title: 'Web Text to Embeddings',
    titleZh: '网页文本转嵌入',
    tag: 'embeddings',
    tagZh: 'embedding',
    pipeline: ['WARC rows', 'decode English pages', 'chunk text', 'vane.ai.embed', 'write files'],
    pipelineZh: ['WARC 行', '解码英文页面', '文本分块', 'vane.ai.embed', '写出文件'],
    problem:
      'Web crawl records need to be decoded, language-filtered, chunked, embedded, and written without losing their source IDs.',
    problemZh:
      '网页抓取记录需要经过解码、语言过滤、分块、嵌入和写出，同时保留稳定的来源 ID。',
    input: '5 built-in WARC-shaped records',
    inputZh: '5 条内置 WARC 形态记录',
    output: '3 English pages · 7 chunks · 384-d embeddings',
    outputZh: '3 个英文页面 · 7 个分块 · 384 维嵌入',
    when: 'Preparing retrieval or training data from Common Crawl WET/WARC input.',
    whenZh: '从 Common Crawl WET/WARC 输入准备检索或训练数据时使用。',
    filename: 'common_crawl.py',
    example: 'examples/common_crawl.py',
    code: `<span class="c"># Uses the default Ray runner</span>
<span class="f">python</span> examples/common_crawl.py`,
  },
  {
    id: 'search',
    icon: 'retrieval',
    title: 'Semantic Search',
    titleZh: '语义搜索',
    tag: 'retrieval',
    tagZh: '检索',
    pipeline: ['question rows', 'vane.ai.embed', 'split by score', 'cosine match', 'show'],
    pipelineZh: ['问题数据', 'vane.ai.embed', '按分数分组', '余弦匹配', '展示'],
    problem:
      'A bounded Q&A corpus needs an offline semantic-matching pass before you commit to a separate vector database.',
    problemZh:
      '在引入独立向量数据库前，可以先对有限问答语料完成一次离线语义匹配验证。',
    input: '6 built-in StackExchange-style questions',
    inputZh: '6 条内置 StackExchange 风格问题',
    output: '6 embeddings · 3 top semantic matches',
    outputZh: '6 条嵌入 · 3 条最佳语义匹配',
    when: 'Prototyping retrieval or related-question matching over a static corpus.',
    whenZh: '在静态语料上原型验证检索或相关问题匹配时使用。',
    filename: 'llms_red_pajamas.py',
    example: 'examples/llms_red_pajamas.py',
    code: `<span class="c"># Uses the default sample and model settings</span>
<span class="f">python</span> examples/llms_red_pajamas.py`,
  },
  {
    id: 'dedupe',
    icon: 'preprocessing',
    title: 'Text Deduplication',
    titleZh: '文本去重',
    tag: 'preprocessing',
    tagZh: '预处理',
    pipeline: ['normalize', 'MinHash', 'LSH candidates', 'components', 'keep one'],
    pipelineZh: ['标准化', 'MinHash', 'LSH 候选', '连通分量', '保留一条'],
    problem:
      'Near-duplicate text must be grouped reproducibly, with candidate pairs and cluster decisions available for inspection.',
    problemZh:
      '近重复文本需要以可复现方式分组，并保留可检查的候选对与聚类决策。',
    input: '10 built-in documents',
    inputZh: '10 条内置文档',
    output: '5 retained representatives + audit CSVs',
    outputZh: '5 条保留代表记录 + 审计 CSV',
    when: 'Cleaning text before tokenization, training, or embedding.',
    whenZh: '在分词、训练或嵌入前清洗文本时使用。',
    filename: 'minhash_dedupe.py',
    example: 'examples/minhash_dedupe.py',
    code: `<span class="c"># No model-specific dependency required</span>
<span class="f">python</span> examples/minhash_dedupe.py`,
  },
  {
    id: 'images',
    icon: 'vision',
    title: 'Image Pipelines',
    titleZh: '图像流水线',
    tag: 'vision',
    tagZh: '视觉',
    pipeline: ['image bytes', 'AnalyzeRedRegionsBatch', 'rank', 'save images', 'save masks'],
    pipelineZh: ['图像字节', 'AnalyzeRedRegionsBatch', '排序', '保存图像', '保存遮罩'],
    problem:
      'Image bytes need a batched decode-and-analysis path that preserves metadata and emits inspectable previews.',
    problemZh:
      '图像字节需要批量解码与分析，同时保留元数据并输出可检查的预览。',
    input: '5 generated sample images',
    inputZh: '5 张生成的样例图片',
    output: 'ranked metadata · PNG previews · red masks',
    outputZh: '排序元数据 · PNG 预览 · 红色区域遮罩',
    when: 'Validating image UDF batching and file outputs before adapting a real dataset.',
    whenZh: '在接入真实数据集前验证图像 UDF 批处理与文件输出时使用。',
    filename: 'querying_images.py',
    example: 'examples/querying_images.py',
    code: `<span class="c"># Pillow is the only example-specific dependency</span>
<span class="f">python</span> examples/querying_images.py`,
  },
  {
    id: 'imagegen',
    icon: 'generation',
    title: 'Image Generation',
    titleZh: '图像生成',
    tag: 'generation',
    tagZh: '生成',
    pipeline: ['prompt rows', 'GenerateImageFromTextBatch', 'PNG files', 'metadata CSV'],
    pipelineZh: ['提示词数据', 'GenerateImageFromTextBatch', 'PNG 文件', '元数据 CSV'],
    problem:
      'A prompt table needs a reproducible batched generation path and a manifest that keeps each image tied to its source row.',
    problemZh:
      '提示词表需要可复现的批量生成路径，并用清单把每张图片与来源行关联起来。',
    input: '4 built-in prompts',
    inputZh: '4 条内置提示词',
    output: '4 deterministic placeholder PNG files + metadata',
    outputZh: '4 张确定性占位 PNG + 元数据',
    when: 'Checking pipeline behavior locally before opting into a diffusion model and GPU.',
    whenZh: '在启用扩散模型和 GPU 前，本地检查流水线行为时使用。',
    filename: 'image_generation.py',
    example: 'examples/image_generation.py',
    code: `<span class="c"># Placeholder is the default backend</span>
<span class="f">python</span> examples/image_generation.py`,
  },
  {
    id: 'prompt',
    icon: 'multimodal',
    title: 'Prompt and Structured Output',
    titleZh: 'Prompt 与结构化输出',
    tag: 'AI functions',
    tagZh: 'AI 函数',
    pipeline: ['prompt+image row', 'vane.ai.prompt', 'typed STRUCT', 'raw response'],
    pipelineZh: ['提示词+图像行', 'vane.ai.prompt', '类型化 STRUCT', '原始响应'],
    problem:
      'Model responses need a row-preserving path for plain text, typed structured output, and optional raw provider data.',
    problemZh:
      '模型响应需要一条保持行数的路径，同时支持纯文本、类型化结构输出和可选的 provider 原始数据。',
    input: '1 prompt + image row + provider key',
    inputZh: '1 条提示词与图像记录 + provider 密钥',
    output: 'plain text · typed STRUCT · raw response JSON',
    outputZh: '纯文本 · 类型化 STRUCT · 原始响应 JSON',
    when: 'Adding reviewable model output to an existing Relation workflow.',
    whenZh: '在现有 Relation 工作流中增加可审查的模型输出时使用。',
    filename: 'basic_prompt.py',
    example: 'examples/basic_prompt.py',
    code: `<span class="k">export</span> OPENAI_API_KEY<span class="p">=</span>your_openai_key
VANE_RUNNER<span class="p">=</span>local <span class="f">python</span> examples/basic_prompt.py`,
  },
  {
    id: 'voice',
    icon: 'audio',
    title: 'Voice AI Analytics',
    titleZh: '语音 AI 分析',
    tag: 'audio',
    tagZh: '音频',
    pipeline: ['audio rows', 'transcribe', 'summarize', 'subtitle rows', 'vane.ai.embed'],
    pipelineZh: ['音频数据', '转写', '摘要', '字幕分段', 'vane.ai.embed'],
    problem:
      'Audio analytics combines transcription-level metadata with searchable embeddings for each subtitle segment.',
    problemZh:
      '音频分析需要把转写级元数据与每个字幕分段的可搜索嵌入组合起来。',
    input: '3 generated WAV samples',
    inputZh: '3 段生成的 WAV 样例',
    output: '3 transcripts/summaries · 6 embedded segments',
    outputZh: '3 条转写/摘要 · 6 个嵌入分段',
    when: 'Validating an audio-to-search pipeline before enabling Whisper or hosted summaries.',
    whenZh: '在启用 Whisper 或托管摘要前验证音频到检索流水线时使用。',
    filename: 'voice_ai_analytics.py',
    example: 'examples/voice_ai_analytics.py',
    code: `<span class="c"># Placeholder transcription; local summary; real embeddings</span>
<span class="f">python</span> examples/voice_ai_analytics.py`,
  },
] satisfies UseCase[]
