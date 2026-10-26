import CodeWindow from './CodeWindow'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function AgentIntegration() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const config = JSON.stringify({mcpServers: {vanecontext: {url: '<MCP_ENDPOINT_URL>', headers: {Authorization: 'Bearer <CONNECTION_TOKEN>'}}}}, null, 2)
  const steps = [
    [t('Connect your MCP client', '连接 MCP 客户端'), t('Choose the data spaces and capabilities to share. Copy the connection settings into your agent’s MCP client.', '选定开放的数据空间与能力，将服务提供的连接配置复制到 Agent 的 MCP 客户端。')],
    [t('Verify tools and guidance', '验证工具与使用指引'), t('Ask the agent to check the connection and discover the available tools and Skills. Only authorized, published guidance is returned.', '让 Agent 检查连接，发现可用工具与 Skills。服务只返回授权范围内已发布的使用指引。')],
    [t('Start with a business task', '直接提出业务任务'), t('Give the agent your task, known facts and constraints. It reads relevant Skills when needed and retrieves or prepares context through the tools.', '说明业务任务、已有事实与限制。Agent 按需读取相关 Skills，通过工具检索资料或请求准备上下文。')],
  ]
  return <div className="agent-integration">
    <div className="agent-connection">
      <ol className="integration-steps">{steps.map(([title, body], index) => <li key={title}><span className="integration-step-number">0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
      <details className="integration-config"><summary>{t('View an example MCP configuration', '查看 MCP 连接配置示例')}</summary><CodeWindow filename="mcp-config.json" language="json" code={config}/><p>{t('Use the endpoint and token from your service. The exact configuration format depends on your MCP client.', '填写服务提供的端点与令牌；具体配置格式以所用 MCP 客户端为准。')}</p></details>
      <Link className="arrow-link" to="/demo?source=context-integration">{t('See it with your agent', '用你的 Agent 验证接入')} →</Link>
    </div>
    <div className="integration-guidance">
      <span className="value-label">{t('Guidance that fits the task', '随任务按需获取的指引')}</span>
      <h3>{t('The right Skill, when your agent needs it.', '需要哪份 Skill，就读取哪份')}</h3>
      <p>{t('The service exposes guidance and scenario Skills through the same connection. Your agent discovers their purpose and version, then reads only the instructions relevant to the task.', '同一连接提供服务指引与场景 Skills。Agent 先发现用途和版本，再读取当前任务相关的说明，无需用户预先挑选和安装。')}</p>
      <div className="integration-skill-flow" aria-label={t('Skill discovery and reading', 'Skill 发现与读取')}><div><strong>{t('Discover', '发现')}</strong><code>list_context_skills</code><span>{t('Purpose · scope · version', '用途 · 范围 · 版本')}</span></div><span aria-hidden="true">→</span><div><strong>{t('Read as needed', '按需读取')}</strong><code>read_context_skill</code><span>SKILL.md + {t('references', '参考资料')}</span></div></div>
      <div className="integration-roles"><div><h4>{t('Use tools directly', '直接使用数据工具')}</h4><p>{t('Let your agent search, query, inspect evidence and request authorized processing within its own workflow.', 'Agent 在自己的任务流程中检索、查询、核对证据，并发起已授权的素材处理。')}</p></div><div><h4>{t('Delegate context research', '委托准备上下文')}</h4><p>{t('Let a Context Agent investigate missing enterprise information and return findings, sources and gaps. Your agent continues the business task.', '由 Context Agent 调查缺少的企业资料，返回结果、来源与缺口；业务 Agent 继续完成任务。')}</p></div></div>
      <p className="integration-note">{t('Built-in and external agents use the same guidance. Clients with MCP Skills support can discover Skills natively; other clients use the guidance tools. Available actions always follow the service’s permissions.', '内置与外部 Agent 使用相同的指引。支持 MCP Skills 的客户端可原生发现技能，其他客户端通过指引工具读取；实际可用操作始终受服务权限约束。')}</p>
    </div>
  </div>
}
