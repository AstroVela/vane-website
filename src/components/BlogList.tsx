import {useId, useState} from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import BlogListPaginator from '@theme/BlogListPaginator'
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData'
import Head from '@docusaurus/Head'
import type {Props} from '@theme/BlogListPage'
import MarketingLayout from './MarketingLayout'
import {useSiteLocale} from '../siteI18n'
import '../blogList.css'

type Post = Props['items'][number]['content']

function BlogCard({post, priority}: {post: Post; priority: boolean}) {
  const {metadata, assets} = post
  const locale = useSiteLocale()
  const titleId = useId()
  const [failed, setFailed] = useState(false)
  const image = assets.image ?? metadata.frontMatter.image
  const cover = useBaseUrl(image ?? '/vane-logo.svg')
  const fallback = useBaseUrl('/vane-logo.svg')
  const hasCover = Boolean(image) && !failed
  const variant = metadata.frontMatter.image_variant
  const imageClass = !hasCover ? 'fallback' : variant === 'photo' || variant === 'poster' ? variant : 'diagram'
  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(metadata.date))

  return <article className="blog-card">
    <Link className="blog-card-link" to={metadata.permalink} autoAddBaseUrl={false} aria-labelledby={titleId}>
      <div className={'blog-card-visual blog-card-visual--' + imageClass}>
        <img src={hasCover ? cover : fallback} alt="" width={800} height={450}
          loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
          onError={hasCover ? () => setFailed(true) : undefined}/>
      </div>
      <div className="blog-card-copy">
        <time dateTime={metadata.date}>{date}</time>
        <h2 id={titleId}>{metadata.title}</h2>
        <p>{metadata.description}</p>
      </div>
    </Link>
  </article>
}

export default function BlogList(props: Props) {
  const {metadata, items} = props
  const locale = useSiteLocale()
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <MarketingLayout title={metadata.blogTitle} description={metadata.blogDescription}>
    <Head>
      <meta name="docusaurus_tag" content="blog_posts_list"/>
      <meta name="docsearch:docusaurus_tag" content="blog_posts_list"/>
    </Head>
    <BlogListPageStructuredData {...props}/>
    <section className="blog-index"><div className="wrap">
      <header className="blog-index-heading">
        <h1 className="h1">{t('Blog', '博客')}</h1>
        <p className="lead">{t('Engineering notes, product updates and practical guides to multimodal data.', '关于多模态数据的工程实践、产品动态与技术解析。')}</p>
      </header>
      {items.length > 0 ? <div className="blog-index-grid">
        {items.map(({content}, index) => <BlogCard key={content.metadata.permalink} post={content} priority={index === 0}/>)}
      </div> : <p className="blog-index-empty">{t('New articles are on the way.', '更多文章即将发布。')}</p>}
      {(metadata.previousPage || metadata.nextPage) && <BlogListPaginator metadata={metadata}/>}
    </div></section>
  </MarketingLayout>
}
