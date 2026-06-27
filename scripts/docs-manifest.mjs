#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { buildManifest } from './docs-utils.mjs'

const root = process.cwd()
const outputPath = path.join(root, 'docs/manifest.json')
const registryPath = path.join(root, 'src/docs/registry.ts')
const sidebarPath = path.join(root, 'src/docs/sidebar.data.json')
const checkOnly = process.argv.includes('--check')

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

const manifest = buildManifest({ root, registryPath, sidebarPath })
const next = stableJson(manifest)

if (checkOnly) {
  const current = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : ''
  if (current !== next) {
    console.error('docs manifest is out of date. Run `npm run docs:manifest`.')
    process.exit(1)
  }
  console.log('docs manifest is up to date.')
} else {
  writeFileSync(outputPath, next)
  console.log(`wrote ${path.relative(root, outputPath)}`)
}
