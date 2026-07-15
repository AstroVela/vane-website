import type {ReactNode} from 'react'
import CodeWindow from './CodeWindow'
import { pickLocale, useSiteLocale } from '../siteI18n'

const HERO_PIPELINE_CODE = `import vane
vane.configure(runner="ray")
con = vane.connect()

assets = con.sql("""
    SELECT asset_id, uri, media_type
    FROM read_parquet('s3://raw-assets/*.parquet')
    WHERE media_type IN ('image', 'video', 'audio')
""")

features = assets.map_batches(
    DecodeAndInfer,        # model loaded once per actor
    schema=feature_schema,
    gpus=1,
    actor_number=4,
)

features.write_parquet("s3://model-ready/features/")`

const MODALITIES = ['IMG', 'VID', 'AUD'] as const
const ACTORS = [1, 2, 3, 4] as const

function Stage({
  className,
  label,
  detail,
  children,
}: {
  className: string
  label: string
  detail: string
  children?: ReactNode
}) {
  return (
    <span className={`home-execution-stage ${className}`}>
      <small>{label}</small>
      <b>{detail}</b>
      {children}
    </span>
  )
}

function Connector({ className }: { className: string }) {
  return (
    <span className={`home-execution-link ${className}`}>
      <i />
      <i />
    </span>
  )
}

export default function HomeHeroExecution() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      eyebrow: 'Execution model',
      value: 'One relation. Overlapped multimodal decode, GPU inference, and I/O.',
      aria: 'Images, video, and audio flow through one relation. S3 scan, CPU decode, four reusable GPU actors, and Parquet write overlap through streaming, backpressure, and dynamic batching.',
    },
    {
      eyebrow: '执行模型',
      value: '一条 Relation，让多模态解码、GPU 推理与 I/O 重叠执行。',
      aria: '图像、视频和音频记录进入同一条 Relation。S3 扫描、CPU 解码、四个可复用 GPU actor 和 Parquet 写入通过 streaming、backpressure 与 dynamic batching 重叠执行。',
    },
  )

  return (
    <CodeWindow
      filename="multimodal_features.py"
      language="python"
      code={HERO_PIPELINE_CODE}
      headerMeta="RAY · 4 GPU ACTORS"
      afterCode={(
        <section className="home-hero-execution" aria-label={copy.aria}>
          <div className="home-execution-head" aria-hidden="true">
            <span>{copy.eyebrow}</span>
            <p>{copy.value}</p>
          </div>

          <div className="home-execution-modalities" aria-hidden="true">
            <small>INPUT</small>
            {MODALITIES.map((modality) => <span key={modality}>{modality}</span>)}
            <b>ONE RELATION</b>
          </div>

          <div className="home-execution-graph" aria-hidden="true">
            <Stage className="scan" label="S3 SCAN" detail="I/O" />
            <Connector className="scan-decode" />
            <Stage className="decode" label="CPU DECODE" detail="PYTHON / ARROW" />
            <Connector className="decode-infer" />
            <Stage className="infer" label="GPU INFER" detail="4 ACTORS">
              <span className="home-execution-actors">
                {ACTORS.map((actor) => <i key={actor} />)}
              </span>
            </Stage>
            <Connector className="infer-write" />
            <Stage className="write" label="PARQUET" detail="WRITE" />
          </div>

          <div className="home-execution-capabilities" aria-hidden="true">
            <span>STREAMING</span>
            <span>BACKPRESSURE</span>
            <span>DYNAMIC BATCHING</span>
          </div>
        </section>
      )}
    />
  )
}
