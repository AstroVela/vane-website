import Head from '@docusaurus/Head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import EnterpriseContextAnimation from '../components/EnterpriseContextAnimation'
import { pickLocale, type SiteLocale, useSiteLocale } from '../siteI18n'
import { ENTERPRISE_DESIGN_PARTNER_MAILTO } from '../siteLinks'

const AUDIO_CODE = `-- Adapted excerpt: the tutorial registers transcribe_audio in prepare.py.
WITH recordings AS (
    SELECT regexp_extract(f.url, '([^/]+)[.]wav$', 1) AS ticket_id,
           audio_file(file(f.url, NULL, NULL, NULL, NULL)) AS audio
    FROM list_files('./recordings/*.wav') AS f
), transcripts AS (
    SELECT ticket_id, audio.url AS source_uri,
           transcribe_audio(audio) AS segments_json
    FROM recordings
), segments AS (
    SELECT ticket_id, source_uri,
           unnest(from_json(segments_json,
               '[{"segment_id":"INTEGER","text":"VARCHAR","start_ms":"BIGINT","end_ms":"BIGINT"}]'
           )) AS segment
    FROM transcripts
)
SELECT ticket_id, segment.segment_id AS segment_id,
       segment.text AS text, source_uri,
       segment.start_ms AS start_ms, segment.end_ms AS end_ms,
       ai_embed(
           segment.text, provider := 'transformers',
           model := 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
           dimensions := 384, on_error := 'raise',
           options := struct_pack(normalize := true, actor_number := 1, batch_size := 16)
       ) AS embedding
FROM segments
WHERE length(trim(segment.text)) > 0;`

const AUDIO_SUPPORT_DOC =
  '/docs/data/tutorials/use-cases/audio-support-doris-search'

function Divider() {
  return <div className="wrap"><div className="ddiv" /></div>
}

function MiniNode({ children }: { children: string }) {
  return <span className="enterprise-node">{children}</span>
}

function Motif({ compact = false, locale }: { compact?: boolean; locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      source: 'messy materials',
      target: 'searchable records',
    },
    {
      source: '复杂材料',
      target: '可检索记录',
    },
  )

  return (
    <div className={compact ? 'enterprise-motif compact' : 'enterprise-motif'}>
      <span>{copy.source}</span>
      <b>→</b>
      <span>{copy.target}</span>
    </div>
  )
}

function ProblemDiagram({ locale }: { locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      before: 'BEFORE — a fragmented chain',
      steps: ['Messy Materials', 'OCR scripts', 'Temp files', 'LLM calls', 'More scripts', 'SQL rules', 'Manual review'],
      warning: '⚠ scattered systems · glue code everywhere · lost source references · hard to debug · poor reproducibility',
      after: 'AFTER — one pipeline',
      messy: 'Messy Materials',
      facts: 'Searchable Records',
      outputs: 'text · source references · embeddings',
    },
    {
      before: '之前 — 碎片化链路',
      steps: ['杂乱材料', 'OCR 脚本', '临时文件', 'LLM 调用', '更多脚本', 'SQL 规则', '人工审查'],
      warning: '⚠ 系统分散 · 到处是 glue code · 来源引用丢失 · 难以调试 · 可复现性差',
      after: '之后 — 一条流水线',
      messy: '杂乱材料',
      facts: '可检索记录',
      outputs: '文本 · 来源引用 · 向量',
    },
  )

  return (
    <div className="enterprise-problem-grid">
      <Box flat className="enterprise-chain">
        <h3>{copy.before}</h3>
        <div className="enterprise-steps">
          {copy.steps.map((step, index) => (
            <div className="enterprise-step" key={step}>
              <span>{step}</span>
              {index < 6 && <b>↓</b>}
            </div>
          ))}
        </div>
        <p>{copy.warning}</p>
      </Box>
      <Box flat className="enterprise-chain after">
        <h3>{copy.after}</h3>
        <div className="enterprise-after-flow">
          <MiniNode>{copy.messy}</MiniNode>
          <b>↓</b>
          <span className="enterprise-vane-node">VANE</span>
          <b>↓</b>
          <MiniNode>{copy.facts}</MiniNode>
          <em>{copy.outputs}</em>
        </div>
        <Motif compact locale={locale} />
      </Box>
    </div>
  )
}

