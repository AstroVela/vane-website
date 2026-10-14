import {useState} from 'react'
import {ArrowRightIcon, FileTextIcon, LayersIcon, MagnifyingGlassIcon, CubeIcon, GearIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../siteI18n'

export default function ContextArchitecture() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [active, setActive] = useState<string>()
  const zones = [
    {id: 'sources', icon: FileTextIcon, title: t('Enterprise data', '企业全域数据'), items: [t('Files & media', '文件与媒体'), t('Business tables', '业务数据表'), t('Semantic definitions', '语义定义')]},
    {id: 'knowledge', icon: LayersIcon, title: t('Prepare & update', '持续准备与更新'), items: [t('Basic understanding', '基础理解'), t('Embeddings & indexes', '向量与索引'), t('Reusable knowledge', '可复用知识')]},
    {id: 'tasks', icon: MagnifyingGlassIcon, title: t('Context on demand', '在线上下文服务'), items: [t('Find relevant parts', '检索相关内容'), t('Understand missing details', '补充深度理解'), t('Publish new knowledge', '沉淀新增知识')]},
    {id: 'integration', icon: CubeIcon, title: t('Your agents', '接入你的 Agent'), items: ['MCP Tools', 'Skills', t('Existing & built-in agents', '现有与内置 Agent')]},
  ]
  return <div className="context-architecture" onMouseLeave={() => setActive(undefined)}>
    <div className="context-architecture-zones">{zones.map(({id, icon: Icon, title, items}, i) => <div className="context-architecture-node" key={id}>
      <a href={'#' + id} data-active={active === id || (active === 'knowledge' && id === 'tasks') || (active === 'tasks' && id === 'knowledge')}
        onMouseEnter={() => setActive(id)} onFocus={() => setActive(id)} onBlur={() => setActive(undefined)}>
        <Icon aria-hidden="true"/><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
      </a>{i < zones.length - 1 && <ArrowRightIcon className="architecture-arrow" aria-hidden="true"/>}
    </div>)}</div>
    <div className="architecture-return"><span>↔</span><p>{t('Read what is already known. Publish new understanding back to the data space.', '读取已有知识，将新增理解沉淀回数据空间。')}</p></div>
    <a href="#management" className="architecture-management" onMouseEnter={() => setActive('management')}><GearIcon aria-hidden="true"/><strong>{t('People stay in control', '面向人的协同与管理')}</strong><span>{t('Configure · verify · track runs · inspect usage', '配置、核验、追踪运行、查看用量')}</span><ArrowRightIcon aria-hidden="true"/></a>
  </div>
}
