import useBaseUrl from '@docusaurus/useBaseUrl'
import {useEffect, useRef, useState, type FormEvent} from 'react'
import {useLocation} from '@docusaurus/router'
import MarketingLayout from '../components/MarketingLayout'
import Box from '../components/Box'
import Button from '../components/Button'
import {Link} from '../router'
import {useSiteLocale} from '../siteI18n'
import {CONTACT_EMAIL, CONTACT_MAILTO} from '../siteLinks'
import {demoBusinessIdentity, demoModalities, demoScenarios, demoSources, validateDemo, type DemoField, type DemoPayload, type FieldError} from '../demoContract'
import {solutions} from '../content/solutions'
import {track} from '../analytics'

const empty = {name:'',email:'',company:'',need:'',notes:'',modalities:[] as string[]}
type Availability = {state:'loading' | 'ready' | 'unavailable'; retention:number}
export default function Demo() {
  const locale = useSiteLocale()
  const {search} = useLocation()
  const poster = useBaseUrl('/showcase/marketing/comp_001-poster.45b2669dc293.webp')
  const query = new URLSearchParams(search)
  const source = demoSources.includes(query.get('source') as typeof demoSources[number]) ? query.get('source')! : 'direct'
  const scenario = demoScenarios.includes(query.get('scenario') as typeof demoScenarios[number]) ? query.get('scenario')! : ''
  const solution = solutions.find(s => s.id === scenario)
  const [form, setForm] = useState(() => ({...empty, need: solution?.need[locale] ?? '', modalities: ['video','image','audio'].includes(query.get('media') ?? '') ? [query.get('media')!] : []}))
  const [errors, setErrors] = useState<Partial<Record<DemoField, FieldError>>>({})
  const [availability, setAvailability] = useState<Availability>({state:'loading',retention:90})
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState('')
  const [received, setReceived] = useState('')
  const attempt = useRef<{key:string; identity:string} | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const submittingRef = useRef(false)
  const t = (en: string, zh: string) => locale === 'en' ? en : zh
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/demo-status', {signal:AbortSignal.any([controller.signal,AbortSignal.timeout(8000)])}).then(r => {if (!r.ok) throw new Error(); return r.json()}).then(data => setAvailability({state:data.available === true ? 'ready' : 'unavailable',retention:Number(data.retention_days) || 90})).catch(() => {if (!controller.signal.aborted) setAvailability({state:'unavailable',retention:90})})
    const frame = requestAnimationFrame(() => {
      try {const saved = sessionStorage.getItem('vane-demo-received'); if (saved && /^[0-9a-f-]{36}$/i.test(saved)) setReceived(saved)} catch { /* Storage can be disabled without affecting submission. */ }
    })
    return () => {controller.abort(); cancelAnimationFrame(frame)}
  }, [])
  const label: Record<DemoField, string> = {name:t('Name','姓名'), email:t('Work email','工作邮箱'),company:t('Company or team','公司 / 团队'),need:t('What would you like to solve?','希望解决什么问题？'),notes:t('Additional details (optional)','其他说明（可选）'),modalities:t('Data types (optional)','主要资料类型（可选）')}
  const message = (field: DemoField) => errors[field] === 'required' ? t('Please fill out this field.', '请填写此项。') : errors[field] === 'too_long' ? t('This field is too long.', '内容超过长度限制。') : t('Please enter a valid value.', '请填写有效内容。')
  const change = (field: keyof typeof form, value: string | string[]) => {setForm(f=>({...f,[field]:value})); setErrors(e=>({...e,[field]:undefined})); setFailure('')}
  const recheckAvailability=async()=>{
    setAvailability(a=>({...a,state:'loading'}))
    try {const r=await fetch('/api/demo-status',{signal:AbortSignal.timeout(8000)}); if(!r.ok)throw new Error();const data=await r.json();setAvailability({state:data.available===true?'ready':'unavailable',retention:Number(data.retention_days)||90});if(data.available)setFailure('')}
    catch {setAvailability(a=>({...a,state:'unavailable'}))}
  }
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return
    const checked = validateDemo({...form,locale,source,scenario})
    setErrors(checked.fieldErrors)
    if (!checked.payload) {const field = Object.keys(checked.fieldErrors)[0]; formRef.current?.querySelector<HTMLElement>('[name="' + field + '"]')?.focus(); return}
    if (availability.state !== 'ready') {setFailure('unavailable'); return}
    const payload: DemoPayload = checked.payload
    const identity = demoBusinessIdentity(payload)
    if (!attempt.current || attempt.current.identity !== identity) attempt.current = {key:crypto.randomUUID(),identity}
    submittingRef.current=true; setSubmitting(true); setFailure('')
    const controller = new AbortController(), timeout = setTimeout(()=>controller.abort(),20000)
    try {
      const response = await fetch('/api/demo-requests', {method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':attempt.current.key},body:JSON.stringify(payload),signal:controller.signal})
      const data = await response.json()
      if (response.ok && data.status === 'received' && typeof data.request_id === 'string' && /^[0-9a-f-]{36}$/i.test(data.request_id)) {
        setReceived(data.request_id)
        try {sessionStorage.setItem('vane-demo-received',data.request_id)} catch { /* Receipt remains visible in memory. */ }
        track('demo_submit_success', {product:'context',locale,scenario})
      } else {
        const code = response.status === 429 ? 'rate_limited' : response.status === 409 ? 'conflict' : response.status === 400 && data.field_errors ? 'fields' : 'unavailable'
        if (code === 'fields') {setErrors(data.field_errors); const field=Object.keys(data.field_errors)[0]; formRef.current?.querySelector<HTMLElement>('[name="' + field + '"]')?.focus()}
        if (code === 'conflict') attempt.current = null
        setFailure(code); track('demo_submit_error',{product:'context',locale,code})
      }
    } catch {setFailure('unknown'); track('demo_submit_error',{product:'context',locale,code:'network'})}
    finally {clearTimeout(timeout); submittingRef.current=false; setSubmitting(false)}
  }
  const errorCopy: Record<string,string> = {
    unknown:t('We could not confirm the result. Please retry; your entries are preserved.', '尚未确认提交结果，请重试。已保留你的填写内容。'),
    unavailable:t('The form is temporarily unavailable. Please try again later or contact us by email.', '申请表暂时不可用，请稍后重试，或通过邮箱联系。'),
    rate_limited:t('Too many requests. Please try again later; you do not need to refill the form.', '提交较频繁，请稍后重试，无需重新填写。'),
    conflict:t('This attempt conflicts with an earlier submission. Retry to submit your current details.', '本次提交与先前内容存在冲突。再次提交会使用新的申请标识。'),
    fields:t('Please review the highlighted fields.', '请检查标出的字段。'),
  }
  return <MarketingLayout noIndex={Boolean(received)} title={t('Request a Vane Context demo','预约 Vane Context 演示')} description={t('Discuss your multimodal data, applications and agents with the Vane team.', '与 Vane 团队一起评估多模态资料、应用和 Agent 的接入。')}>
    <section className="section demo-page"><div className="wrap demo-grid">
      <div className="demo-description"><h1 className="h1">{t('See it working', '看看它如何处理')}<br/>{t('with your use case.', '你的多模态资料。')}</h1><p className="lead">{t('Tell us what you want to build. We will discuss your data and arrange a product demonstration.', '说说你想完成什么。我们会进一步了解资料与需求，并安排产品演示。')}</p><ul className="demo-benefits"><li>{t('Find the understanding capabilities that fit your media.', '确认适合资料的理解能力。')}</li><li>{t('See search, analysis and source references in action.', '了解检索、分析与引用的实际表现。')}</li><li>{t('Plan integration, models and deployment together.', '讨论应用接入、模型与部署要求。')}</li></ul><img className="demo-product-image" src={poster} alt={t('The original camping drink video used in the showcase.', '展台使用的原始露营饮品视频。')}/><p className="marketing-note">{t('No files or credentials are needed for this form.', '申请表无需提交文件或模型凭证。')}</p></div>
      <Box className="demo-form-card">
        {received ? <div className="demo-received" role="status"><span className="receipt-check">✓</span><h2>{t('Your request is received.', '申请已收到。')}</h2><p>{t('We will contact you at the email you provided to learn more and arrange a demonstration.', '我们会通过所填邮箱联系你，进一步了解需求并安排演示。')}</p><div className="receipt-id">{t('Request number', '申请编号')}<code>{received}</code></div><p className="marketing-note">{t('This confirms receipt of your request; a meeting time will be agreed separately.', '这里确认的是申请接收，具体演示时间会后续沟通。')}</p><Button to="/products/context">{t('Back to Vane Context', '返回 Vane Context')}</Button><button className="text-button" type="button" onClick={()=>{setReceived(''); attempt.current=null; try{sessionStorage.removeItem('vane-demo-received')}catch{/* no storage */}}}>{t('Submit another request','提交另一份申请')}</button></div> :
        <form ref={formRef} noValidate onSubmit={onSubmit}><h2>{t('Tell us about your use case.', '先说说你的场景。')}</h2>
          <fieldset disabled={submitting}>
            <div className="demo-field-row">{(['name','email'] as const).map(field=><label className="demo-field" key={field}><span id={'demo-label-'+field}>{label[field]} *</span><input aria-labelledby={'demo-label-'+field} name={field} type={field === 'email' ? 'email':'text'} autoComplete={field} value={form[field]} maxLength={field === 'email'?254:80} required aria-invalid={Boolean(errors[field])} aria-describedby={errors[field]?'error-'+field:undefined} onChange={e=>change(field,e.target.value)}/>{errors[field]&&<small id={'error-'+field} className="field-error">{message(field)}</small>}</label>)}</div>
            <label className="demo-field"><span id="demo-label-company">{label.company} *</span><input aria-labelledby="demo-label-company" name="company" autoComplete="organization" value={form.company} maxLength={160} required aria-invalid={Boolean(errors.company)} aria-describedby={errors.company?'error-company':undefined} onChange={e=>change('company',e.target.value)} placeholder={t('Company, team or independent project','公司、团队或个人项目')}/>{errors.company&&<small id="error-company" className="field-error">{message('company')}</small>}</label>
            <label className="demo-field"><span id="demo-label-need">{label.need} *</span><textarea aria-labelledby="demo-label-need" name="need" rows={4} value={form.need} maxLength={2000} required aria-invalid={Boolean(errors.need)} aria-describedby={errors.need?'error-need':undefined} onChange={e=>change('need',e.target.value)} placeholder={t('Your media, the result you need, and the app or agent you are building.','你的资料类型、希望获得的结果，以及现有应用或 Agent。')}/>{errors.need&&<small id="error-need" className="field-error">{message('need')}</small>}</label>
            <fieldset className="demo-modalities"><legend>{label.modalities}</legend>{demoModalities.map(m=><label key={m}><input type="checkbox" name="modalities" value={m} checked={form.modalities.includes(m)} onChange={e=>change('modalities',e.target.checked?[...form.modalities,m]:form.modalities.filter(v=>v!==m))}/>{({video:t('Video','视频'),audio:t('Audio','音频'),image:t('Images','图片'),pdf:t('Documents','文档'),text:t('Text / records','文本 / 记录')})[m]}</label>)}</fieldset>
            <label className="demo-field"><span id="demo-label-notes">{label.notes}</span><textarea aria-labelledby="demo-label-notes" name="notes" rows={2} value={form.notes} maxLength={1000} onChange={e=>change('notes',e.target.value)} placeholder={t('Scale, existing systems or other details.','资料规模、现有系统或其他补充。')}/></label>
            <p className="demo-privacy">{t('We use these details to contact you and arrange the demo. Requests are kept for ','信息用于联系与安排演示，申请记录保留 ')}{availability.retention}{t(' days. ',' 天。')}<Link to="/privacy">{t('Privacy details','查看隐私说明')}</Link></p>
            <button className="btn btn-solid demo-submit" type="submit" disabled={availability.state === 'loading'}>{submitting?t('Submitting…','正在提交…'):t('Request a demo','申请产品演示')}<span aria-hidden="true"> →</span></button>
          </fieldset>
          {(failure || availability.state === 'unavailable') && <div className="demo-submit-error" role="alert"><p>{errorCopy[failure || 'unavailable']}</p>{availability.state==='unavailable' && <button className="text-button" type="button" onClick={()=>void recheckAvailability()}>{t('Check again','重新检查')}</button>}<a href={CONTACT_MAILTO}>{t('Contact ','联系 ')}{CONTACT_EMAIL} ↗</a><small>{t('Send your message from your email client.','请在邮件客户端中发送消息。')}</small></div>}
        </form>}
      </Box>
    </div></section>
  </MarketingLayout>
}