/* Each card shares one shape: input chips converge (↓) into the dark result
   chip, so the three read as a matched set at any column width. STEP 02 adds a
   muted field list under its result (the columns the review row keeps). */
const HOW_CARDS: Array<{
  title: string
  titleZh: string
  copy: string
  copyZh: string
  inputs: string[]
  inputsZh: string[]
  result: string
  resultZh: string
  fields?: string
  fieldsZh?: string
}> = [
  {
    title: 'Process native file types with SQL and UDFs',
    titleZh: '用 SQL 和 UDF 处理原生文件类型',
    copy: 'Start with FILE, IMAGEFILE, AUDIOFILE, or VIDEOFILE references. Combine media operators, SQL, and Python UDFs; parsing, OCR, and transcription use the libraries and models you configure.',
    copyZh: '从 FILE、IMAGEFILE、AUDIOFILE 或 VIDEOFILE 引用开始，组合媒体算子、SQL 和 Python UDF；解析、OCR 和转写由你配置的库与模型完成。',
    inputs: ['native files', 'media operators', 'Python UDFs'],
    inputsZh: ['原生文件类型', '媒体算子', 'Python UDF'],
    result: 'relation pipeline',
    resultZh: '关系流水线',
  },
  {
    title: 'Make source references part of the output',
    titleZh: '把来源引用保留到最终结果里',
    copy: 'Select business IDs, source URIs, and segment timestamps alongside text and embeddings. Keep model classifications separate from review status so downstream users can check the source.',
    copyZh: '在输出文本和向量时同时选择业务 ID、来源 URI 和片段时间戳。将模型分类与人工复核状态分开保存，便于下游用户核对原始材料。',
    inputs: ['model output'],
    inputsZh: ['模型输出'],
    result: 'source-linked record',
    resultZh: '带来源引用的记录',
    fields: 'business ID · source URI · timestamps',
    fieldsZh: '业务 ID · 来源 URI · 时间戳',
  },
  {
    title: 'Write to your retrieval and analytics systems',
    titleZh: '写入现有检索与分析系统',
    copy: 'Use distributed upsert sinks for Milvus and Qdrant, or Arrow Stream Load writes to Doris. Configure the destination schema, credentials, and embedding dimensions for your system.',
    copyZh: '通过分布式 sink 向 Milvus、Qdrant 执行 upsert，或用 Arrow Stream Load 写入 Doris。按目标系统配置表结构、凭据和向量维度。',
    inputs: ['text + embeddings', 'source references'],
    inputsZh: ['文本与向量', '来源引用'],
    result: 'Milvus · Qdrant · Doris',
    resultZh: 'Milvus · Qdrant · Doris',
  },
]

function HowVaneWorks({ locale }: { locale: SiteLocale }) {
  return (
    <div className="enterprise-how-grid">
      {HOW_CARDS.map((card, index) => (
        <Box className="enterprise-how-card" key={card.title}>
          <div className="enterprise-how-head">
            <span className="enterprise-how-step">STEP {String(index + 1).padStart(2, '0')}</span>
            <h3>{pickLocale(locale, card.title, card.titleZh)}</h3>
          </div>
          <div className="enterprise-how-viz-wrap">
            <div className="ehow-viz">
              <div className="ehow-inputs">
                {pickLocale(locale, card.inputs, card.inputsZh).map((input) => (
                  <span className="ehow-chip" key={input}>{input}</span>
                ))}
              </div>
              <b className="ehow-arrow" aria-hidden="true">↓</b>
              <span className="ehow-chip is-out">{pickLocale(locale, card.result, card.resultZh)}</span>
              {card.fields && <span className="ehow-note">{pickLocale(locale, card.fields, card.fieldsZh ?? card.fields)}</span>}
            </div>
          </div>
          <p>{pickLocale(locale, card.copy, card.copyZh)}</p>
        </Box>
      ))}
    </div>
  )
}

