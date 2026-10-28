import useBrokenLinks from '@docusaurus/useBrokenLinks'
import {useLocation} from '@docusaurus/router'
import {ArrowRightIcon} from '@radix-ui/react-icons'
import MarketingLayout from '../components/MarketingLayout'
import Button from '../components/Button'
import CaseExperience from '../components/usecases/CaseExperience'
import SolutionPreview from '../components/usecases/SolutionPreview'
import UseCaseDeliveryPlan from '../components/usecases/UseCaseDeliveryPlan'
import {EquipmentHypotheses} from '../components/usecases/EquipmentExperience'
import {agentUseCases, casePagePath, caseDemoPath} from '../content/useCases'
import {solutionPages} from '../content/solutionPages'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'
import '../solutionPages.css'

export default function AgentUseCase() {
  const {pathname} = useLocation(), locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const scenario = agentUseCases.find(item => item.id === pathname.split('/').filter(Boolean).at(-1)) ?? agentUseCases[4]
  const page = solutionPages[scenario.id], next = agentUseCases[(agentUseCases.indexOf(scenario) + 1) % agentUseCases.length]
  const anchors = useBrokenLinks()
  for (const id of ['case-example', 'case-semantics', 'case-reuse', 'case-integration']) anchors.collectAnchor(id)
  return <MarketingLayout title={scenario.name[locale] + ' | Vane Context'} description={scenario.summary[locale]} ctaTo={caseDemoPath(scenario.id)}>
    <div className="solution-page">
      <section className="marketing-product-hero solution-hero"><div className="wrap">
        <div className="solution-hero-layout"><div className="case-hero-copy"><span className="product-badge">Vane Context · {scenario.name[locale]}</span><h1 className="h1">{scenario.title[locale]}</h1><p className="lead">{scenario.summary[locale]}</p><div className="marketing-actions"><Button solid to={caseDemoPath(scenario.id)} arrow>{t('Request a demo', '预约演示')}</Button><a href="#case-example">{t('Explore the example', '查看示例')}<ArrowRightIcon aria-hidden="true" /></a></div><p className="case-audience">{scenario.audience[locale]}</p></div>
          <SolutionPreview scenario={scenario} />
        </div>
        <div className="solution-source-strip"><span>{t('BRING YOUR SOURCES', '接入你的资料')}</span>{scenario.sources.map(source => <span key={source.en}>{source[locale]}</span>)}</div>
      </div></section>
      <section className="section marketing-section solution-example-section" id="case-example"><div className="wrap">
        <div className="section-heading"><h2 className="h2">{page.demoTitle[locale]}</h2><p>{page.demoIntro[locale]}</p></div>
        <CaseExperience key={scenario.id} scenario={scenario} />
      </div></section>
      <section className="section marketing-section solution-semantics" id="case-semantics"><div className="wrap">
        <div className="section-heading"><h2 className="h2">{page.semanticTitle[locale]}</h2><p>{page.semanticIntro[locale]}</p></div>
        {scenario.id === 'equipment-diagnosis' && <EquipmentHypotheses />}
        <ol className="solution-entity-flow">{page.entities.map((entity, index) => <li key={entity.title.en}><span className="solution-entity-index">0{index + 1}</span><div><h3>{entity.title[locale]}</h3><p>{entity.body[locale]}</p></div>{index < page.entities.length - 1 && <ArrowRightIcon aria-hidden="true" />}</li>)}</ol>
        <p className="solution-semantic-note">{page.semanticNote[locale]}</p>
      </div></section>
      <section className="section marketing-section solution-reuse" id="case-reuse"><div className="wrap">
        <div className="section-heading"><h2 className="h2">{page.reuseTitle[locale]}</h2><p>{scenario.reuse[locale]}</p><Link className="arrow-link" to="/products/context#cost">{t('How ongoing costs are reduced', '了解如何降低持续成本')}<ArrowRightIcon aria-hidden="true" /></Link></div>
        <ol className="solution-reuse-steps">{page.reuseSteps.map((step, index) => <li key={step.title.en}><span className="solution-step-index">0{index + 1}</span><h3>{step.title[locale]}</h3><p>{step.body[locale]}</p></li>)}</ol>
        <div className="solution-context-delivery"><span className="solution-label">{t('What reaches the agent', '最终交给 Agent')}</span><p>{t('The findings this task needs, with source references. Read supporting details when needed; keep valid understanding available for the next authorized task.', '当前任务需要的发现与来源引用。需要细节时按引用续读，有效理解继续服务下一次授权任务。')}</p></div>
      </div></section>
      <section className="section marketing-section" id="case-integration"><div className="wrap">
        <div className="section-heading"><h2 className="h2">{page.deliveryTitle[locale]}</h2><p>{scenario.integration[locale]}</p></div>
        <UseCaseDeliveryPlan id={scenario.id} />
        <div className="solution-handoff"><div><span className="solution-label">{t('Your agent provides', 'Agent 提供')}</span><p>{t('The task, known facts and constraints.', '业务任务、已有事实与限制。')}</p></div><ArrowRightIcon aria-hidden="true" /><div><span className="solution-label">Vane Context</span><p>{t('Relevant findings, conditions, references and unresolved gaps.', '相关发现、适用条件、原始引用与待核实事项。')}</p></div><ArrowRightIcon aria-hidden="true" /><div><span className="solution-label">{t('Your agent continues', 'Agent 继续')}</span><p>{scenario.action[locale]}</p></div></div>
        <div className="solution-integration-note"><p>{t('Connect through MCP tools and a task-aware Skill. Let your business agent use the tools directly or delegate context preparation.', '通过 MCP 工具与场景 Skill 接入。业务 Agent 可以直接使用工具，也可以委托整理上下文。')}</p><Link className="arrow-link" to="/products/context#integration">{t('See the integration options', '了解接入方式')}<ArrowRightIcon aria-hidden="true" /></Link></div>
      </div></section>
      <section className="section marketing-final-cta solution-final-cta"><div className="wrap"><div><span className="value-label">{scenario.name[locale]}</span><h2 className="h2">{page.ctaTitle[locale]}</h2><p>{page.ctaBody[locale]}</p></div><div className="marketing-actions"><Button solid to={caseDemoPath(scenario.id)} arrow>{t('Request a demo', '预约演示')}</Button><Link to="/products/context">{t('Explore Vane Context', '了解 Vane Context')}<ArrowRightIcon aria-hidden="true" /></Link></div></div></section>
      <div className="wrap solution-next-case"><Link to="/solutions">{t('All solutions', '全部解决方案')}</Link><Link to={casePagePath(next.id)}>{t('Next: ', '下一个场景：')}{next.name[locale]}<ArrowRightIcon aria-hidden="true" /></Link></div>
    </div>
  </MarketingLayout>
}
