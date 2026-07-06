import Box from './Box'
import { pickLocale, useSiteLocale } from '../siteI18n'

/* Three-pillar engine diagram: Data -> RL -> Agent with a feedback loop
   returning to Data, over the shared Vane Core runtime panel. */

type Tone = 'data' | 'rl' | 'agent'

type IconName =
  | 'picture'
  | 'video'
  | 'audio'
  | 'document'
  | 'code'
  | 'table'
  | 'gear'
  | 'database'
  | 'star'
  | 'molecule'
  | 'check'
  | 'chart'
  | 'globe'
  | 'robot'
  | 'person'
  | 'loop'
  | 'layers'
  | 'stream'
  | 'chip'
  | 'cloud'
  | 'local'
  | 'ray'

const PILLARS: Array<{
  tone: Tone
  number: string
  name: string
  status: 'Available now' | 'Coming soon'
  statusZh: string
  tagline: string
  taglineZh: string
  chips: string[]
  chipsZh: string[]
}> = [
  {
    tone: 'data',
    number: '1',
    name: 'Vane Data',
    status: 'Available now',
    statusZh: '现已可用',
    tagline: 'Unified multimodal data from any source.',
    taglineZh: '统一来自任意来源的多模态数据。',
    chips: ['Image', 'Video', 'Audio', 'Text', 'Documents', 'Events', 'Sensors', 'Tables'],
    chipsZh: ['图像', '视频', '音频', '文本', '文档', '事件', '传感器', '表格'],
  },
  {
    tone: 'rl',
    number: '2',
    name: 'Vane RL',
    status: 'Coming soon',
    statusZh: '即将推出',
    tagline: 'Train, evaluate, and align models across modalities.',
    taglineZh: '跨模态训练、评估并对齐模型。',
    chips: ['Rollout', 'Trajectory', 'Reward', 'Training', 'Evaluation'],
    chipsZh: ['Rollout', 'Trajectory', 'Reward', '训练', '评估'],
  },
  {
    tone: 'agent',
    number: '3',
    name: 'Vane Agent',
    status: 'Coming soon',
    statusZh: '即将推出',
    tagline: 'Act in the real world, solve tasks, create value.',
    taglineZh: '在真实世界中行动，完成任务，创造价值。',
    chips: ['Planning', 'Reasoning', 'Action', 'Feedback', 'Memory'],
    chipsZh: ['规划', '推理', '行动', '反馈', '记忆'],
  },
]

const CORE_FEATURES: Array<{ title: string; titleZh: string; copy: string; copyZh: string; icon: IconName }> = [
  {
    title: 'Unified Multimodal Data Type',
    titleZh: '统一的多模态数据类型',
    copy: 'Sensors, metadata, lineage, and model artifacts under one execution semantics.',
    copyZh: '传感器、元数据、lineage 和模型 artifact 使用同一套执行语义。',
    icon: 'layers',
  },
  {
    title: 'Streaming + Backpressure + Dynamic Batching',
    titleZh: 'Streaming + Backpressure + Dynamic Batching',
    copy: 'Continuous flow for large objects with adaptive batching and pressure control.',
    copyZh: '让大对象持续流动，并通过自适应 batching 和压力控制保持稳定。',
    icon: 'stream',
  },
  {
    title: 'Overlapped Heterogeneous Execution',
    titleZh: '重叠的异构执行',
    copy: 'CPU, GPU, IO, and model inference overlap through asynchronous scheduling.',
    copyZh: '通过异步调度重叠 CPU、GPU、IO 和模型推理。',
    icon: 'chip',
  },
  {
    title: 'Edge-Cloud Coordination',
    titleZh: '端云协同',
    copy: 'The same pipeline runs across local devices and Ray clusters.',
    copyZh: '同一条 pipeline 可运行在本地设备和 Ray 集群上。',
    icon: 'cloud',
  },
]

