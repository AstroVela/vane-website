import { useState, type FormEvent } from 'react'
import Head from '@docusaurus/Head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import PixelIcon, { type PixelIconName } from '../components/PixelIcon'
import { pickLocale, useSiteLocale } from '../siteI18n'
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  DESIGN_PARTNER_MAILTO,
  DISCORD_URL,
  GITHUB_URL,
} from '../siteLinks'

const CONTACT_OPTIONS = [
  {
    value: 'Evaluate Vane for multimodal data pipelines',
    labelZh: '评估 Vane 用于多模态数据 pipeline',
  },
  {
    value: 'Enterprise agent data infrastructure',
    labelZh: '企业 Agent 数据基础设施',
  },
  {
    value: 'Training data pipeline design',
    labelZh: '训练数据 pipeline 设计',
  },
  {
    value: 'Technical question',
    labelZh: '技术问题',
  },
  {
    value: 'Partnership',
    labelZh: '合作',
  },
  {
    value: 'Other',
    labelZh: '其他',
  },
]

const CONTACT_ROUTES: Array<{
  title: string
  titleZh: string
  copy: string
  copyZh: string
  href: string
  icon: PixelIconName
}> = [
  {
    title: 'Design partner',
    titleZh: '设计伙伴',
    copy: 'Scope a real multimodal workload with the Vane team.',
    copyZh: '和 Vane 团队一起梳理一个真实的多模态工作负载。',
    href: DESIGN_PARTNER_MAILTO,
    icon: 'multimodal',
  },
  {
    title: 'Technical question',
    titleZh: '技术问题',
    copy: 'Ask about SQL, Python UDFs, Ray execution, or deployment shape.',
    copyZh: '咨询 SQL、Python UDF、Ray 执行或部署形态相关问题。',
    href: `${GITHUB_URL}/discussions`,
    icon: 'preprocessing',
  },
  {
    title: 'Community',
    titleZh: '社区',
    copy: 'Join the Discord for project updates and faster informal questions.',
    copyZh: '加入 Discord，获取项目更新，也可以更快进行非正式提问。',
    href: DISCORD_URL,
    icon: 'retrieval',
  },
]

