import { Fragment, type PropsWithChildren } from 'react'
import Head from '@docusaurus/Head'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import CodeWindow from '../components/CodeWindow'
import Cta from '../components/Cta'
import PixelIcon from '../components/PixelIcon'
import { USE_CASES } from './useCasesData'
import { pickLocale, useSiteLocale } from '../siteI18n'

function Pipeline({ steps }: { steps: string[] }) {
  return (
    <div className="pipeline">
      {steps.map((s, i) => (
        <Fragment key={i}>
          <span className="pstep">{s}</span>
          {i < steps.length - 1 && <span className="psep">→</span>}
        </Fragment>
      ))}
    </div>
  )
}

function UseCaseBlock({ id, children }: PropsWithChildren<{ id: string }>) {
  const brokenLinks = useBrokenLinks()
  brokenLinks.collectAnchor(id)

  return (
    <Box className="uc-block" id={id}>
      {children}
    </Box>
  )
}

export default function UseCases() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      title: 'AI pipeline use cases — Vane',
      description: 'Explore Vane use cases for multimodal AI pipelines: embeddings, semantic search, deduplication, image pipelines, generation, structured multimodal output, and voice analytics.',
      ogDescription: 'Real AI pipeline examples for embeddings, search, deduplication, images, generation, multimodal structured output, and voice analytics.',
      eyebrow: 'Use Cases',
      heading: 'AI pipelines Vane is built for',
      lead: 'Real user scenarios, not just examples. Each one is the same shape: the problem, the pipeline, the code, what goes in and out, and when to reach for it.',
      problem: 'Problem',
      io: 'Input / Output',
      input: 'input',
      output: 'output',
      when: 'When to use it',
      example: 'Example:',
      openExample: 'Open example',
      readDocs: 'Read the Docs',
      seeBenchmarks: 'See benchmarks',
    },
    {
      title: 'AI pipeline 使用场景 — Vane',
      description: '了解 Vane 面向多模态 AI pipeline 的使用场景：embedding、语义搜索、去重、图像 pipeline、生成、结构化多模态输出和语音分析。',
      ogDescription: '面向 embedding、搜索、去重、图像、生成、多模态结构化输出和语音分析的真实 AI pipeline 示例。',
      eyebrow: '使用场景',
      heading: 'Vane 面向这些 AI pipeline 构建',
      lead: '这里是实际用户场景，不只是示例。每个场景都按同一结构展开：问题、pipeline、代码、输入输出，以及什么时候适合使用。',
      problem: '问题',
      io: '输入 / 输出',
      input: '输入',
      output: '输出',
      when: '适用时机',
      example: '示例：',
      openExample: '打开示例',
      readDocs: '阅读文档',
      seeBenchmarks: '查看基准测试',
    },
  )

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

      {/* INTRO */}
      <section className="intro">
        <div className="wrap">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 className="h1" style={{ marginTop: 16, fontSize: 'clamp(34px,4.6vw,52px)' }}>
            {copy.heading}
          </h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: 620 }}>
            {copy.lead}
          </p>
          <div className="chips">
            {USE_CASES.map((u) => (
              <a className="chip" href={`#${u.id}`} key={u.id}>{pickLocale(locale, u.title, u.titleZh)}</a>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap"><div className="ddiv" /></div>

      <section className="section" style={{ padding: '44px 0 20px' }}>
        <div className="wrap">
          {USE_CASES.map((u) => (
            <UseCaseBlock id={u.id} key={u.id}>
              <div className="uc-head">
                <span className="ic"><PixelIcon name={u.icon} size={18} /></span>
                <h2>{pickLocale(locale, u.title, u.titleZh)}</h2>
                <span className="tg">{pickLocale(locale, u.tag, u.tagZh)}</span>
              </div>
              <Pipeline steps={pickLocale(locale, u.pipeline, u.pipelineZh)} />
              <div className="uc-body">
                <div>
                  <div className="field">
                    <div className="ftt">{copy.problem}</div>
                    <p>{pickLocale(locale, u.problem, u.problemZh)}</p>
                  </div>
                  <div className="field">
                    <div className="ftt">{copy.io}</div>
                    <div className="io">
                      <div className="cell"><div className="k">{copy.input}</div><div className="v">{pickLocale(locale, u.input, u.inputZh)}</div></div>
                      <div className="cell"><div className="k">{copy.output}</div><div className="v">{pickLocale(locale, u.output, u.outputZh)}</div></div>
                    </div>
                  </div>
                  <div className="field">
                    <div className="ftt">{copy.when}</div>
                    <p>{pickLocale(locale, u.when, u.whenZh)}</p>
                  </div>
                </div>
                <CodeWindow filename={u.filename} code={u.code} />
              </div>
              <div className="exrow">
                <span className="ex">{copy.example} <u>{u.example}</u></span>
                <Button sm to="/docs" arrow>{copy.openExample}</Button>
              </div>
            </UseCaseBlock>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="wrap"><div className="ddiv" /></div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>{copy.readDocs}</Button>
            <Button to="/benchmarks">{copy.seeBenchmarks}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
