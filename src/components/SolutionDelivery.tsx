import {useState} from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {ArrowRightIcon, CheckIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../siteI18n'
import {Link} from '../router'

export default function SolutionDelivery() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [open, setOpen] = useState(false)
  const photo = useBaseUrl('/showcase/marketing/comp_001-pouring.43384a49eeac.webp')
  return <div className="solution-delivery">
    <div className="delivery-script"><span className="result-caption">{t('Marketing agent output', '营销 Agent 输出示例')}</span><h3>{t('Creative direction grounded in your own material.', '让创意有素材可用、有事实可依')}</h3><p>{t('Open on a campsite. Show the ingredients going in, the blending action and the drink being served. Keep claims within the approved product facts.', '从露营场景切入，依次呈现放入食材、启动搅拌、倒出饮品的动作，产品表达遵循已确认的品牌事实。')}</p><button type="button" className="delivery-evidence-trigger" aria-expanded={open} onClick={() => setOpen(!open)}><img src={photo} width={480} height={854} loading="lazy" alt={t('An original drink-serving shot.', '原始素材中的倒出饮品镜头。')}/><span>{t('View the sources and business definitions', '查看使用的素材与业务定义')}<small>comp_001 / 00:05–00:11</small></span><ArrowRightIcon aria-hidden="true"/></button></div>
    <div className="delivery-foundations" hidden={!open}>{[
      [t('Task-specific processing', '场景化解析'), t('Recognize setting, opening, demonstration and useful action windows.', '提取使用场景、开场方式、演示动作与可用时间片段。')],
      [t('Semantic layer', '语义层'), t('Link creative IDs to campaign records and agreed measurement definitions.', '通过素材 ID 关联投放记录与明确的指标口径。')],
      [t('Agent Skill', 'Agent Skill'), t('Guide the agent to retrieve material, verify sources and follow brand guidelines.', '指导 Agent 检索资料、核对来源，并遵循品牌规范。')],
    ].map(([label, description]) => <div key={label}><CheckIcon aria-hidden="true"/><div><strong>{label}</strong><p>{description}</p></div></div>)}</div>
    <p className="marketing-note">{t('Example creative output. Campaign metrics come from connected business records.', '脚本为演示示例；投放指标来自接入的业务数据。')}</p><Link className="arrow-link" to="/solutions">{t('Explore agent solutions', '查看六大 Agent 解决方案')}<ArrowRightIcon aria-hidden="true"/></Link>
  </div>
}
