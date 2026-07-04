import type {SidebarsConfig} from '@docusaurus/plugin-content-docs'
import docsSidebar from './src/docs/sidebar.data.json'

type DocsSidebarItem =
  | {
      slug: string
      label?: string
      to?: never
    }
  | {
      to: string
      label: string
      slug?: never
    }

type DocsSidebarGroup = {
  group: string
  items: DocsSidebarEntry[]
}

type DocsSidebarEntry = DocsSidebarItem | DocsSidebarGroup

type DataSidebarItem =
  | string
  | {
      type: 'category'
      label: string
      collapsed: boolean
      items: DataSidebarItem[]
    }
  | {
      type: 'doc'
      id: string
      label: string
    }
  | {
      type: 'link'
      label: string
      href: string
    }

function isGroup(entry: DocsSidebarEntry): entry is DocsSidebarGroup {
  return 'group' in entry
}

function docIdForSlug(slug: string): string {
  return slug === 'examples' ? 'examples/index' : slug
}

function toSidebarItem(entry: DocsSidebarEntry): DataSidebarItem {
  if (isGroup(entry)) {
    return {
      type: 'category',
      label: entry.group,
      collapsed: true,
      items: entry.items.map(toSidebarItem),
    }
  }

  if (typeof entry.to === 'string') {
    return {
      type: 'link',
      label: entry.label,
      href: entry.to,
    }
  }

  return entry.label
    ? {
        type: 'doc',
        id: docIdForSlug(entry.slug),
        label: entry.label,
      }
    : docIdForSlug(entry.slug)
}

const sidebars: SidebarsConfig = {
  dataSidebar: (docsSidebar as DocsSidebarGroup[]).map(toSidebarItem),
}

export default sidebars
