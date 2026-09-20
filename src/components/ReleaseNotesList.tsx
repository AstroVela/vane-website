import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common'
import BlogLayout from '@theme/BlogLayout'
import BlogListPaginator from '@theme/BlogListPaginator'
import BlogPostItems from '@theme/BlogPostItems'
import type { Props } from '@theme/BlogListPage'

export default function ReleaseNotesList({ metadata, items, sidebar }: Props) {
  return (
    <HtmlClassNameProvider className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogListPage} release-notes-page`}>
      <PageMetadata title={metadata.blogTitle} description={metadata.blogDescription} />
      <BlogLayout sidebar={sidebar}>
        <header className="release-notes-heading">
          <h1>{metadata.blogTitle}</h1>
          <p>{metadata.blogDescription}</p>
        </header>
        <BlogPostItems items={items} />
        <BlogListPaginator metadata={metadata} />
      </BlogLayout>
    </HtmlClassNameProvider>
  )
}