const fieldValue = (data: FormData, name: string) => {
  const value = data.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

export default function Contact() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      title: 'Contact the Vane team',
      description: 'Contact the Vane team about multimodal data pipelines, enterprise agent data infrastructure, training data workflows, partnerships, and technical questions.',
      ogDescription: 'Tell us what you are building with multimodal data. We aim to reply within 48 hours.',
      eyebrow: 'Contact',
      heading: 'Talk to the Vane team.',
      lead: 'Tell us what you are building with multimodal data. We aim to reply within 48 hours and route the conversation to the right engineer.',
      designPartner: 'Become a design partner',
      discord: 'Join Discord',
      signalAria: 'Contact workflow',
      intake: 'intake',
      triage: 'triage',
      reply: 'reply',
      response: 'target response: 48h',
      messageLabel: 'Message',
      formTitle: 'What should we know?',
      name: 'Name',
      email: 'Work email',
      company: 'Company',
      interest: 'Interest',
      select: 'Select one',
      placeholder: 'Workload, data shape, scale, current stack, timeline...',
      send: 'Send message',
      submitted: 'Email draft opened. You can send it from your mail client.',
      routes: 'Useful routes',
      routesTitle: 'Pick the path that matches your question.',
      open: 'Open',
      subjectPrefix: 'Vane contact',
      general: 'General inquiry',
      bodyLabels: {
        name: 'Name',
        email: 'Email',
        company: 'Company',
        interest: 'Interest',
        message: 'Message',
      },
    },
    {
      title: '联系 Vane 团队',
      description: '联系 Vane 团队，讨论多模态数据 pipeline、企业 Agent 数据基础设施、训练数据 workflow、合作和技术问题。',
      ogDescription: '告诉我们你正在用多模态数据构建什么。我们会尽量在 48 小时内回复。',
      eyebrow: '联系',
      heading: '和 Vane 团队聊聊。',
      lead: '告诉我们你正在用多模态数据构建什么。我们会尽量在 48 小时内回复，并把对话转给合适的工程师。',
      designPartner: '成为设计伙伴',
      discord: '加入 Discord',
      signalAria: '联系流程',
      intake: '接收',
      triage: '分流',
      reply: '回复',
      response: '目标回复时间：48h',
      messageLabel: '消息',
      formTitle: '我们需要了解什么？',
      name: '姓名',
      email: '工作邮箱',
      company: '公司',
      interest: '关注方向',
      select: '请选择',
      placeholder: '工作负载、数据形态、规模、当前技术栈、时间线...',
      send: '发送消息',
      submitted: '邮件草稿已打开，你可以在邮件客户端中发送。',
      routes: '可用路径',
      routesTitle: '选择与你的问题匹配的路径。',
      open: '打开',
      subjectPrefix: 'Vane contact',
      general: '一般咨询',
      bodyLabels: {
        name: '姓名',
        email: '邮箱',
        company: '公司',
        interest: '关注方向',
        message: '消息',
      },
    },
  )
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const name = fieldValue(data, 'name')
    const email = fieldValue(data, 'email')
    const company = fieldValue(data, 'company')
    const interest = fieldValue(data, 'interest')
    const message = fieldValue(data, 'message')

    const subject = `${copy.subjectPrefix}: ${interest || copy.general}`
    const body = [
      `${copy.bodyLabels.name}: ${name}`,
      `${copy.bodyLabels.email}: ${email}`,
      `${copy.bodyLabels.company}: ${company || '-'}`,
      `${copy.bodyLabels.interest}: ${interest || '-'}`,
      '',
      `${copy.bodyLabels.message}:`,
      message,
    ].join('\n')

    window.location.href = `${CONTACT_MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>{copy.title}</title>
        <meta
          name="description"
          content={copy.description}
        />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.ogDescription} />
      </Head>

      <Nav />

      <section className="intro contact-hero">
        <div className="wrap contact-grid">
          <div className="contact-copy">
            <Eyebrow style={{ marginBottom: 20 }}>{copy.eyebrow}</Eyebrow>
            <h1 className="h1 contact-title">{copy.heading}</h1>
            <p className="lead contact-lead">
              {copy.lead}
            </p>
            <div className="contact-actions">
              <Button solid href={DESIGN_PARTNER_MAILTO} arrow>{copy.designPartner}</Button>
              <Button href={DISCORD_URL} target="_blank" rel="noreferrer">{copy.discord}</Button>
            </div>
            <div className="contact-signal" aria-label={copy.signalAria}>
              <div className="contact-signal-row">
                <span>{copy.intake}</span>
                <b>→</b>
                <span>{copy.triage}</span>
                <b>→</b>
                <span>{copy.reply}</span>
              </div>
              <div className="contact-signal-meta">
                <span>{CONTACT_EMAIL}</span>
                <span>{copy.response}</span>
              </div>
            </div>
          </div>

          <Box as="form" id="contact-form" className="contact-form-card" onSubmit={onSubmit}>
            <div className="contact-form-head">
              <span className="azt">{copy.messageLabel}</span>
              <h2>{copy.formTitle}</h2>
            </div>
            <div className="contact-form-grid">
              <label className="contact-field">
                <span>{copy.name}</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label className="contact-field">
                <span>{copy.email}</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>
            <label className="contact-field">
              <span>{copy.company}</span>
              <input name="company" type="text" autoComplete="organization" />
            </label>
            <label className="contact-field">
              <span>{copy.interest}</span>
              <select name="interest" required defaultValue="">
                <option value="" disabled>{copy.select}</option>
                {CONTACT_OPTIONS.map((option) => (
                  <option value={option.value} key={option.value}>{pickLocale(locale, option.value, option.labelZh)}</option>
                ))}
              </select>
            </label>
            <label className="contact-field">
              <span>{copy.messageLabel}</span>
              <textarea
                name="message"
                rows={6}
                required
                placeholder={copy.placeholder}
              />
            </label>
            <div className="contact-form-foot">
              <button type="submit" className="btn btn-solid contact-submit">
                {copy.send} <span className="ar">→</span>
              </button>
              {submitted && (
                <p role="status">
                  {copy.submitted}
                </p>
              )}
            </div>
          </Box>
        </div>
      </section>

      <div className="wrap"><div className="ddiv" /></div>

      <section className="section contact-routes-section">
        <div className="wrap">
          <div className="shead">
            <Eyebrow>{copy.routes}</Eyebrow>
            <h2 className="h2">{copy.routesTitle}</h2>
          </div>
          <div className="contact-route-grid">
            {CONTACT_ROUTES.map((route) => (
              <Box as="a" flat className="contact-route-card" href={route.href} key={route.title}>
                <span className="ic"><PixelIcon name={route.icon} size={18} /></span>
                <h3>{pickLocale(locale, route.title, route.titleZh)}</h3>
                <p>{pickLocale(locale, route.copy, route.copyZh)}</p>
                <span className="contact-route-cta">{copy.open} <span className="ar">→</span></span>
              </Box>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
