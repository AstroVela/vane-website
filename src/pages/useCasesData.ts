/* Seven detailed use cases — Problem / Pipeline / Code / Input·Output / When /
   Example. Code is pre-highlighted markup, copied verbatim from the prototype. */
import type {PixelIconName} from '../components/PixelIcon'

export type UseCase = {
  id: string
  icon: PixelIconName
  title: string
  tag: string
  summary: string
  pipeline: string[]
  problem: string
  input: string
  output: string
  when: string
  filename: string
  example: string
  code: string
}

export const USE_CASES = [
  {
    id: 'embeddings',
    icon: 'embeddings',
    title: 'Web Text to Embeddings',
    tag: 'embeddings',
    summary: 'Clean Common Crawl pages, chunk text, and generate embeddings.',
    pipeline: ['read_parquet', 'filter SQL', 'chunk_text', 'embed_text', 'write_parquet'],
    problem:
      'Turning web-scale crawl dumps into clean, chunked embeddings usually means stitching SQL filtering, Python chunking, a GPU embedding model and Parquet output across separate systems.',
    input: '2.1 TB Common Crawl parquet',
    output: '480M chunk embeddings · 768-d',
    when: 'Building a retrieval corpus or a pretraining filter from raw crawl data.',
    filename: 'common_crawl.py',
    example: 'examples/common_crawl.py',
    code: `docs <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT url, text FROM read_parquet('s3://cc/*.parquet')"</span><span class="p">)</span>
chunks <span class="p">=</span> docs<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>chunk_text<span class="p">,</span> execution_backend<span class="p">=</span><span class="s">"ray_task"</span><span class="p">)</span>
emb <span class="p">=</span> <span class="f">embed_text</span><span class="p">(</span>chunks<span class="p">,</span> <span class="s">"text"</span><span class="p">,</span> provider<span class="p">=</span><span class="s">"transformers"</span><span class="p">,</span> batch_size<span class="p">=</span><span class="n">64</span><span class="p">)</span>
emb<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://corpus/embeddings/"</span><span class="p">)</span>`,
  },
  {
    id: 'search',
    icon: 'retrieval',
    title: 'Semantic Search',
    tag: 'retrieval',
    summary: 'Embed large text datasets and match related records.',
    pipeline: ['sql', 'embed_text', 'write index', 'cosine query'],
    problem:
      'You need an offline index of a large Q&A corpus and a way to match related records without standing up a vector DB just to experiment.',
    input: '14M StackExchange questions',
    output: 'top-k similar per query',
    when: 'Prototyping retrieval or near-duplicate matching over a static corpus.',
    filename: 'semantic_search.py',
    example: 'examples/semantic_search.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, title, body FROM read_parquet('s3://qa/*.parquet')"</span><span class="p">)</span>
idx <span class="p">=</span> <span class="f">embed_text</span><span class="p">(</span>rel<span class="p">,</span> <span class="s">"body"</span><span class="p">,</span> provider<span class="p">=</span><span class="s">"transformers"</span><span class="p">)</span>
idx<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://index/qa/"</span><span class="p">)</span>
hits <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id FROM 's3://index/qa/' ORDER BY cosine(vec,$q) LIMIT 10"</span><span class="p">)</span>`,
  },
  {
    id: 'dedupe',
    icon: 'preprocessing',
    title: 'Text Deduplication',
    tag: 'preprocessing',
    summary: 'Normalize text, compute MinHash signatures, and remove near-duplicates.',
    pipeline: ['normalize', 'minhash', 'lsh_bands (flat_map)', 'keep one'],
    problem:
      'Near-duplicate dedup at scale needs MinHash signatures and LSH bucketing wired into your data pipeline — not a one-off notebook.',
    input: '900M documents',
    output: '612M unique (32% removed)',
    when: 'Cleaning a training set before tokenization or embedding.',
    filename: 'minhash_dedupe.py',
    example: 'examples/minhash_dedupe.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, text FROM read_parquet('s3://raw/*.parquet')"</span><span class="p">)</span>
sig <span class="p">=</span> rel<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>minhash<span class="p">,</span> num_perm<span class="p">=</span><span class="n">128</span><span class="p">)</span>
buckets <span class="p">=</span> sig<span class="p">.</span><span class="f">flat_map</span><span class="p">(</span>lsh_bands<span class="p">,</span> bands<span class="p">=</span><span class="n">16</span><span class="p">)</span>
buckets<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>keep_one_per_cluster<span class="p">).</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://clean/"</span><span class="p">)</span>`,
  },
  {
    id: 'images',
    icon: 'vision',
    title: 'Image Pipelines',
    tag: 'vision',
    summary: 'Read, decode, analyze, and transform image data with batch UDFs.',
    pipeline: ['manifest sql', 'decode_image', 'DetectFeatures (actor)', 'write'],
    problem:
      'Decoding millions of images and running a vision model means juggling IO, CPU decode and GPU inference with the right batch sizes by hand.',
    input: '12M images',
    output: 'detections + CLIP features',
    when: 'Tagging, filtering, or feature-extracting a large image dataset.',
    filename: 'querying_images.py',
    example: 'examples/querying_images.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT path FROM read_parquet('s3://images/manifest.parquet')"</span><span class="p">)</span>
imgs <span class="p">=</span> rel<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>decode_image<span class="p">,</span> batch_size<span class="p">=</span><span class="n">128</span><span class="p">)</span>
feats <span class="p">=</span> imgs<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">DetectFeatures</span><span class="p">,</span> num_gpus<span class="p">=</span><span class="n">1</span><span class="p">,</span> batch_size<span class="p">=</span><span class="n">64</span><span class="p">)</span>
feats<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://features/"</span><span class="p">)</span>`,
  },
  {
    id: 'imagegen',
    icon: 'generation',
    title: 'Image Generation',
    tag: 'generation',
    summary: 'Run prompt-to-image generation across batches and GPUs.',
    pipeline: ['prompts sql', 'Diffusion (model actor)', 'write'],
    problem:
      'Generating images for a whole prompt table means managing a GPU model actor, batching, and writing results back — repeatedly.',
    input: '50K prompts',
    output: '50K images · 1024²',
    when: 'Synthetic-data generation or bulk creative rendering.',
    filename: 'image_generation.py',
    example: 'examples/image_generation.py',
    code: `prompts <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, prompt FROM read_parquet('s3://prompts.parquet')"</span><span class="p">)</span>
images <span class="p">=</span> prompts<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span>
    <span class="t">Diffusion</span><span class="p">,</span> num_gpus<span class="p">=</span><span class="n">1</span><span class="p">,</span> batch_size<span class="p">=</span><span class="n">16</span><span class="p">,</span> steps<span class="p">=</span><span class="n">30</span><span class="p">)</span>
images<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://generated/"</span><span class="p">)</span>`,
  },
  {
    id: 'multimodal',
    icon: 'multimodal',
    title: 'Multimodal Structured Output',
    tag: 'multimodal',
    summary: 'Run VLM evaluation with images, JSON responses, and judge passes.',
    pipeline: ['image+text sql', 'VLM (schema)', 'Judge', 'write'],
    problem:
      'Getting reliable structured fields out of a vision-language model — and grading them — needs schema enforcement plus a second judge pass.',
    input: '300K document images',
    output: 'typed JSON + judge score',
    when: 'Extracting structured data from documents or images at scale.',
    filename: 'multimodal_structured_outputs.py',
    example: 'examples/multimodal_structured_outputs.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, image, question FROM 's3://docs/*.parquet'"</span><span class="p">)</span>
ans <span class="p">=</span> rel<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">VLM</span><span class="p">,</span> schema<span class="p">=</span><span class="t">Receipt</span><span class="p">,</span> num_gpus<span class="p">=</span><span class="n">1</span><span class="p">)</span>
graded <span class="p">=</span> ans<span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">Judge</span><span class="p">,</span> batch_size<span class="p">=</span><span class="n">32</span><span class="p">)</span>
graded<span class="p">.</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://extracted/"</span><span class="p">)</span>`,
  },
  {
    id: 'voice',
    icon: 'audio',
    title: 'Voice AI Analytics',
    tag: 'audio',
    summary: 'Transcribe, summarize, subtitle, and embed audio segments.',
    pipeline: ['audio sql', 'Transcribe', 'Summarize', 'embed_text'],
    problem:
      'A voice-analytics pipeline chains transcription, summarization, captioning and embedding — each a different model, each needing batching on GPUs.',
    input: '120K call recordings',
    output: 'transcript · summary · embedding',
    when: 'Call analytics, meeting summaries, or audio search.',
    filename: 'voice_ai_analytics.py',
    example: 'examples/voice_ai_analytics.py',
    code: `rel <span class="p">=</span> conn<span class="p">.</span><span class="f">sql</span><span class="p">(</span><span class="s">"SELECT id, audio FROM read_parquet('s3://calls/*.parquet')"</span><span class="p">)</span>
out <span class="p">=</span> <span class="p">(</span>rel
   <span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">Transcribe</span><span class="p">,</span> num_gpus<span class="p">=</span><span class="n">1</span><span class="p">)</span>
   <span class="p">.</span><span class="f">map_batches</span><span class="p">(</span><span class="t">Summarize</span><span class="p">,</span> batch_size<span class="p">=</span><span class="n">32</span><span class="p">))</span>
<span class="f">embed_text</span><span class="p">(</span>out<span class="p">,</span> <span class="s">"summary"</span><span class="p">).</span><span class="f">write_parquet</span><span class="p">(</span><span class="s">"s3://analytics/"</span><span class="p">)</span>`,
  },
] satisfies UseCase[]
