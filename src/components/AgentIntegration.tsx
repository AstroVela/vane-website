import {useId, useState} from 'react'
import CodeWindow from './CodeWindow'
import FeatureTabs from './FeatureTabs'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function AgentIntegration() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh, id = useId()
  const [step, setStep] = useState('mcp')
  const config = JSON.stringify({mcpServers: {vanecontext: {url: '<MCP_ENDPOINT_URL>', headers: {Authorization: 'Bearer <CONNECTION_TOKEN>'}}}}, null, 2)
  const skill = t(`# VaneContext

Use authorized data when the business task needs it.
For cross-source investigation, call prepare_context with
the task, known facts and constraints.
Keep the task ID. Read the same task to continue.
Inspect evidence references when more detail is needed.
Reuse valid knowledge before requesting new processing.`, `# VaneContext

业务任务需要资料时，使用授权的数据空间。
需要跨来源调查时，向 prepare_context 说明
业务任务、已有事实与限制。
保留任务 ID，续读同一任务，不重复创建。
需要细节时按证据引用续读。
优先使用已有知识，缺少理解时再申请处理。`)
  const calls = [
    {name: 'prepare_context', title: t('Explain the task and existing facts', '说明任务与已有事实'), input: {task: t('Prepare material for a camping video script.', '为露营主题视频脚本准备资料。'), background: t('Use approved product facts and our brand guidelines.', '使用已确认的产品事实与品牌要求。'), request_key: 'camping-script-01'}, result: {task_id: 'ctx-example-01', status: 'running'}},
    {name: 'get_context_task', title: t('Continue the same task', '继续读取同一任务'), input: {task_id: 'ctx-example-01', wait_for_result: true}, result: {status: 'completed', summary: t('Relevant action references are ready.', '相关动作参考已准备。'), findings: [{source: 'comp_001', time: '00:05–00:07'}]}},
    {name: 'read_evidence', title: t('Read a cited source in more detail', '按引用读取更多依据'), input: {evidence_ref: '<RETURNED_EVIDENCE_REF>'}, result: {source: 'comp_001', locator: {start: 5, end: 7}, excerpt: t('The blender is operating on an outdoor table.', '搅拌机在户外桌面上运行。')}},
  ]
  return <div className="agent-integration">
    <div className="agent-connection"><FeatureTabs options={[{id: 'mcp', label: t('Connect MCP', '连接 MCP')}, {id: 'skill', label: t('Load Skill', '加载 Skill')}]} value={step} onChange={setStep} label={t('Agent connection steps', 'Agent 接入步骤')} panelId={id}/><div role="tabpanel" id={id} aria-labelledby={`${id}-${step}`}><CodeWindow key={step + locale} filename={step === 'mcp' ? 'agent-config.json' : 'SKILL.md'} language={step === 'mcp' ? 'json' : 'markdown'} code={step === 'mcp' ? config : skill}/><p>{step === 'mcp' ? t('Copy your endpoint and token from connection management. Configuration syntax depends on your MCP client.', '从接入管理复制端点和令牌，具体配置格式以 MCP 客户端为准。') : t('Install the Skill package supplied by the service. Built-in agents load it automatically.', '安装服务提供的 Skill 包，内置 Agent 会自动加载。')}</p></div><Link className="arrow-link" to="/docs/context/integration">{t('Read the integration guide', '阅读接入指南')} →</Link></div>
    <div className="agent-call-story"><span className="result-caption">{t('Illustrated agent interaction', 'Agent 调用示意')}</span><h3>{t('From a brief to material it can use.', '从业务任务，到可用资料。')}</h3>{calls.map(call => <details key={call.name}><summary><code>{call.name}</code><span>{call.title}</span></summary><CodeWindow filename={call.name + '.json'} language="json" code={JSON.stringify({input: call.input, output: call.result}, null, 2)} copyable={false}/></details>)}<p>{t('The business agent uses the returned material to create, decide and act.', '业务 Agent 使用返回的资料，继续创作、判断和执行。')}</p><details className="agent-advanced"><summary>{t('Advanced: use individual tools', '高级接入：直接使用资料工具')}</summary><p>{t('Discover sources, inspect schemas, search, query and read evidence directly when your agent owns the investigation.', 'Agent 自行调查时，可直接使用资料发现、结构检查、检索、查询与证据读取工具。')}</p></details></div>
  </div>
}
