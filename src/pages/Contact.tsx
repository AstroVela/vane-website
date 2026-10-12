import MarketingLayout from '../components/MarketingLayout'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import {useSiteLocale} from '../siteI18n'
import {CONTACT_EMAIL,CONTACT_MAILTO,DISCORD_URL,GITHUB_URL} from '../siteLinks'
export default function Contact() {
  const locale=useSiteLocale(),t=(en:string,zh:string)=>locale==='en'?en:zh
  return <MarketingLayout title={t('Contact the Vane team','联系 Vane 团队')} description={t('Product demonstrations, open source questions and partnerships.','产品演示、开源技术问题与合作。')}>
    <section className="section marketing-section"><div className="wrap"><Eyebrow>{t('CONTACT','联系')}</Eyebrow><h1 className="h1">{t('Let us know what you are building.','说说你正在构建什么。')}</h1><p className="lead">{t('Choose the route that matches your question.','选择与你的问题对应的联系入口。')}</p><div className="marketing-three-grid">
      <Box className="capability-card"><span className="product-badge">Vane Context</span><h3>{t('A demo for your use case','针对你的场景预约演示')}</h3><p>{t('Discuss your multimodal data, models and application integration.','讨论多模态资料、模型与应用接入。')}</p><Button solid to="/demo?source=contact" arrow>{t('Request Demo','预约演示')}</Button></Box>
      <Box className="capability-card"><span className="product-badge">Vane Data</span><h3>{t('Technical questions and community','技术讨论与社区')}</h3><p>{t('Ask about the open source data engine and share your pipeline.','讨论开源数据引擎，分享你的处理流水线。')}</p><Button href={GITHUB_URL+'/discussions'} target="_blank" rel="noreferrer">GitHub Discussions ↗</Button><a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord ↗</a></Box>
      <Box className="capability-card"><span className="product-badge">{t('Partnerships','合作')}</span><h3>{t('Other ways to work together','其他合作')}</h3><p>{t('Contact the team for partnerships and general inquiries.','合作与其他问题可以直接联系团队。')}</p><a href={CONTACT_MAILTO}>{CONTACT_EMAIL} ↗</a></Box>
    </div></div></section>
  </MarketingLayout>
}
