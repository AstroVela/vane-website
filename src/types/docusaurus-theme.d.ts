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

  export default function DocSidebarItems(props: {
    activePath: string
    items: unknown[]
    level: number
  }): ReactNode
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