function MiniIcon({ name }: { name: IconName }) {
  switch (name) {
    case 'picture':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" />
          <circle cx="6" cy="7" r="1.1" />
          <path d="M3 12l3-2.5 2.2 1.8L11 8l2.5 2" />
        </svg>
      )
    case 'video':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" />
          <path d="M6.8 6.1 10.3 8l-3.5 1.9z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'audio':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 6.5v3M6 4.5v7M8.5 3v10M11 5.5v5M13.2 7v2" />
        </svg>
      )
    case 'document':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 2.5h4.3L12 6v7.5H4z" />
          <path d="M8.3 2.5V6H12" />
          <path d="M5.8 8.6h4.4M5.8 10.8h4.4" />
        </svg>
      )
    case 'code':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 4L2.5 8 6 12M10 4l3.5 4-3.5 4" />
        </svg>
      )
    case 'table':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="9" rx="1" />
          <path d="M2.5 7h11M8 3.5v9" />
        </svg>
      )
    case 'gear':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="2.4" />
          <path d="M8 2.6v2M8 11.4v2M2.6 8h2M11.4 8h2M4.2 4.2l1.4 1.4M10.4 10.4l1.4 1.4M11.8 4.2l-1.4 1.4M5.6 10.4l-1.4 1.4" />
        </svg>
      )
    case 'database':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <ellipse cx="8" cy="4" rx="4.5" ry="1.8" />
          <path d="M3.5 4v8c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8V4" />
          <path d="M3.5 8c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8" />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
          <path d="M8 5.2l.9 1.8 2 .3-1.45 1.4.35 2L8 9.75l-1.8.95.35-2L5.1 7.3l2-.3z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'molecule':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 3.5 11.9 5.75v4.5L8 12.5 4.1 10.25v-4.5z" />
          <circle cx="8" cy="3.5" r="1.1" className="pa-node" />
          <circle cx="11.9" cy="5.75" r="1.1" className="pa-node" />
          <circle cx="11.9" cy="10.25" r="1.1" className="pa-node" />
          <circle cx="8" cy="12.5" r="1.1" className="pa-node" />
          <circle cx="4.1" cy="10.25" r="1.1" className="pa-node" />
          <circle cx="4.1" cy="5.75" r="1.1" className="pa-node" />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
          <path d="M5.2 8.2l1.9 1.9 3.7-4.3" />
        </svg>
      )
    case 'chart':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 13V9.5M6.5 13V7M9.5 13V8.5M12.5 13V4.5" />
        </svg>
      )
    case 'globe':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="5.3" />
          <ellipse cx="8" cy="8" rx="2.4" ry="5.3" />
          <path d="M2.9 8h10.2" />
        </svg>
      )
    case 'robot':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="3.5" y="5" width="9" height="7.5" rx="1.5" />
          <path d="M8 2.6v2.4" />
          <circle cx="8" cy="2.3" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="6.2" cy="8.3" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="9.8" cy="8.3" r="0.85" fill="currentColor" stroke="none" />
          <path d="M6.3 10.5h3.4" />
        </svg>
      )
    case 'person':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="5.4" r="2.3" />
          <path d="M3.8 13c.5-2.7 2.2-4.1 4.2-4.1s3.7 1.4 4.2 4.1" />
        </svg>
      )
    case 'loop':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 7.3v-.6a2.7 2.7 0 0 1 2.7-2.7H14" />
          <path d="m11.3 1.3 2.7 2.7-2.7 2.7" />
          <path d="M14 8.7v.6a2.7 2.7 0 0 1-2.7 2.7H2" />
          <path d="m4.7 14.7-2.7-2.7 2.7-2.7" />
        </svg>
      )
    case 'layers':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2.5l5.5 2.7L8 7.9 2.5 5.2z" />
          <path d="M2.5 8.2L8 10.9l5.5-2.7" />
          <path d="M2.5 10.9L8 13.6l5.5-2.7" />
        </svg>
      )
    case 'stream':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 5h11M2.5 8h11M2.5 11h11" />
          <circle cx="10.2" cy="5" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="5.4" cy="8" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="8.4" cy="11" r="1.25" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'chip':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
          <rect x="6.7" y="6.7" width="2.6" height="2.6" />
          <path d="M6.5 2v2.5M9.5 2v2.5M6.5 11.5V14M9.5 11.5V14M2 6.5h2.5M2 9.5h2.5M11.5 6.5H14M11.5 9.5H14" />
        </svg>
      )
    case 'cloud':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 12h6a2.6 2.6 0 0 0 .4-5.2A3.6 3.6 0 0 0 4.6 7 2.6 2.6 0 0 0 5 12z" />
        </svg>
      )
    case 'local':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2" y="3" width="12" height="8" rx="1" />
          <path d="M6 13.5h4M8 11v2.5" />
        </svg>
      )
    case 'ray':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="3.5" cy="3.5" r="1.6" />
          <circle cx="12.5" cy="3.5" r="1.6" />
          <circle cx="8" cy="12.5" r="1.6" />
          <path d="M4.8 4.6 7 11M11.2 4.6 9 11M5 3.5h6" />
        </svg>
      )
  }
}

