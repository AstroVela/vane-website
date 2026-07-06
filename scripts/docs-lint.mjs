#!/usr/bin/env node
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  existingRelativeDocPath,
  isExternalLink,
  normalizeDocFile,
  parseFrontmatter,
  parseRegistry,
  parseSidebar,
  readText,
  rel,
  sidebarSlugs,
  slugForRoute,
  stripLinkDecorations,
  walk,
} from './docs-utils.mjs'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const registryPath = path.join(root, 'src/docs/registry.ts')
const sidebarPath = path.join(root, 'src/docs/sidebar.data.json')
const legacySlugsPath = path.join(root, 'src/docs/legacySlugs.ts')
const docsPagePath = path.join(root, 'src/pages/Docs.tsx')
const routesPath = path.join(root, 'src/plugins/vaneRoutes.ts')
const errors = []

function addError(file, line, message) {
  errors.push(`${rel(root, file)}${line ? `:${line}` : ''} - ${message}`)
}

function checkRegistryAndSidebar(pages, sidebar, docFiles) {
  const slugs = sidebarSlugs(sidebar, sidebarPath, addError)
  const seenSidebarSlugs = new Set()
  for (const slug of slugs) {
    if (seenSidebarSlugs.has(slug)) {
      addError(sidebarPath, 0, `Duplicate sidebar slug "${slug}".`)
    }
    seenSidebarSlugs.add(slug)
    if (!pages.has(slug)) {
      addError(sidebarPath, 0, `Sidebar slug "${slug}" is not registered in DOCS_PAGES.`)
    }
  }

  const seenSources = new Set()
  for (const [slug, page] of pages.entries()) {
    if (!page.title.trim()) addError(registryPath, 0, `Doc slug "${slug}" has an empty title.`)
    if (seenSources.has(page.source)) {
      addError(registryPath, 0, `Duplicate registered source "${page.source}".`)
    }
    seenSources.add(page.source)

    const sourcePath = path.join(root, page.source)
    if (!existsSync(sourcePath)) {
      addError(registryPath, 0, `Doc slug "${slug}" source does not exist: ${page.source}.`)
    } else {
      const frontmatter = parseFrontmatter(sourcePath, addError)
      if (!frontmatter.title) {
        addError(sourcePath, 1, `Registered docs pages must declare frontmatter title "${page.title}".`)
      } else if (frontmatter.title !== page.title) {
        addError(sourcePath, 1, `Frontmatter title "${frontmatter.title}" does not match registry title "${page.title}".`)
      }
    }
    if (!seenSidebarSlugs.has(slug)) {
      addError(registryPath, 0, `Doc slug "${slug}" is not present in the sidebar.`)
    }
  }

  const registeredSources = new Set([...pages.values()].map((page) => page.source))
  for (const file of docFiles) {
    const docSource = normalizeDocFile(root, file)
    if (docSource.endsWith('/_template.mdx')) continue
    if (!registeredSources.has(docSource)) {
      addError(file, 0, 'MDX file is not registered in DOCS_PAGES.')
    }
  }
}

function parseLegacyDocSlugs() {
  const source = readText(legacySlugsPath)
  const block = source.match(/export const LEGACY_DOC_SLUGS = \{([\s\S]*?)\}\s+as const/)
  if (!block) {
    addError(legacySlugsPath, 0, 'Unable to locate LEGACY_DOC_SLUGS.')
    return []
  }

  return Array.from(block[1].matchAll(/'([^']+)':\s*'([^']+)'/g), (match) => ({
    legacy: match[1],
    canonical: match[2],
  }))
}

