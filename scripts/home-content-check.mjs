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
const heroPipelineCode = heroExecution.match(/const HERO_PIPELINE_CODE = `([\s\S]*?)`/)?.[1]
assert.ok(heroPipelineCode, 'Hero pipeline code should be extractable')
assert.ok(
  heroPipelineCode.split('\n').every((line) => line.length <= 52),
  'Hero pipeline code should fit the code window without horizontal scrolling',
)

assert.match(codeWindow, /headerMeta\?: ReactNode/)
assert.match(codeWindow, /afterCode\?: ReactNode/)
assert.match(codeWindow, /showHeader\?: boolean/)
assert.match(codeWindow, /showHeader = true/)
assert.match(codeWindow, /\{showHeader && \(/)
assert.match(codeWindow, /className="term-meta"/)
assert.match(codeWindow, /\{afterCode\}/)

assert.match(home, /import HomeHeroExecution from '\.\.\/components\/HomeHeroExecution'/)
assert.match(home, /<HomeHeroExecution \/>/)
assert.doesNotMatch(home, /const HERO_CODE = `/)
assert.doesNotMatch(home, /heroCodeLocal|heroCodeRay|embed_documents\.py/)

assert.match(heroPipelineCode, /image_file\(/)
assert.match(heroPipelineCode, /image_file_metadata\(source\)\.width/)
assert.match(heroPipelineCode, /decode_image_file\(source, 'RGB'\)/)
assert.match(heroPipelineCode, /resize\(/)
assert.match(heroPipelineCode, /\.show\(\)/)
assert.doesNotMatch(heroPipelineCode, /DecodeAndInfer|feature_schema/)
assert.match(home, /to="\/docs\/data\/quickstart\/quickstart"/)
assert.match(home, /release-notes\/v0\.2\.0/)
for (const type of ['FILE', 'IMAGEFILE', 'AUDIOFILE', 'VIDEOFILE', 'IMAGE', 'TENSOR']) {
  assert.ok(home.includes(type), `Home should introduce ${type}`)
}
for (const connection of ['Iceberg', 'Paimon', 'DuckLake', 'Lance', 'Vortex', 'Milvus', 'Qdrant', 'Doris']) {
  assert.ok(home.includes(connection), `Home should name ${connection}`)
}
assert.match(heroExecution, /showHeader=\{false\}/)
assert.doesNotMatch(heroExecution, /headerMeta=/)
assert.doesNotMatch(heroExecution, /afterCode=/)
assert.doesNotMatch(heroExecution, /ReactNode|pickLocale|useSiteLocale|MODALITIES|ACTORS/)
assert.doesNotMatch(heroExecution, /function Stage|function Connector/)
assert.doesNotMatch(heroExecution, /home-hero-execution|home-execution-/)
assert.doesNotMatch(heroExecution, /One relation|INPUT|IMG|VID|AUD|ONE RELATION/)
assert.doesNotMatch(heroExecution, /S3 SCAN|I\/O|CPU DECODE|PYTHON \/ ARROW|GPU INFER|PARQUET|WRITE/)
assert.doesNotMatch(heroExecution, /RAY · 4 GPU ACTORS/)
assert.doesNotMatch(heroExecution, /ai_embed|running|LIVE|rows\/s|92%|3\.1×|1\.9×/)

assert.match(styles, /\.term-meta/)
assert.doesNotMatch(styles, /\.home-hero-execution|\.home-execution-/)
assert.doesNotMatch(styles, /homeExecution/)
assert.doesNotMatch(styles, /\.home-hero-code \.term-bar/)
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
assert.match(home, /\/solutions\/training/)
assert.match(home, /\/solutions\/enterprise-agent/)
assert.match(nav, /\/solutions/)
assert.match(footer, /\/solutions\/training/)
assert.match(footer, /\/solutions\/enterprise-agent/)
assert.doesNotMatch(`${home}\n${nav}\n${footer}`, /['"`]\/use-cases(?:\/|\b)/)
assert.match(home, /pip install vane-ai/)
assert.match(footer, /pip install vane-ai/)

console.log('Home content check passed.')
