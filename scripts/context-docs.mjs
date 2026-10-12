import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs'
import path from 'node:path'
const pages=['index','ingestion','search','analysis','references','integration']
const check=process.argv.includes('--check')
const registry=[]
for(const locale of ['en','zh-CN']) {
  const docs=locale==='en'?'docs/context':'i18n/zh-CN/docusaurus-plugin-content-docs-context/current'
  const sections=[]
  for(const slug of pages) {
    const source=path.join(docs,slug+'.mdx'),text=readFileSync(source,'utf8')
    const title=text.match(/^title: (.+)$/m)?.[1]
    if(!title)throw new Error('Missing title: '+source)
    const route=(locale==='en'?'':'/zh-CN')+'/docs/context'+(slug==='index'?'':'/'+slug)
    registry.push({locale,slug,title,route,source})
    sections.push('## '+title,'','Route: '+route,'',text.replace(/^---\n[\s\S]*?\n---\n/,'').trim(),'')
  }
  const output=path.join('public',locale==='en'?'':'zh-CN','docs/context/llms.txt')
  const content='# Vane Context integration documentation\n\nCommercial product. Service credentials and packages are provided through commercial delivery.\n\n'+sections.join('\n')
  if(check) {if(!existsSync(output)||readFileSync(output,'utf8')!==content)throw new Error(output+' is out of date; run npm run docs:context.')}
  else {mkdirSync(path.dirname(output),{recursive:true});writeFileSync(output,content)}
}
const output='public/docs/context/manifest.json',content=JSON.stringify({product:'context',pages:registry},null,2)+'\n'
if(check) {if(!existsSync(output)||readFileSync(output,'utf8')!==content)throw new Error(output+' is out of date; run npm run docs:context.')}
else writeFileSync(output,content)
console.log('Context documentation and translations checked: 6 pages × 2 languages.')
