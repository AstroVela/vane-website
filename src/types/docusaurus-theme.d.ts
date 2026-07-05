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