const DOC_ROWS_EN = [
  { id: 'T1024', text: 'WAV', src: 'T1024.wav' },
  { id: 'T1025', text: 'WAV', src: 'T1025.wav' },
  { id: 'T1026', text: 'WAV', src: 'T1026.wav' },
]
const DOC_ROWS_ZH = [
  { id: 'T1024', text: 'WAV', src: 'T1024.wav' },
  { id: 'T1025', text: 'WAV', src: 'T1025.wav' },
  { id: 'T1026', text: 'WAV', src: 'T1026.wav' },
]
const PIPELINE_STAGES_EN = ['FILE → AUDIOFILE', 'transcription UDF', 'text → embeddings']
const PIPELINE_STAGES_ZH = ['FILE → AUDIOFILE', '转写 UDF', '文本 → 向量']
// Keep output labels aligned with the columns produced by AUDIO_CODE.
const AUDIT_OUTPUTS_EN = ['segment text', 'source URI + timestamps', '384-d embeddings']
const AUDIT_OUTPUTS_ZH = ['片段文本', '来源 URI 与时间戳', '384 维向量']

/* Recordings flow through native file references, a transcription
   UDF, and embeddings. The tutorial writes the resulting records to Doris. */
function ExamplePipelineDiagram({ locale }: { locale: SiteLocale }) {
  const copy = pickLocale(
    locale,
    {
      parsed: 'Support recordings',
      pipeline: 'Vane · one pipeline',
      outputs: 'Outputs',
      rows: DOC_ROWS_EN,
      stages: PIPELINE_STAGES_EN,
      auditOutputs: AUDIT_OUTPUTS_EN,
    },
    {
      parsed: '客服录音',
      pipeline: 'Vane · 一条流水线',
      outputs: '输出',
      rows: DOC_ROWS_ZH,
      stages: PIPELINE_STAGES_ZH,
      auditOutputs: AUDIT_OUTPUTS_ZH,
    },
  )

  return (
    <Box flat className="epd">
      <div className="epd-panel">
        <div className="epd-head">{copy.parsed}</div>
        <div className="epd-body epd-table">
          <div className="epd-row epd-row-head">
            <span>ticket_id</span>
            <span>format</span>
            <span>source_uri</span>
          </div>
          {copy.rows.map((row) => (
            <div className="epd-row" key={row.id}>
              <span>{row.id}</span>
              <span>{row.text}</span>
              <span>{row.src}</span>
            </div>
          ))}
        </div>
      </div>

      <b className="epd-arrow" aria-hidden="true">→</b>

      <div className="epd-panel epd-panel-vane">
        <div className="epd-head epd-head-vane">{copy.pipeline}</div>
        <div className="epd-body">
          {copy.stages.map((stage, index) => (
            <div className="epd-stage" key={stage}>
              <span className="epd-stage-n">{index + 1}</span>
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </div>

      <b className="epd-arrow" aria-hidden="true">→</b>

      <div className="epd-panel">
        <div className="epd-head">{copy.outputs}</div>
        <div className="epd-body">
          {copy.auditOutputs.map((out) => (
            <div className="epd-out" key={out}>{out}</div>
          ))}
        </div>
      </div>
    </Box>
  )
}

export default function EnterpriseAgentUseCase() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      title: 'Multimodal Data Infrastructure for Enterprise Agents — Vane',
      description: 'Process native multimodal file types with SQL and Python, preserve source references, and write text and embeddings to retrieval and analytics systems.',
      ogTitle: 'Turn multimodal business materials into searchable records.',
      ogDescription: 'Connect native file types, model processing, source references, and retrieval systems in one data pipeline.',
      eyebrow: 'Data Infrastructure for Enterprise Agents',
      heading: 'Turn multimodal business data into searchable records with source references.',
      lead: 'Process files, images, audio, and video with native types, SQL, and Python UDFs. Preserve business IDs and source references, then write text and embeddings to your retrieval and analytics systems.',
      runPipeline: 'Run the pipeline',
      requestDemo: 'Request a demo',
      meta: 'native file types · SQL + Python · vector and analytics sinks',
      problemEyebrow: 'The Problem',
      problemTitle: "Keep source context throughout model processing.",
      problemLead: 'Today that chain is stitched across OCR scripts, temp files, model calls, SQL jobs, and review tools.',
      how: 'How Vane Works',
      howTitle: 'From source files to searchable records — in one data pipeline.',
      example: 'Real Example',
      exampleTitle: 'Support recordings → searchable feedback in Doris',
      exampleLead: 'Adapted from the tutorial, this SQL constructs FILE and AUDIOFILE references, calls the tutorial’s transcription UDF, and embeds timestamped segments. The full tutorial supplies Python UDF registration, model setup, candidate classification, and DorisStreamLoadSink ingestion.',
      ctaTitle: 'Ready to prepare multimodal business data for retrieval and analysis?',
    },
    {
      title: '面向企业 Agent 的多模态数据基础设施 — Vane',
      description: '用 SQL 和 Python 处理原生多模态文件类型，保留来源引用，将文本与向量写入检索和分析系统。',
      ogTitle: '把多模态业务材料整理成可检索记录',
      ogDescription: '在一条数据流水线中连接原生文件类型、模型处理、来源引用与检索系统。',
      eyebrow: '面向企业 Agent 的数据基础设施',
      heading: '将多模态业务数据整理成带来源引用的可检索记录',
      lead: '用原生类型、SQL 和 Python UDF 处理文件、图像、音频与视频。保留业务 ID 和来源引用，再将文本与向量写入现有检索和分析系统。',
      runPipeline: '运行示例',
      requestDemo: '申请演示',
      meta: '原生文件类型 · SQL + Python · 向量与分析系统写入',
      problemEyebrow: '问题',
      problemTitle: '难点不只是调用模型，还在于保留完整的来源信息',
      problemLead: '如今这条链通常被拼接在 OCR 脚本、临时文件、模型调用、SQL 任务和审查工具之间。',
      how: 'Vane 如何工作',
      howTitle: '从源文件到可检索记录，在一条数据流水线中完成',
      example: '真实示例',
      exampleTitle: '客服录音 → Doris 中的可检索反馈',
      exampleLead: '这段根据教程简化的 SQL 构造 FILE 和 AUDIOFILE 引用，调用教程中的转写 UDF，为带时间戳的片段生成向量。完整教程包含 Python UDF 注册、模型配置、候选分类和 DorisStreamLoadSink 写入。',
      ctaTitle: '准备将多模态业务数据用于检索与分析？',
    },
  )

  return (
    <>
      <Head>
        <title>{copy.title}</title>
        <meta
          name="description"
          content={copy.description}
        />
        <meta property="og:title" content={copy.ogTitle} />
        <meta property="og:description" content={copy.ogDescription} />
      </Head>

      <Nav />

      {/* HERO — solutions intro archetype: editorial copy + primary actions,
          paired with the agent-context visual in the right rail. */}
      <section className="intro enterprise-hero">
        <div className="wrap enterprise-hero-grid">
          <div className="enterprise-hero-copy">
            <Eyebrow style={{ marginBottom: 20 }}>{copy.eyebrow}</Eyebrow>
            <h1 className="h1 enterprise-hero-title">{copy.heading}</h1>
            <p className="lead enterprise-hero-lead">
              {copy.lead}
            </p>
            <div className="enterprise-hero-actions">
              <Button solid to={AUDIO_SUPPORT_DOC} arrow>{copy.runPipeline}</Button>
              <Button href={ENTERPRISE_DESIGN_PARTNER_MAILTO} arrow>{copy.requestDemo}</Button>
            </div>
            <div className="enterprise-hero-meta">
              <Motif compact locale={locale} />
              <span>{copy.meta}</span>
            </div>
          </div>
          <div className="enterprise-hero-art">
            <EnterpriseContextAnimation />
          </div>
        </div>
      </section>

      <Divider />

      {/* THE PROBLEM */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.problemEyebrow}</Eyebrow>
            <h2 className="h2">{copy.problemTitle}</h2>
            <p className="lead">{copy.problemLead}</p>
          </div>
          <ProblemDiagram locale={locale} />
        </div>
      </section>

      <Divider />

      {/* HOW VANE WORKS */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.how}</Eyebrow>
            <h2 className="h2">{copy.howTitle}</h2>
          </div>
          <HowVaneWorks locale={locale} />
        </div>
      </section>

      <Divider />

      {/* REAL USE CASE */}
      <section className="section enterprise-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.example}</Eyebrow>
            <h2 className="h2">{copy.exampleTitle}</h2>
            <p className="lead">{copy.exampleLead}</p>
          </div>
          <ExamplePipelineDiagram locale={locale} />
          <div className="enterprise-code-block">
            <CodeWindow filename="audio_segments.sql" code={AUDIO_CODE} language="sql" />
          </div>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="section enterprise-section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta title={copy.ctaTitle}>
            <Button solid to={AUDIO_SUPPORT_DOC} arrow>{copy.runPipeline}</Button>
            <Button href={ENTERPRISE_DESIGN_PARTNER_MAILTO} arrow>{copy.requestDemo}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