function PillarIcon({ tone }: { tone: Tone }) {
  switch (tone) {
    case 'data':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 4l11.5 5.7L16 15.4 4.5 9.7z" />
          <path d="M4.5 15.7L16 21.4l11.5-5.7" />
          <path d="M4.5 21.4L16 27.1l11.5-5.7" />
        </svg>
      )
    case 'rl':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 6.5l8.2 4.75v9.5L16 25.5l-8.2-4.75v-9.5z" />
          <circle cx="16" cy="6.5" r="2.1" className="pa-node" />
          <circle cx="24.2" cy="11.25" r="2.1" className="pa-node" />
          <circle cx="24.2" cy="20.75" r="2.1" className="pa-node" />
          <circle cx="16" cy="25.5" r="2.1" className="pa-node" />
          <circle cx="7.8" cy="20.75" r="2.1" className="pa-node" />
          <circle cx="7.8" cy="11.25" r="2.1" className="pa-node" />
        </svg>
      )
    case 'agent':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="7" y="9.5" width="18" height="15" rx="3.5" />
          <path d="M16 9.5V6.4" />
          <circle cx="16" cy="5.2" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="12.6" cy="15.8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="19.4" cy="15.8" r="1.5" fill="currentColor" stroke="none" />
          <path d="M12.8 20.4h6.4" />
        </svg>
      )
  }
}

function DashLink() {
  return (
    <svg className="pa-agent-dash" viewBox="0 0 40 14" aria-hidden="true">
      <path d="M2 11.5Q20 2 38 11.5" strokeDasharray="3 3.4" />
    </svg>
  )
}

/* One shared "stage" per pillar; only the connector idiom differs:
   Data = icon pool, RL = solid-arrow pipeline, Agent = dashed-link triad. */
function PillarArt({ tone }: { tone: Tone }) {
  if (tone === 'data') {
    return (
      <div className="pa-art pa-art-data" aria-hidden="true">
        <div>
          <MiniIcon name="picture" />
          <MiniIcon name="video" />
          <MiniIcon name="audio" />
          <MiniIcon name="document" />
        </div>
        <div>
          <MiniIcon name="code" />
          <MiniIcon name="table" />
          <MiniIcon name="gear" />
        </div>
      </div>
    )
  }
  if (tone === 'rl') {
    return (
      <div className="pa-art pa-art-rl" aria-hidden="true">
        <MiniIcon name="database" />
        <b>→</b>
        <MiniIcon name="star" />
        <b>→</b>
        <MiniIcon name="molecule" />
        <b>→</b>
        <MiniIcon name="check" />
        <b>→</b>
        <MiniIcon name="chart" />
      </div>
    )
  }
  return (
    <div className="pa-art pa-art-agent" aria-hidden="true">
      <MiniIcon name="globe" />
      <DashLink />
      <MiniIcon name="robot" />
      <DashLink />
      <MiniIcon name="person" />
    </div>
  )
}

