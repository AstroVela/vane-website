declare module '*.mdx' {
  import type {ComponentType} from 'react'

  export const title: string

  const MDXComponent: ComponentType
  export default MDXComponent
}
