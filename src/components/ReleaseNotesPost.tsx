import { HtmlClassNameProvider } from '@docusaurus/theme-common'
import BlogPostPage from '@theme/BlogPostPage'
import type { Props } from '@theme/BlogPostPage'

export default function ReleaseNotesPost(props: Props) {
  return (
    <HtmlClassNameProvider className="release-notes-page">
      <BlogPostPage {...props} />
    </HtmlClassNameProvider>
  )
}
