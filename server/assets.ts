import {createReadStream,statSync} from 'node:fs'
import {resolve,sep} from 'node:path'
import {Readable} from 'node:stream'
const mime:Record<string,string>={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json; charset=utf-8',txt:'text/plain; charset=utf-8',md:'text/plain; charset=utf-8',svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',webp:'image/webp',mp4:'video/mp4',wav:'audio/wav',pdf:'application/pdf',woff:'font/woff',woff2:'font/woff2',ico:'image/x-icon',xml:'application/xml; charset=utf-8'}
function isFile(filename:string) {try{return statSync(filename).isFile()}catch{return false}}
export function staticAssets(directory:string,production=false) {
  const root=resolve(directory)
  return {async fetch(request:Request):Promise<Response> {
    if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}})
    let pathname:string
    try{pathname=decodeURIComponent(new URL(request.url).pathname)}catch{return new Response('Invalid path',{status:400})}
    if(pathname.includes('\0'))return new Response('Invalid path',{status:400})
    const base=resolve(root,'.'+pathname)
    if(base!==root&&!base.startsWith(root+sep))return new Response('Not found',{status:404})
    let filename=[base,base+'.html',resolve(base,'index.html')].find(isFile)
    let status=200
    if(!filename) {status=404;filename=pathname.startsWith('/zh-CN/')?resolve(root,'zh-CN/404.html'):resolve(root,'404.html');if(!isFile(filename))filename=resolve(root,'404.html')}
    if(!isFile(filename))return new Response('Website build is unavailable',{status:503})
    const stat=statSync(filename),contentType=mime[filename.split('.').at(-1)!]??'application/octet-stream'
    const etag=`W/"${stat.size}-${Math.trunc(stat.mtimeMs).toString(16)}"`
    const headers:Record<string,string>={'Content-Type':contentType,'Content-Length':String(stat.size),'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff',ETag:etag,'Cache-Control':production?(contentType.startsWith('text/html')?'no-cache':'public, max-age=3600'):'no-store'}
    if(status===200&&request.headers.get('If-None-Match')===etag&&!request.headers.has('Range')){delete headers['Content-Length'];return new Response(null,{status:304,headers})}
    let start=0,end=stat.size-1
    const range=request.headers.get('Range')
    if(range&&status===200) {
      const match=range.match(/^bytes=(\d*)-(\d*)$/)
      if(!match||!match[1]&&!match[2])return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+stat.size}})
      if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end)}
      else start=Math.max(0,stat.size-Number(match[2]))
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||end<start||start>=stat.size)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+stat.size}})
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;headers['Content-Length']=String(end-start+1)
    }
    const body=request.method==='HEAD'||stat.size===0?null:Readable.toWeb(createReadStream(filename,{start,end})) as unknown as ReadableStream<Uint8Array>
    return new Response(body,{status,headers})
  }}
}
