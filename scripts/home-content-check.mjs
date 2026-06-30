import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const home = readFileSync('src/pages/Home.tsx', 'utf8')
const platform = readFileSync('src/components/PlatformArchitecture.tsx', 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')
const cta = readFileSync('src/components/Cta.tsx', 'utf8')
const css = readFileSync('src/index.css', 'utf8')

const mustIncludeInHome = [
  'The multimodal engine for AI pipelines and agents',
  'Run SQL, Python UDFs, embeddings, and batch model inference across documents, media, sensor data, and tables — locally or on Ray.',
  'Read the docs',
  'Choose your workload',
  'Four real-world AI workloads.',
  'From multimodal model training to enterprise data pipelines, real-world AI runs on messy multimodal data. Pick the pipeline that matches your workload.',
  'Multimodal Model Training — data pipelines',
  'Turn images, video, audio, documents, tables, and sensor logs into filtered, labeled, deduplicated training dataset releases — with lineage and reproducible runs.',
  'Enterprise Multimodal Agent',
  'Turn PDFs, images, video, logs, forms, spreadsheets, and documents into auditable facts and agent-ready context — in SQL.',
  'Embodied AI — RL post-training',
  'Edge AI Agent',
  '/use-cases/training',
  '/use-cases/enterprise-agent',
  'Proof for real batch inference pipelines.',
  'One credible number, fully reproducible — vLLM batch inference over 66K rows on 2 GPUs, measuring the same GPU-feeding bottleneck behind multimodal AI pipelines.',
  '~20× vs Spark',
  '~2× vs Daft',
  '~1.2× vs Ray Data',
  'Multimodal data, agents, and RL on one core.',
  'Vane is the multimodal engine behind the four workloads above.',
  'Become a design partner',
]

for (const text of mustIncludeInHome) {
  assert.match(home, new RegExp(escapeRegExp(text)), `Home.tsx should include "${text}"`)
}

assert.match(platform, /SENSE\s*.*LEARN\s*.*ACT/s, 'PlatformArchitecture should show the SENSE -> LEARN -> ACT loop')

assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')
assert.match(footer, /Enterprise Multimodal Data/, 'Footer product nav should use the broader enterprise data label')
assert.match(cta, /Build your first AI pipeline on multimodal data\./, 'Default CTA should use the updated Home closing copy')
assert.match(css, /\.scenario-card::before\s*\{\s*display:\s*none;\s*\}/, 'Scenario cards should disable the Box overlay so hover does not obscure content')
assert.match(css, /\.scenario-card:hover[\s\S]*background:\s*var\(--paper-3\)/, 'Scenario card hover should use a light background instead of a dark overlay')

assert.doesNotMatch(home, /OLD_WAY|NEW_WAY|The old way|With Vane Data/, 'Home.tsx should not render the old/new comparison block')
assert.doesNotMatch(home, /The Multimodal-Native AI Engine|Powering the AI learning and action loop|Four real-world AI workloads\. One multimodal engine\.|Enterprise multimodal data pipelines|Autonomous Driving — Physical AI training data|PB-scale multi-sensor drive logs/, 'Home.tsx should not include superseded positioning copy')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
