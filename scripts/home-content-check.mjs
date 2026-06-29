import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const home = readFileSync('src/pages/Home.tsx', 'utf8')
const platform = readFileSync('src/components/PlatformArchitecture.tsx', 'utf8')

const mustIncludeInHome = [
  'The Multimodal-Native AI Engine',
  'Powering the AI learning and action loop with real-world data.',
  'Four real-world AI workloads. One engine.',
  'Autonomous Driving — Physical AI training data',
  'Enterprise Multimodal Agent',
  'Embodied AI — RL post-training',
  'Edge AI Agent',
  '/use-cases/training',
  '/use-cases/enterprise-agent',
  '~20× vs Spark',
  '~2× vs Daft',
  '~1.2× vs Ray Data',
  'Become a design partner',
]

for (const text of mustIncludeInHome) {
  assert.match(home, new RegExp(escapeRegExp(text)), `Home.tsx should include "${text}"`)
}

assert.match(platform, /SENSE\s*.*LEARN\s*.*ACT/s, 'PlatformArchitecture should show the SENSE -> LEARN -> ACT loop')

assert.doesNotMatch(home, /OLD_WAY|NEW_WAY|The old way|With Vane Data/, 'Home.tsx should not render the old/new comparison block')

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
