declare module '@theme/Heading' {
  import type {ComponentPropsWithoutRef, ReactNode} from 'react'

  export type Props =
    | ({as: 'h1'} & ComponentPropsWithoutRef<'h1'>)
    | ({as: 'h2'} & ComponentPropsWithoutRef<'h2'>)
    | ({as: 'h3'} & ComponentPropsWithoutRef<'h3'>)
    | ({as: 'h4'} & ComponentPropsWithoutRef<'h4'>)
    | ({as: 'h5'} & ComponentPropsWithoutRef<'h5'>)
    | ({as: 'h6'} & ComponentPropsWithoutRef<'h6'>)

  export default function Heading(props: Props): ReactNode
}

declare module '@theme/MDXComponents/Heading' {
  import type {ComponentPropsWithoutRef, ReactNode} from 'react'

  export type Props =
    | ({as: 'h1'} & ComponentPropsWithoutRef<'h1'>)
    | ({as: 'h2'} & ComponentPropsWithoutRef<'h2'>)
    | ({as: 'h3'} & ComponentPropsWithoutRef<'h3'>)
    | ({as: 'h4'} & ComponentPropsWithoutRef<'h4'>)
    | ({as: 'h5'} & ComponentPropsWithoutRef<'h5'>)
    | ({as: 'h6'} & ComponentPropsWithoutRef<'h6'>)

  export default function MDXHeading(props: Props): ReactNode
}

declare module '@theme/ContentVisibility' {
  import type {ReactNode} from 'react'

  export default function ContentVisibility(props: {metadata: unknown}): ReactNode
}

declare module '@theme/DocItem/Content' {
  import type {ReactNode} from 'react'

  export default function DocItemContent(props: {children: ReactNode}): ReactNode
}

declare module '@theme/DocItem/Footer' {
  import type {ReactNode} from 'react'

  export default function DocItemFooter(): ReactNode
}

declare module '@theme/DocItem/Paginator' {
  import type {ReactNode} from 'react'

  export default function DocItemPaginator(): ReactNode
}

declare module '@theme/DocItem/TOC/Desktop' {
  import type {ReactNode} from 'react'

  export default function DocItemTOCDesktop(): ReactNode
}

declare module '@theme/DocSidebarItems' {
  import type {ReactNode} from 'react'
  import type {PropSidebar, PropSidebarItem} from '@docusaurus/plugin-content-docs'

  export default function DocSidebarItems(props: {
    activePath: string
    items: PropSidebar
    level: number
    onItemClick?: (item: PropSidebarItem) => void
  }): ReactNode
}

declare module '@theme/Icon/Close' {
  import type {ComponentProps, ReactNode} from 'react'

  export default function IconClose(props: ComponentProps<'svg'>): ReactNode
}

declare module '@theme/DocVersionBadge' {
  import type {ReactNode} from 'react'

  export default function DocVersionBadge(): ReactNode
}

declare module '@theme/DocVersionBanner' {
  import type {ReactNode} from 'react'

  export default function DocVersionBanner(): ReactNode
}

declare module '@theme/MDXContent' {
  import type {ReactNode} from 'react'

  export default function MDXContent(props: {children: ReactNode}): ReactNode
}

declare module '@theme/BlogLayout' {
  import type {ReactNode} from 'react'
  import type {BlogSidebar} from '@docusaurus/plugin-content-blog'

  export default function BlogLayout(props: {children: ReactNode; sidebar?: BlogSidebar}): ReactNode
}

declare module '@theme/BlogListPaginator' {
  import type {ReactNode} from 'react'
  import type {BlogPaginatedMetadata} from '@docusaurus/plugin-content-blog'

  export default function BlogListPaginator(props: {metadata: BlogPaginatedMetadata}): ReactNode
}

declare module '@theme/BlogPostItems' {
  import type {ReactNode} from 'react'
  import type {PropBlogPostContent} from '@docusaurus/plugin-content-blog'

  export default function BlogPostItems(props: {items: readonly {content: PropBlogPostContent}[]}): ReactNode
}
