import { useState, type FormEvent } from 'react'
import Head from '@docusaurus/Head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import PixelIcon, { type PixelIconName } from '../components/PixelIcon'
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  DESIGN_PARTNER_MAILTO,
  DISCORD_URL,
  GITHUB_URL,
} from '../siteLinks'

const CONTACT_OPTIONS = [
  'Evaluate Vane for multimodal data pipelines',
  'Enterprise agent data infrastructure',
  'Training data pipeline design',
  'Technical question',
  'Partnership',
  'Other',
]

const CONTACT_ROUTES: Array<{
  title: string
  copy: string
  href: string
  icon: PixelIconName
}> = [
  {
    title: 'Design partner',
    copy: 'Scope a real multimodal workload with the Vane team.',
    href: DESIGN_PARTNER_MAILTO,
    icon: 'multimodal',
  },
  {
    title: 'Technical question',
    copy: 'Ask about SQL, Python UDFs, Ray execution, or deployment shape.',
    href: `${GITHUB_URL}/discussions`,
    icon: 'preprocessing',
  },
  {
    title: 'Community',
    copy: 'Join the Discord for project updates and faster informal questions.',
    href: DISCORD_URL,
    icon: 'retrieval',
  },
]

const fieldValue = (data: FormData, name: string) => {
  const value = data.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const name = fieldValue(data, 'name')
    const email = fieldValue(data, 'email')
    const company = fieldValue(data, 'company')
    const interest = fieldValue(data, 'interest')
    const message = fieldValue(data, 'message')

    const subject = `Vane contact: ${interest || 'General inquiry'}`
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || '-'}`,
      `Interest: ${interest || '-'}`,
      '',
      'Message:',
      message,
    ].join('\n')

    window.location.href = `${CONTACT_MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Contact the Vane team</title>
        <meta
          name="description"
          content="Contact the Vane team about multimodal data pipelines, enterprise agent data infrastructure, training data workflows, partnerships, and technical questions."
        />
        <meta property="og:title" content="Contact the Vane team" />
        <meta property="og:description" content="Tell us what you are building with multimodal data. We aim to reply within 48 hours." />
      </Head>

      <Nav />

      <section className="intro contact-hero">
        <div className="wrap contact-grid">
          <div className="contact-copy">
            <Eyebrow style={{ marginBottom: 20 }}>Contact</Eyebrow>
            <h1 className="h1 contact-title">Talk to the Vane team.</h1>
            <p className="lead contact-lead">
              Tell us what you are building with multimodal data. We aim to reply within 48 hours and route the conversation to the right engineer.
            </p>
            <div className="contact-actions">
              <Button solid href={DESIGN_PARTNER_MAILTO} arrow>Become a design partner</Button>
              <Button href={DISCORD_URL} target="_blank" rel="noreferrer">Join Discord</Button>
            </div>
            <div className="contact-signal" aria-label="Contact workflow">
              <div className="contact-signal-row">
                <span>intake</span>
                <b>→</b>
                <span>triage</span>
                <b>→</b>
                <span>reply</span>
              </div>
              <div className="contact-signal-meta">
                <span>{CONTACT_EMAIL}</span>
                <span>target response: 48h</span>
              </div>
            </div>
          </div>

          <Box as="form" id="contact-form" className="contact-form-card" onSubmit={onSubmit}>
            <div className="contact-form-head">
              <span className="azt">Message</span>
              <h2>What should we know?</h2>
            </div>
            <div className="contact-form-grid">
              <label className="contact-field">
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label className="contact-field">
                <span>Work email</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>
            <label className="contact-field">
              <span>Company</span>
              <input name="company" type="text" autoComplete="organization" />
            </label>
            <label className="contact-field">
              <span>Interest</span>
              <select name="interest" required defaultValue="">
                <option value="" disabled>Select one</option>
                {CONTACT_OPTIONS.map((option) => (
                  <option value={option} key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="contact-field">
              <span>Message</span>
              <textarea
                name="message"
                rows={6}
                required
                placeholder="Workload, data shape, scale, current stack, timeline..."
              />
            </label>
            <div className="contact-form-foot">
              <button type="submit" className="btn btn-solid contact-submit">
                Send message <span className="ar">→</span>
              </button>
              {submitted && (
                <p role="status">
                  Email draft opened. You can send it from your mail client.
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
            <Eyebrow>Useful routes</Eyebrow>
            <h2 className="h2">Pick the path that matches your question.</h2>
          </div>
          <div className="contact-route-grid">
            {CONTACT_ROUTES.map((route) => (
              <Box as="a" flat className="contact-route-card" href={route.href} key={route.title}>
                <span className="ic"><PixelIcon name={route.icon} size={18} /></span>
                <h3>{route.title}</h3>
                <p>{route.copy}</p>
                <span className="contact-route-cta">Open <span className="ar">→</span></span>
              </Box>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
