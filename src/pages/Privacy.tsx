import {useEffect, useState} from 'react'
import MarketingLayout from '../components/MarketingLayout'
import {useSiteLocale} from '../siteI18n'
import {CONTACT_EMAIL, CONTACT_MAILTO} from '../siteLinks'
export default function Privacy() {
  const locale = useSiteLocale(), t = (en:string,zh:string)=>locale==='en'?en:zh
  const [days,setDays] = useState(90)
  useEffect(()=>{const controller=new AbortController(); fetch('/api/demo-status',{signal:controller.signal}).then(r=>r.json()).then(d=>{if(Number.isInteger(d.retention_days))setDays(d.retention_days)}).catch(()=>{});return()=>controller.abort()},[])
  return <MarketingLayout title={t('Website privacy','官网隐私说明')} description={t('How Vane handles demonstration requests submitted through this website.','Vane 如何处理通过官网提交的产品演示申请。')}>
    <article className="wrap marketing-prose"><span className="product-badge">VANE / PRIVACY</span><h1 className="h1">{t('Your demo request.','你的演示申请。')}</h1><p>{t('This notice covers the Vane website operated by the AstroVela / Vane team. Contact us at ','本说明适用于 AstroVela / Vane 团队运营的官网。联系邮箱：')}<a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>{t('.','。')}</p>
      <h2>{t('What we collect','收集什么')}</h2><p>{t('The demo form collects your name, email, company or team, use case, optional media types and additional notes. We also save the source page, example scenario, language and submission time. It does not accept files or model credentials.','演示申请表收集姓名、邮箱、公司或团队、需求，以及可选的资料类型与补充说明。另保存来源页面、示例场景、语言和提交时间，不接收文件或模型凭证。')}</p>
      <h2>{t('How the information is used','用于什么')}</h2><p>{t('We use the request to understand your needs, contact you and arrange a product demonstration. The form does not enroll you in a marketing subscription.','这些信息用于了解需求、联系你和安排产品演示。填写申请不会自动订阅营销邮件。')}</p>
      <h2>{t('Storage and notifications','存储与通知')}</h2><p>{t('Requests are stored in SQLite on the website server. Team notifications are sent through the configured email provider, by default Resend. Access to stored requests is restricted to authorized operations staff. Personal form fields are not included in website analytics events.','申请记录存储在官网服务端的 SQLite；团队通知通过配置的邮件服务发送，默认使用 Resend。仅授权运营人员可访问申请记录；个人表单字段不进入官网分析事件。')}</p>
      <h2>{t('Retention and contact','保留期限与联系')}</h2><p>{t('Requests are retained for ','申请记录保留 ')}{days}{t(' days, then deleted by scheduled cleanup. Contact the team to correct or remove your request. Short-lived hashed network addresses are used for submission rate limits; raw addresses are not saved in request records.',' 天，之后通过定时任务删除。如需更正或删除申请，请联系团队。提交限流使用短期网络地址哈希，原始地址不写入申请记录。')}</p>
      <h2>{t('Browser storage','浏览器存储')}</h2><p>{t('After a successful submission, the browser can keep its request number for the current tab session. Form fields are not persisted there. Media examples and their results are bundled content; browsing them does not submit a task to a model service.','提交成功后，浏览器可在当前标签页会话中保存申请编号，不保存表单字段。示例媒体与结果随官网交付，浏览案例不会向模型服务提交任务。')}</p>
    </article>
  </MarketingLayout>
}
