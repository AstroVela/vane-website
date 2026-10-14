import {useState} from 'react'
import {useLocation} from '@docusaurus/router'
import {ArrowRightIcon, CheckIcon} from '@radix-ui/react-icons'
import MarketingLayout from '../components/MarketingLayout'
import Button from '../components/Button'
import CaseExperience from '../components/usecases/CaseExperience'
import {agentUseCases, casePagePath, caseDemoPath} from '../content/useCases'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function AgentUseCase() {
  const {pathname} = useLocation(), locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const scenario = agentUseCases.find(item => item.id === pathname.split('/').filter(Boolean).at(-1)) ?? agentUseCases[4]
  const [repeat, setRepeat] = useState(false)
  const next = agentUseCases[(agentUseCases.indexOf(scenario)+1)%agentUseCases.length]
  return <MarketingLayout title={scenario.name[locale]+' | Vane Context'} description={scenario.summary[locale]} ctaTo={caseDemoPath(scenario.id)}>
    <section className="marketing-product-hero case-page-hero"><div className="wrap">
      <Link className="case-breadcrumb" to="/solutions">{t('Use cases', '应用场景')} / {scenario.name[locale]}</Link>
      <div className="case-hero-layout"><div className="case-hero-copy"><span className="product-badge">Vane Context</span><h1 className="h1">{scenario.title[locale]}</h1><p className="lead">{scenario.summary[locale]}</p><div className="marketing-actions"><Button solid to={caseDemoPath(scenario.id)} arrow>{t('Request Demo', '预约演示')}</Button><a href="#case-integration">{t('How to connect', '如何接入')}<ArrowRightIcon aria-hidden="true" /></a></div><p className="case-audience">{scenario.audience[locale]}</p></div>
        <CaseExperience key={scenario.id} scenario={scenario} />
      </div>
    </div></section>
    <section className="section marketing-section"><div className="wrap">
      <div className="section-heading"><h2 className="h2">{t('The context behind the next action.', '让下一步行动，有据可依。')}</h2><p>{t('Connect the permitted sources. Give the agent the relevant findings and a way back to the evidence.', '连接授权资料，把相关理解和原始依据一起交给 Agent。')}</p></div>
      <div className="case-handoff"><div className="case-inputs"><span className="value-label">{t('Connected sources', '接入的资料')}</span>{scenario.sources.map(source => <p key={source.en}>{source[locale]}</p>)}</div><div className="case-outputs"><h3>{t('Vane Context provides', 'Vane Context 提供的上下文')}</h3><ul>{scenario.outputs.map(output => <li key={output.en}><CheckIcon aria-hidden="true" /><span>{output[locale]}</span></li>)}</ul></div><div className="case-agent-action"><div><span className="value-label">{t('Your business agent', '业务 Agent 的下一步')}</span><strong>{scenario.agent}</strong></div><p>{scenario.action[locale]}</p></div></div>
    </div></section>
    <section className="section marketing-section case-continuity"><div className="wrap case-continuity-layout">
      <div className="section-heading"><h2 className="h2">{t('Keep the knowledge.', '让已完成的理解，')}<br />{t('Reduce the repeated work.', '继续服务下一次任务。')}</h2><p>{t('Prepare relevant knowledge once. Reuse what is still valid, and investigate what has changed.', '沉淀与任务相关的知识，复用仍有效的内容，再补充新的变化。')}</p><Link className="arrow-link" to="/products/context#cost">{t('How ongoing costs are reduced', '了解如何降低持续成本')}<ArrowRightIcon aria-hidden="true" /></Link></div>
      <div className="case-repeat"><div className="case-choice-row" role="group" aria-label={t('Knowledge across tasks', '任务间的知识复用')}><button type="button" aria-pressed={!repeat} onClick={() => setRepeat(false)}>{t('First task', '首次任务')}</button><button type="button" aria-pressed={repeat} onClick={() => setRepeat(true)}>{t('Next task', '后续任务')}</button></div><div className="case-repeat-result" aria-live="polite"><h3>{repeat ? t('Start with what is already known.', '从已有理解出发。') : t('Understand the material the task needs.', '理解当前任务需要的资料。')}</h3><p>{repeat ? scenario.reuse[locale] : t('Discover relevant material, inspect the parts that need deeper understanding and retain source-backed knowledge for later authorized requests.', '发现相关资料，按需理解关键部分，并沉淀带来源的知识，供后续授权请求使用。')}</p><h4>{repeat ? t('When something changes', '当资料或需求变化时') : t('What the agent receives', '交付给 Agent 的内容')}</h4><p>{repeat ? scenario.update[locale] : t('Focused findings with source references. Supporting details remain available to read when the task needs them.', '精简的相关理解与来源引用，任务需要细节时再按引用续读。')}</p></div></div>
    </div></section>
    <section className="section marketing-section" id="case-integration"><div className="wrap case-integration-layout"><div><h2 className="h2">{t('Work with the agent you are building.', '接入你正在建设的 Agent。')}</h2><p className="lead">{scenario.integration[locale]}</p></div><div className="case-integration-links"><h3>{t('Bring your application. Connect its context.', '保留业务应用，接入所需上下文。')}</h3><p>{t('Use API, SDK or MCP with the appropriate source permissions and models. Your application supplies the business task and continues the work.', '通过 API、SDK 或 MCP 接入，配置资料权限与模型。业务应用提供任务，再使用返回的上下文继续工作。')}</p><Link className="arrow-link" to="/docs/context/integration">{t('Read the integration guide', '阅读接入说明')}<ArrowRightIcon aria-hidden="true" /></Link><Link className="arrow-link" to="/docs/context/references">{t('Understand source references', '了解来源引用')}<ArrowRightIcon aria-hidden="true" /></Link></div></div></section>
    <section className="section marketing-final-cta"><div className="wrap"><div><span className="value-label">{scenario.name[locale]}</span><h2 className="h2">{t('See it with your use case.', '结合你的场景，看看实际效果。')}</h2></div><div className="marketing-actions"><Button solid to={caseDemoPath(scenario.id)} arrow>{t('Request Demo', '预约演示')}</Button><Link to={casePagePath(next.id)}>{next.name[locale]}<ArrowRightIcon aria-hidden="true" /></Link></div></div></section>
  </MarketingLayout>
}