export default function PlatformArchitecture() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      curated: 'Curated & versioned data',
      policies: <>Models &amp; policies<br />power agents</>,
      feedback: <>New data &amp; feedback<br />enrich the dataset</>,
      feedbackTitle: 'FEEDBACK LOOP',
      feedbackCopy: 'New data, outcomes, and feedback continuously improve the system.',
      outcomes: <>Actions &amp; outcomes<br />in the world</>,
      local: 'Local Runtime',
      ray: 'Ray Runtime',
    },
    {
      curated: '整理并版本化的数据',
      policies: <>模型与策略<br />驱动 Agent</>,
      feedback: <>新数据与反馈<br />丰富数据集</>,
      feedbackTitle: '反馈回路',
      feedbackCopy: '新数据、结果和反馈会持续改进系统。',
      outcomes: <>真实世界中的<br />动作与结果</>,
      local: '本地 Runtime',
      ray: 'Ray Runtime',
    },
  )

  return (
    <Box className="platform-arch">
      <div className="pa-arcs" aria-hidden="true">
        <div className="pa-arc pa-tone-data pa-arc-data">
          <span>{copy.curated}</span>
        </div>
        <div className="pa-arc pa-tone-rl pa-arc-rl">
          <span>{copy.policies}</span>
        </div>
      </div>

      <div className="pa-pillars">
        {PILLARS.map((pillar) => (
          <div className={`pa-pillar pa-tone-${pillar.tone}`} key={pillar.name}>
            <span className={`status-pill ${pillar.status === 'Available now' ? 'available' : 'soon'} pa-pillar-status`}>
              {pickLocale(locale, pillar.status, pillar.statusZh)}
            </span>
            <span className="pa-pillar-icon"><PillarIcon tone={pillar.tone} /></span>
            <div className="pa-pillar-name">
              <b>{pillar.number}</b>
              <h4>{pillar.name}</h4>
            </div>
            <p className="pa-pillar-tagline">{pickLocale(locale, pillar.tagline, pillar.taglineZh)}</p>
            <div className="pa-pillar-divider" />
            <div className="pa-chips">
              {pickLocale(locale, pillar.chips, pillar.chipsZh).map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <PillarArt tone={pillar.tone} />
          </div>
        ))}
      </div>

      <div className="pa-return">
        <div className="pa-return-path pa-tone-data pa-return-data" aria-hidden="true">
          <span>{copy.feedback}</span>
        </div>
        <div className="pa-feedback">
          <span className="pa-feedback-ico"><MiniIcon name="loop" /></span>
          <div>
            <h4>{copy.feedbackTitle}</h4>
            <p>{copy.feedbackCopy}</p>
          </div>
        </div>
        <div className="pa-return-path pa-tone-agent pa-return-agent" aria-hidden="true">
          <span>{copy.outcomes}</span>
        </div>
      </div>

      <div className="pa-core">
        <div className="pa-core-head">
          <h3>Vane Core</h3>
          <div className="pa-runtime-pills">
            <span><MiniIcon name="local" />{copy.local}</span>
            <b>+</b>
            <span><MiniIcon name="ray" />{copy.ray}</span>
          </div>
        </div>

        <div className="pa-core-features">
          {CORE_FEATURES.map((feature) => (
            <div className="pa-core-feature" key={feature.title}>
              <div className="pa-core-feature-head">
                <span className="pa-core-icon"><MiniIcon name={feature.icon} /></span>
                <h4>{pickLocale(locale, feature.title, feature.titleZh)}</h4>
              </div>
              <p>{pickLocale(locale, feature.copy, feature.copyZh)}</p>
            </div>
          ))}
        </div>
      </div>
    </Box>
  )
}
