import clsx from 'clsx'
import {translate} from '@docusaurus/Translate'
import {ThemeClassNames} from '@docusaurus/theme-common'
import OriginalContent from '@theme-original/DocSidebar/Desktop/Content'
import DocSidebarItems from '@theme/DocSidebarItems'
import ProductGlyph from '../../../../docs/ProductGlyph'
import { PRODUCTS } from '../../../../docs/products'

type DocSidebarDesktopContentProps = {
  className?: string
  path: string
  sidebar: unknown[]
}

export default function DocSidebarDesktopContent({
  path,
  sidebar,
  className,
}: DocSidebarDesktopContentProps) {
  if (!path.includes('/docs/data')) {
    return <OriginalContent path={path} sidebar={sidebar} className={className} />
  }

  const product = PRODUCTS.data

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx('menu thin-scrollbar docs-data-menu', className)}
    >
      <div className="prod">
        <span className="prod-ic">
          <ProductGlyph id={product.id} size={15} />
        </span>
        <div className="prod-name">{product.name}</div>
      </div>
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems items={sidebar} activePath={path} level={1} />
      </ul>
    </nav>
  )
}
