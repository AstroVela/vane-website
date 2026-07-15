import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const home = readFileSync('src/pages/Home.tsx', 'utf8')
const nav = readFileSync('src/components/Nav.tsx', 'utf8')
const footer = readFileSync('src/components/Footer.tsx', 'utf8')
const codeWindow = readFileSync('src/components/CodeWindow.tsx', 'utf8')
const heroExecutionPath = 'src/components/HomeHeroExecution.tsx'
const styles = readFileSync('src/index.css', 'utf8')

assert.ok(existsSync(heroExecutionPath), 'HomeHeroExecution component should exist')

const heroExecution = readFileSync(heroExecutionPath, 'utf8')

assert.match(codeWindow, /headerMeta\?: ReactNode/)
assert.match(codeWindow, /afterCode\?: ReactNode/)
assert.match(codeWindow, /className="term-meta"/)
assert.match(codeWindow, /\{afterCode\}/)

assert.match(home, /import HomeHeroExecution from '\.\.\/components\/HomeHeroExecution'/)
assert.match(home, /<HomeHeroExecution \/>/)
assert.doesNotMatch(home, /const HERO_CODE = `/)
assert.doesNotMatch(home, /heroCodeLocal|heroCodeRay|embed_documents\.py/)

assert.match(heroExecution, /vane\.configure\(runner="ray"\)/)
assert.match(heroExecution, /map_batches\(/)
assert.match(heroExecution, /gpus=1/)
assert.match(heroExecution, /actor_number=4/)
assert.match(heroExecution, /write_parquet/)
assert.match(heroExecution, /'image', 'video', 'audio'/)
assert.match(heroExecution, /DecodeAndInfer/)
assert.match(heroExecution, /model loaded once per actor/)
assert.match(heroExecution, /STREAMING/)
assert.match(heroExecution, /BACKPRESSURE/)
assert.match(heroExecution, /DYNAMIC BATCHING/)
assert.doesNotMatch(heroExecution, /ai_embed|running|LIVE|rows\/s|92%|3\.1×|1\.9×/)

assert.match(styles, /\.term-meta/)
assert.match(styles, /\.home-hero-execution/)
assert.match(styles, /\.home-execution-graph/)
assert.match(styles, /\.home-execution-actors/)
assert.match(styles, /@keyframes homeExecutionBatch/)
assert.match(styles, /@keyframes homeExecutionActor/)
assert.match(styles, /@media \(max-width: 520px\) \{\n  \.home-hero-code \.term-bar/)
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
assert.match(home, /\/solutions\/training/)
assert.match(home, /\/solutions\/enterprise-agent/)
assert.match(nav, /\/solutions/)
assert.match(footer, /\/solutions\/training/)
assert.match(footer, /\/solutions\/enterprise-agent/)
assert.doesNotMatch(`${home}\n${nav}\n${footer}`, /\/use-cases(?:\/|\b)/)

console.log('Home content check passed.')
