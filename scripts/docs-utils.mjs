import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

export const docsRoutePrefix = '/docs/data'

export function rel(root, file) {
  return path.relative(root, file).split(path.sep).join('/')
}

export function readText(file) {
  return readFileSync(file, 'utf8')
}

export function walk(dir, predicate, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(fullPath, predicate, out)
    else if (predicate(fullPath)) out.push(fullPath)
  }
  return out
}

export function routeForSlug(slug) {
  return slug === 'index' ? docsRoutePrefix : `${docsRoutePrefix}/${slug}`
}

export function parseRegistry(registryPath, onError = () => {}) {
  const source = readText(registryPath)
  const start = source.indexOf('export const DOCS_PAGES = {')
  const end = source.indexOf('} satisfies Record<string, DocPage>', start)
  if (start < 0 || end < 0) {
    onError(registryPath, 0, 'Unable to locate DOCS_PAGES.')
    return new Map()
  }

  const body = source.slice(start, end)
  const pages = new Map()
  const entryPattern =
    /(?:^|\n)\s*(?:'([^']+)'|([A-Za-z0-9_-]+)):\s*{[\s\S]*?source:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'/g
  let match
  while ((match = entryPattern.exec(body))) {
    const slug = match[1] ?? match[2]
    const docSource = match[3]
    const title = match[4]
    pages.set(slug, { source: docSource, title })
  }
  return pages
}

export function parseSidebar(sidebarPath, onError = () => {}) {
  try {
    return JSON.parse(readText(sidebarPath))
  } catch (error) {
    onError(sidebarPath, 0, `Unable to parse sidebar JSON: ${error.message}`)
    return []
  }
}

export function parseFrontmatter(file, onError = () => {}) {
  const text = readText(file)
  if (!text.startsWith('---\n')) return {}
  const end = text.indexOf('\n---', 4)
  if (end < 0) {
    onError(file, 1, 'Frontmatter block is not closed.')
    return {}
  }

  const data = {}
  const lines = text.slice(4, end).split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (!line.trim()) continue
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) {
      onError(file, index + 2, 'Frontmatter entries must use "key: value" syntax.')
      continue
    }
    const value = match[2].trim().replace(/^['"]|['"]$/g, '')
    data[match[1]] = value
  }
  return data
}

export function lastUpdatedFromFrontmatter(frontmatter) {
  return frontmatter.lastUpdated || undefined
}

export function sidebarSlugs(sidebar, sidebarPath, onError = () => {}) {
  const slugs = []
  for (const group of sidebar) {
    if (!group || typeof group.group !== 'string' || !Array.isArray(group.items)) {
      onError(sidebarPath, 0, 'Each sidebar group must have a group string and items array.')
      continue
    }
    for (const item of group.items) {
      if (item.slug) slugs.push(item.slug)
    }
  }
  return slugs
}

export function normalizeDocFile(root, file) {
  return rel(root, file).replace(/\\/g, '/')
}

export function slugForRoute(urlPath) {
  if (urlPath === docsRoutePrefix || urlPath === `${docsRoutePrefix}/`) return 'index'
  if (urlPath.startsWith(`${docsRoutePrefix}/`)) {
    return urlPath.slice(`${docsRoutePrefix}/`.length).replace(/\/$/, '')
  }
  if (urlPath === '/docs' || urlPath === '/docs/') return 'index'
  if (urlPath.startsWith('/docs/')) {
    return urlPath.slice('/docs/'.length).replace(/\/$/, '')
  }
  return undefined
}

export function stripLinkDecorations(target) {
  return target.split('#')[0].split('?')[0]
}

export function isExternalLink(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')
}

export function existingRelativeDocPath(fromFile, target) {
  const cleanTarget = stripLinkDecorations(target)
  if (!cleanTarget) return true
  const directPath = path.resolve(path.dirname(fromFile), cleanTarget)
  if (existsSync(directPath)) return true
  if (cleanTarget.endsWith('.md')) {
    const mdxPath = directPath.replace(/\.md$/, '.mdx')
    if (existsSync(mdxPath)) return true
  }
  return false
}

export function buildManifest({ root, registryPath, sidebarPath }) {
  const pages = parseRegistry(registryPath)
  const sidebar = parseSidebar(sidebarPath)
  const pageBySlug = new Map()
  for (const [slug, page] of pages.entries()) {
    const sourcePath = path.join(root, page.source)
    const frontmatter = existsSync(sourcePath) ? parseFrontmatter(sourcePath) : {}
    pageBySlug.set(slug, {
      slug,
      title: page.title,
      source: page.source,
      route: routeForSlug(slug),
      lastUpdated: lastUpdatedFromFrontmatter(frontmatter),
      frontmatter,
    })
  }

  const groups = sidebar.map((group) => ({
    group: group.group,
    items: group.items
      .map((item) => {
        if (item.slug) {
          const page = pageBySlug.get(item.slug)
          return page ? { slug: item.slug, label: item.label ?? page.title, route: page.route } : { slug: item.slug }
        }
        return { label: item.label, to: item.to }
      }),
  }))

  const orderedSlugs = groups.flatMap((group) => group.items.map((item) => item.slug).filter(Boolean))
  const pagesInOrder = orderedSlugs.map((slug) => pageBySlug.get(slug)).filter(Boolean)

  return {
    product: 'data',
    routePrefix: docsRoutePrefix,
    generatedFrom: ['src/docs/registry.ts', 'src/docs/sidebar.data.json', 'docs/**/*.mdx'],
    pages: pagesInOrder,
    sidebar: groups,
  }
}
