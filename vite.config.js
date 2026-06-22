import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // MDX must run before the React plugin so it can hand off JSX.
    // - remark-gfm: GitHub-flavored Markdown (tables, etc.)
    // - rehype-slug: gives every heading an id derived from its text, so pages
    //   can author headings as plain `## Title` and the in-page TOC / scrollspy
    //   (which read ids from the DOM) keep working.
    // providerImportSource lets <MDXProvider> map elements onto our styled
    // components so authored Markdown renders with the existing CSS classes.
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
})
