import type {PluginModule} from '@docusaurus/types'
import {LEGACY_DOC_SLUG_LIST} from '../docs/legacySlugs'
import {agentUseCases} from '../content/useCases'
function localizedPath(baseUrl:string,path:string) {
  return path==='/' ? baseUrl : '/'+[baseUrl,path].join('/').split('/').filter(Boolean).join('/')
}
const vaneRoutesPlugin:PluginModule=context=>({
  name:'vane-routes',
  contentLoaded({actions:{addRoute}}) {
    const route=(path:string,component:string)=>addRoute({path:localizedPath(context.baseUrl,path),component:'@site/src/pages/'+component+'.tsx',exact:true})
    route('/','Home')
    route('/products/context','ContextProduct')
    route('/products/data','DataProduct')
    route('/solutions','UseCases')
    for(const scenario of agentUseCases) route('/solutions/'+scenario.id,'AgentUseCase')
    route('/solutions/training','TrainingUseCase')
    for(const slug of ['video-research','audio-evidence','product-verification']) route('/solutions/'+slug,'SolutionDetail')
    route('/solutions/enterprise-agent','EnterpriseRedirect')
    route('/demo','Demo')
    route('/privacy','Privacy')
    route('/contact','Contact')
    route('/benchmarks','Benchmarks')
    const docsRoute=(path:string)=>route(path,'Docs')
    LEGACY_DOC_SLUG_LIST.forEach((slug) => docsRoute(`/docs/data/${slug}`))
    LEGACY_DOC_SLUG_LIST.forEach((slug) => docsRoute(`/docs/${slug}`))
    docsRoute('/docs')
  },
})
export default vaneRoutesPlugin
