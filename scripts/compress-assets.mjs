import {readdir,readFile,writeFile,unlink} from 'node:fs/promises'
import {resolve,extname} from 'node:path'
import {promisify} from 'node:util'
import {brotliCompress,gzip,constants} from 'node:zlib'

const brotli=promisify(brotliCompress),gzipAsync=promisify(gzip)
const textExtensions=new Set(['.html','.css','.js','.json','.svg','.xml','.txt','.md'])
async function compressDirectory(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const filename=resolve(directory,entry.name)
    if(entry.isDirectory()) {await compressDirectory(filename);continue}
    if(!entry.isFile()||!textExtensions.has(extname(filename)))continue
    const original=await readFile(filename)
    const variants=await Promise.all([
      brotli(original,{params:{[constants.BROTLI_PARAM_QUALITY]:6}}),
      gzipAsync(original,{level:9}),
    ])
    for(const [index,suffix] of ['.br','.gz'].entries()) {
      if(variants[index].length<original.length)await writeFile(filename+suffix,variants[index])
      else await unlink(filename+suffix).catch(error=>{if(error.code!=='ENOENT')throw error})
    }
  }
}
await compressDirectory(resolve(process.argv[2]??'build'))
console.log('Static assets prepared: Brotli and gzip; audio/video keep native byte ranges.')
