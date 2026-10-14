import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowDownIcon, ArrowUpIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../siteI18n'

export default function ContextArchitecture() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const src = useBaseUrl(`/img/products/context-architecture-${locale}.svg`)
  return <div className="context-architecture">
    <img className="product-diagram-desktop" src={src} width={1700} height={1160} loading="lazy"
      alt={t('Vane Context architecture. Enterprise data feeds preparation and a shared data space. Context services retrieve and deepen understanding, publish knowledge back, and serve business agents through MCP Tools and Skills. Vane Data supports processing; human oversight spans the product.', 'Vane Context 架构：企业数据进入准备流程和数据空间；在线上下文服务读取知识、补充理解并沉淀回数据空间，通过 MCP Tools 与 Skills 服务业务 Agent。Vane Data 支撑处理，人的管理贯穿产品。')}/>
    <div className="context-architecture-mobile product-diagram-mobile">
      <div className="context-mobile-sources"><h3>{t('Enterprise data', '企业数据')}</h3><p>{t('Files & media · Business tables · External semantic definitions', '文件与媒体 · 业务数据表 · 外部语义定义')}</p></div>
      <ArrowDownIcon className="diagram-down" aria-hidden="true"/>
      <div className="context-mobile-boundary"><h3>Vane Context</h3>
        <div className="context-mobile-preparation"><h4>{t('Prepare & update', '持续准备与更新')}</h4><p>{t('Sync changes → basic understanding → embeddings & indexes', '同步变化 → 基础理解 → 向量与索引')}</p></div>
        <ArrowDownIcon className="diagram-down" aria-hidden="true"/>
        <div className="context-mobile-space"><h4>{t('Data space', '数据空间')}</h4><p>{t('Files & media · Tables · Knowledge · Semantic definitions · Search indexes', '文件与媒体 · 数据表 · 知识 · 语义定义 · 检索索引')}</p><small>{t('Business tables and external definitions can stay in their source systems and be bound here.', '业务表与外部定义可保留在来源系统，通过连接绑定。')}</small></div>
        <div className="context-mobile-loop"><span><ArrowDownIcon aria-hidden="true"/>{t('Read knowledge', '读取已有知识')}</span><span><ArrowUpIcon aria-hidden="true"/>{t('Publish insights', '沉淀新理解')}</span></div>
        <div className="context-mobile-service"><h4>{t('Context service', '在线上下文服务')}</h4><p>{t('Search & business queries · On-demand understanding and media processing', '检索与业务查询 · 按需深度理解与素材处理')}</p><div className="context-mobile-agent"><strong>Context Agent</strong><span>{t('Optional autonomous planning', '可选择的自主编排')}</span></div></div>
        <div className="context-mobile-call">↑ {t('Request', '请求')} <span>↓ {t('Cited results', '带引用结果')}</span></div>
        <div className="context-mobile-integration"><h4>{t('Agent integration', 'Agent 接入')}</h4><p>MCP Tools · Skills</p><small>{t('Tools expose capabilities; Skills guide their use.', '工具提供能力，Skill 指导使用。')}</small></div>
        <div className="context-mobile-engine"><h4>Vane Data</h4><p>{t('Supports preparation and online processing: native media, UDFs, AI Functions, relational queries and vector search.', '支撑准备与在线处理：原生媒体、UDF、AI Function、关系查询与向量检索。')}</p></div>
        <div className="context-mobile-governance"><h4>{t('Human oversight', '人的协同与管理')}</h4><p>{t('Verify evidence · Manage definitions · Resolve issues · Inspect usage', '核验依据 · 调整定义 · 处理问题 · 查看用量')}</p></div>
      </div>
      <div className="context-mobile-call">↑ {t('Request', '请求')} <span>↓ {t('Result', '结果')}</span></div>
      <div className="context-mobile-agents"><h3>{t('Business agents', '业务 Agents')}</h3><p>{t('Create, decide and execute business tasks.', '最终创作与业务执行。')}</p></div>
    </div>
    <div className="diagram-summary">
      <p>{t('Prepare basic knowledge as data changes.', '随资料变化，持续准备基础知识。')}</p>
      <p>{t('Deepen understanding when a task needs it.', '围绕任务需要，补充深度理解。')}</p>
      <p>{t('Let future tasks use what is already learned.', '新理解回到数据空间，供后续任务使用。')}</p>
    </div>
  </div>
}
