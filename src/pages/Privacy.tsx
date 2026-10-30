import MarketingLayout from '../components/MarketingLayout'
import {useSiteLocale} from '../siteI18n'
import {CONTACT_EMAIL, CONTACT_MAILTO} from '../siteLinks'
export default function Privacy() {
  const locale = useSiteLocale(), t = (en:string,zh:string)=>locale==='en'?en:zh
  return <MarketingLayout title={t('Website privacy','官网隐私说明')} description={t('How the Vane website handles contact details and demo inquiries.','Vane 官网如何处理联系信息与演示咨询。')}>
    <article className="wrap marketing-prose"><span className="product-badge">VANE / PRIVACY</span><h1 className="h1">{t('Your privacy.','你的隐私')}</h1><p>{t('This notice covers the Vane website operated by the AstroVela / Vane team. Contact us at ','本说明适用于 AstroVela / Vane 团队运营的官网。联系邮箱：')}<a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>{t('.','。')}</p>
      <h2>{t('Contacting us','联系团队')}</h2><p>{t('The contact and demo pages provide our email address. They do not collect or submit a request form. Copying the address copies it to your clipboard; it does not send a message or book a demonstration.','联系与演示页面提供团队邮箱，不收集或提交申请表。复制邮箱只会将地址放入你的剪贴板，不会发送消息或完成演示预约。')}</p>
      <h2>{t('Information you choose to share','你主动提供的信息')}</h2><p>{t('If you email us, we use the information you provide to respond to your inquiry and discuss a demonstration. Please do not include passwords, model credentials or sensitive business data. An inquiry does not enroll you in a marketing subscription.','如果你通过邮件联系团队，我们会使用你主动提供的信息回复咨询、沟通演示安排。请勿发送密码、模型凭证或敏感业务数据。咨询不会自动订阅营销邮件。')}</p>
      <h2>{t('Browsing and storage','浏览与存储')}</h2><p>{t('The contact and demo pages do not save personal form fields or request receipts in your browser. Media examples and results are bundled content; viewing them does not submit a task to a model service. Website hosting may process standard access logs to serve and protect the site.','联系与演示页面不会在浏览器中保存个人表单信息或申请回执。示例媒体与结果随官网交付，浏览案例不会向模型服务提交任务。网站托管服务可能处理用于提供和保护网站的常规访问日志。')}</p>
      <h2>{t('Questions about your information','信息相关问题')}</h2><p>{t('Contact the team at the address above to ask about, correct or request deletion of information you have shared with us.','如需了解、更正或申请删除你主动提供的信息，请通过上方邮箱联系团队。')}</p>
    </article>
  </MarketingLayout>
}
