import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const home = readFileSync('src/pages/Home.tsx', 'utf8')
const platform = readFileSync('src/components/PlatformArchitecture.tsx', 'utf8')
const nav = readFileSync('src/components/Nav.tsx', 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')
const cta = readFileSync('src/components/Cta.tsx', 'utf8')
const siteLinks = readFileSync('src/siteLinks.ts', 'utf8')
const css = readFileSync('src/index.css', 'utf8')

const mustIncludeInHome = [
  'The multimodal engine for AI pipelines and agents',
  'Run SQL, Python UDFs, embeddings, and batch model inference across documents, media, sensor data, and tables — locally or on Ray.',
  'Get Started',
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

assert.doesNotMatch(platform, /pa-loop|NEW DATA/, 'PlatformArchitecture should not render the redundant loop bar')
assert.match(platform, /FEEDBACK LOOP/, 'PlatformArchitecture should render the feedback loop band')
assert.match(platform, /m11\.3 1\.3 2\.7 2\.7-2\.7 2\.7/, 'Feedback loop icon should use the repeat-style rails with chevron arrowheads')
assert.doesNotMatch(platform, /M12\.6 6A5 5 0 1 0 13 9\.3/, 'Feedback loop icon should not use the old circular refresh mark')
assert.match(platform, /Curated &amp; versioned data/, 'PlatformArchitecture should label the data -> RL arc')
assert.match(platform, /Available now/, 'PlatformArchitecture should mark Vane Data as available now')
assert.match(platform, /Coming soon/, 'PlatformArchitecture should mark the upcoming pillars as coming soon')

assert.match(nav, />\s*Solutions\s*<span className="caret">▾<\/span>/, 'Desktop nav should label the solutions menu "Solutions"')
assert.match(nav, /<Link className="mob-head" to="\/use-cases"[\s\S]*>\s*Solutions\s*<\/Link>/, 'Mobile nav should label the solutions menu "Solutions"')
assert.doesNotMatch(nav, />\s*Use Cases\s*<span className="caret">▾<\/span>/, 'Desktop nav should not label the solutions menu "Use Cases"')
assert.doesNotMatch(nav, /<Link className="mob-head" to="\/use-cases"[\s\S]*>\s*Use Cases\s*<\/Link>/, 'Mobile nav should not label the solutions menu "Use Cases"')
assert.match(footer, /The multimodal engine for AI pipelines and agents\./, 'Footer should use the unified Vane positioning')
assert.match(footer, /Enterprise Multimodal Data/, 'Footer product nav should use the broader enterprise data label')
assert.match(footer, /to="\/use-cases\/training"[\s\S]*Multimodal Data Pipeline/, 'Footer product nav should link the training solution directly')
assert.match(footer, /to="\/use-cases\/enterprise-agent"[\s\S]*Enterprise Multimodal Data/, 'Footer product nav should link the enterprise solution directly')
assert.match(cta, /Build your first AI pipeline on multimodal data\./, 'Default CTA should use the updated Home closing copy')
assert.match(css, /\.scenario-card::before\s*\{\s*display:\s*none;\s*\}/, 'Scenario cards should disable the Box overlay so hover does not obscure content')
assert.match(css, /\.scenario-card:hover[\s\S]*background:\s*var\(--paper-3\)/, 'Scenario card hover should use a light background instead of a dark overlay')

assert.match(home, /scenario-soon-card/, 'Coming-soon workloads should render as compact cards below the featured row')
assert.doesNotMatch(home, /scenario-card is-soon/, 'Coming-soon workloads should not render as full-size scenario cards')
assert.doesNotMatch(home, /See all examples/, 'Home use-cases section should not render the extra examples CTA')
assert.match(home, /DESIGN_PARTNER_MAILTO/, 'Home should use the centralized design partner mailto')
assert.match(siteLinks, /CONTACT_EMAIL = 'pulse@astrovela\.ai'/, 'siteLinks should keep the canonical contact inbox')
assert.match(siteLinks, /DESIGN_PARTNER_MAILTO/, 'siteLinks should define the generic design partner mailto')
assert.doesNotMatch(home, /hello@vane\.ai|DESIGN_PARTNER_HREF/, 'Home should not hardcode the old design partner mailto')
assert.doesNotMatch(siteLinks, /hello@vane\.ai/, 'siteLinks should not preserve the old contact inbox')

assert.doesNotMatch(home, /OLD_WAY|NEW_WAY|The old way|With Vane Data/, 'Home.tsx should not render the old/new comparison block')
assert.doesNotMatch(home, /The Multimodal-Native AI Engine|Powering the AI learning and action loop|Four real-world AI workloads\. One multimodal engine\.|Enterprise multimodal data pipelines|Autonomous Driving — Physical AI training data|PB-scale multi-sensor drive logs/, 'Home.tsx should not include superseded positioning copy')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
