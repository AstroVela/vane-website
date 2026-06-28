#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { readText } from './docs-utils.mjs'

const root = process.cwd()
const manifestPath = path.join(root, 'docs/manifest.json')
const llmsPath = path.join(root, 'docs/llms.txt')
const llmsFullPath = path.join(root, 'docs/llms-full.txt')
const checkOnly = process.argv.includes('--check')

function loadManifest() {
  if (!existsSync(manifestPath)) {
    console.error('docs/manifest.json is missing. Run `npm run docs:manifest` first.')
    process.exit(1)
  }
  return JSON.parse(readFileSync(manifestPath, 'utf8'))
}

function stripFrontmatter(text) {
  if (!text.startsWith('---\n')) return text
  const end = text.indexOf('\n---', 4)
  if (end < 0) return text
  return text.slice(end + '\n---'.length).replace(/^\r?\n/, '')
}

function normalizeBody(text) {
  return stripFrontmatter(text).trim()
}

function sentence(text) {
  return /[.!?]$/.test(text) ? text : `${text}.`
}

function buildLlmsIndex(manifest) {
  const lines = [
    '# Vane Data Documentation Index',
    '',
    'Generated from docs/manifest.json. Routes are listed in sidebar order.',
    '',
  ]
  for (const page of manifest.pages) {
    lines.push(`- ${page.route}: ${sentence(page.title)}`)
  }
  return `${lines.join('\n')}\n`
}

function buildLlmsFull(manifest) {
  const sections = [
    '# Vane Data Documentation Full Text',
    '',
    'Generated from docs/manifest.json and the current MDX source files.',
  ]

  for (const page of manifest.pages) {
    const sourcePath = path.join(root, page.source)
    const body = existsSync(sourcePath) ? normalizeBody(readText(sourcePath)) : ''
    sections.push(
      '',
      `## ${page.title}`,
      '',
      `Route: ${page.route}`,
      `Source: ${page.source}`,
      '',
      body || 'TODO.',
    )
  }

  return `${sections.join('\n')}\n`
}

function assertCurrent(file, expected) {
  const current = existsSync(file) ? readFileSync(file, 'utf8') : ''
  if (current !== expected) {
    console.error(`${path.relative(root, file)} is out of date. Run \`npm run docs:llms\`.`)
    process.exitCode = 1
  }
}

const manifest = loadManifest()
const nextIndex = buildLlmsIndex(manifest)
const nextFull = buildLlmsFull(manifest)

if (checkOnly) {
  assertCurrent(llmsPath, nextIndex)
  assertCurrent(llmsFullPath, nextFull)
  if (process.exitCode) process.exit()
  console.log('docs llms files are up to date.')
} else {
  writeFileSync(llmsPath, nextIndex)
  writeFileSync(llmsFullPath, nextFull)
  console.log('wrote docs/llms.txt and docs/llms-full.txt')
}
