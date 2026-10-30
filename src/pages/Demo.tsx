import useBaseUrl from '@docusaurus/useBaseUrl'
import {useState} from 'react'
import {useLocation} from '@docusaurus/router'
import MarketingLayout from '../components/MarketingLayout'
import Box from '../components/Box'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {CONTACT_EMAIL} from '../siteLinks'
import {solutions} from '../content/solutions'
import {agentUseCases} from '../content/useCases'

export default function Demo() {
  const locale = useSiteLocale()
  const {search} = useLocation()
  const poster = useBaseUrl('/showcase/marketing/comp_005-image.b3187abe73e8.webp')
  const scenario = new URLSearchParams(search).get('scenario')
  const agentCase = agentUseCases.find(item => item.id === scenario)
  const solution = solutions.find(item => item.id === scenario)
  const brief = agentCase?.need[locale] ?? solution?.need[locale]
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  async function copyEmail() {
    try {await navigator.clipboard.writeText(CONTACT_EMAIL); setCopyState('copied')}
    catch {setCopyState('manual')}
  }
  return <MarketingLayout title={t('Request a Vane Context demo','预约 Vane Context 演示')} description={t('Discuss your multimodal data, applications and agents with the Vane team.', '与 Vane 团队一起评估多模态资料、应用和 Agent 的接入。')}>
    <section className="section demo-page"><div className="wrap demo-grid">
      <div className="demo-description"><h1 className="h1">{t('See it working', '看看它如何处理')}<br/>{t('with your use case.', '你的多模态资料')}</h1><p className="lead">{t('Tell us what you want to build. We will discuss your data and arrange a product demonstration.', '说说你想完成什么。我们会进一步了解资料与需求，并安排产品演示。')}</p><ul className="demo-benefits"><li>{t('See the material your agent can use, with original evidence.', '看看 Agent 能获得哪些可用资料与原始依据。')}</li><li>{t('Discuss on-demand processing, knowledge reuse and ongoing costs.', '评估按需处理、知识复用与持续使用成本。')}</li><li>{t('Plan a practical integration with your data, models and applications.', '结合已有数据、模型与应用，确定可落地的接入方式。')}</li></ul><div className="demo-evidence"><div className="demo-evidence-image focus-frame"><img src={poster} width={576} height={1024} alt={t('Ingredients and a blender on a kitchen counter.', '厨房台面上的食材与搅拌杯。')} loading="lazy" /></div><div><span className="evidence-link">{t('From image to insight', '从画面到理解')}</span><p>{t('Objects. Words. Meaning.', '物体、文字与含义。')}<br />{t('All connected to the source.', '每一项，都有原始依据。')}</p><Link to="/products/context">{t('Explore Vane Context', '了解 Vane Context')} →</Link></div></div><p className="marketing-note">{t('No files or credentials are needed to start the conversation.', '初次沟通无需提供文件或模型凭证。')}</p></div>
      <Box flat className="demo-contact-card">
        <h2>{t('Let’s talk about your use case.', '聊聊你的应用场景')}</h2>
        <p>{t('Contact our team at the email address below to arrange a product demo.', '通过以下邮箱联系团队，预约产品演示。')}</p>
        <p className="demo-contact-email">{CONTACT_EMAIL}</p>
        <button className="btn btn-solid demo-copy-email" type="button" onClick={()=>void copyEmail()}>{t('Copy email address', '复制联系邮箱')}</button>
        <p className="demo-copy-status" role="status">{copyState === 'copied' ? t('Email address copied. Use it in your preferred email app.', '邮箱已复制，请在你常用的邮箱中联系团队。') : copyState === 'manual' ? t('Please select and copy the email address above.', '请选中上方邮箱地址并手动复制。') : ''}</p>
        {agentCase && <p className="demo-selected-case">{t('Demo focus: ', '演示场景：')}{agentCase.name[locale]}</p>}
        {brief && <p className="demo-use-case">{brief}</p>}
        <h3>{t('A few details help us prepare', '这些信息能帮助我们准备演示')}</h3>
        <ul className="demo-contact-details">
          <li>{t('Your company or team, and what you are building.', '你的公司或团队，以及正在构建的应用。')}</li>
          <li>{t('The data you work with: video, images, audio, documents or business data.', '资料类型：视频、图片、音频、文档或业务数据。')}</li>
          <li>{t('The task you want your agent to complete.', '希望 Agent 完成的业务任务。')}</li>
        </ul>
        <p className="marketing-note">{t('A short introduction is enough. We’ll follow up to discuss your needs and a suitable demo.', '简单介绍即可，我们会进一步沟通需求与演示安排。')} <Link to="/privacy">{t('Privacy details', '隐私说明')}</Link></p>
      </Box>
    </div></section>
  </MarketingLayout>
}
