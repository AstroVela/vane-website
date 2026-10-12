import OriginalTitle from '@theme-original/BlogPostItem/Header/Title'
export type Props = {className?:string}
import {useBlogPost} from '@docusaurus/plugin-content-blog/client'
import {useSiteLocale} from '../../../../siteI18n'

export default function BlogPostTitle(props:Props) {
  const {metadata}=useBlogPost()
  const locale=useSiteLocale()
  if(metadata.permalink.includes('/release-notes'))return <OriginalTitle {...props}/>
  return <><span className="blog-product-label">Vane Data · {locale==='en'?'Engineering':'工程实践'}</span><OriginalTitle {...props}/></>
}