function checkLegacyDocRoutes(pages, sidebar) {
  const legacySlugs = parseLegacyDocSlugs()
  if (legacySlugs.length === 0) return

  const sidebarSlugSet = new Set(sidebarSlugs(sidebar, sidebarPath, addError))
  for (const { legacy, canonical } of legacySlugs) {
    if (!pages.has(canonical)) {
      addError(legacySlugsPath, 0, `Legacy docs slug "${legacy}" maps to unregistered slug "${canonical}".`)
    }
    if (pages.has(legacy)) {
      addError(legacySlugsPath, 0, `Legacy docs slug "${legacy}" should not be registered as a canonical page.`)
    }
    if (sidebarSlugSet.has(legacy)) {
      addError(sidebarPath, 0, `Legacy docs slug "${legacy}" should not appear in the sidebar.`)
    }
  }

  const docsPage = readText(docsPagePath)
  if (!docsPage.includes('resolveLegacyDocSlug(slug)')) {
    addError(docsPagePath, 0, 'Docs page must resolve legacy docs slugs before page lookup.')
  }

  const routes = readText(routesPath)
  if (!routes.includes('LEGACY_DOC_SLUG_LIST')) {
    addError(routesPath, 0, 'Docs routes must register legacy docs slugs.')
  }
  if (!/LEGACY_DOC_SLUG_LIST\.forEach\(\(slug\) => docsRoute\(`\/docs\/data\/\$\{slug\}`\)\)/.test(routes)) {
    addError(routesPath, 0, 'Docs routes must keep data-product legacy docs URLs working.')
  }
  if (!/LEGACY_DOC_SLUG_LIST\.forEach\(\(slug\) => docsRoute\(`\/docs\/\$\{slug\}`\)\)/.test(routes)) {
    addError(routesPath, 0, 'Docs routes must keep legacy default-product docs URLs working.')
  }
}

function checkTopLevelHeadings(file, lines) {
  let inFence = false
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (/^\s*```/.test(line)) inFence = !inFence
    if (!inFence && /^#\s+/.test(line)) {
      addError(file, index + 1, 'Do not use a top-level # heading; the page title comes from DOCS_PAGES.')
    }
  }
}

function checkCodeFences(file, lines) {
  let openFenceLine = 0
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s*```(\S*)\s*$/)
    if (!match) continue
    if (!openFenceLine) {
      openFenceLine = index + 1
      if (!match[1]) {
        addError(file, index + 1, 'Fenced code blocks must declare a language.')
      }
    } else {
      openFenceLine = 0
    }
  }
  if (openFenceLine) {
    addError(file, openFenceLine, 'Unclosed fenced code block.')
  }
}

function checkLinks(file, lines, pages) {
  let inFence = false
  const registeredSlugs = new Set(pages.keys())
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const linkPattern = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
    let match
    while ((match = linkPattern.exec(line))) {
      const target = match[1]
      if (!target || target.startsWith('#') || isExternalLink(target)) continue

      if (target.startsWith('/')) {
        const urlPath = stripLinkDecorations(target)
        const slug = slugForRoute(urlPath)
        if (slug && registeredSlugs.has(slug)) continue
        const publicPath = path.join(root, 'public', urlPath)
        if (existsSync(publicPath)) continue
        addError(file, index + 1, `Internal link target does not exist: ${target}`)
        continue
      }

      if (!existingRelativeDocPath(file, target)) {
        addError(file, index + 1, `Relative link target does not exist: ${target}`)
      }
    }
  }
}

function checkDocs(pages) {
  const docFiles = walk(docsDir, (file) => file.endsWith('.mdx')).sort()
  for (const file of docFiles) {
    const lines = readText(file).split(/\r?\n/)
    checkTopLevelHeadings(file, lines)
    checkCodeFences(file, lines)
    checkLinks(file, lines, pages)
  }
  return docFiles
}

const pages = parseRegistry(registryPath, addError)
const sidebar = parseSidebar(sidebarPath, addError)
const docFiles = checkDocs(pages)
checkRegistryAndSidebar(pages, sidebar, docFiles)
checkLegacyDocRoutes(pages, sidebar)

if (errors.length > 0) {
  console.error(`docs lint failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`docs lint passed: ${pages.size} registered pages, ${docFiles.length} MDX files checked.`)
