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
  return (
    <>
      <Head>
        <title>AI pipeline use cases — Vane</title>
        <meta
          name="description"
          content="Explore Vane use cases for multimodal AI pipelines: embeddings, semantic search, deduplication, image pipelines, generation, structured multimodal output, and voice analytics."
        />
        <meta property="og:title" content="AI pipeline use cases — Vane" />
        <meta property="og:description" content="Real AI pipeline examples for embeddings, search, deduplication, images, generation, multimodal structured output, and voice analytics." />
      </Head>

      <Nav />

      {/* INTRO */}
      <section className="intro">
        <div className="wrap">
          <Eyebrow>Use Cases</Eyebrow>
          <h1 className="h1" style={{ marginTop: 16, fontSize: 'clamp(34px,4.6vw,52px)' }}>
            AI pipelines Vane is built for
          </h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: 620 }}>
            Real user scenarios, not just examples. Each one is the same shape: the problem, the pipeline, the code, what goes in and out, and when to reach for it.
          </p>
          <div className="chips">
            {USE_CASES.map((u) => (
              <a className="chip" href={`#${u.id}`} key={u.id}>{u.title}</a>
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
                <h2>{u.title}</h2>
                <span className="tg">{u.tag}</span>
              </div>
              <Pipeline steps={u.pipeline} />
              <div className="uc-body">
                <div>
                  <div className="field">
                    <div className="ftt">Problem</div>
                    <p>{u.problem}</p>
                  </div>
                  <div className="field">
                    <div className="ftt">Input / Output</div>
                    <div className="io">
                      <div className="cell"><div className="k">input</div><div className="v">{u.input}</div></div>
                      <div className="cell"><div className="k">output</div><div className="v">{u.output}</div></div>
                    </div>
                  </div>
                  <div className="field">
                    <div className="ftt">When to use it</div>
                    <p>{u.when}</p>
                  </div>
                </div>
                <CodeWindow filename={u.filename} code={u.code} />
              </div>
              <div className="exrow">
                <span className="ex">Example: <u>{u.example}</u></span>
                <Button sm to="/docs" arrow>Open example</Button>
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
            <Button solid to="/docs" arrow>Read the Docs</Button>
            <Button to="/benchmarks">See benchmarks</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
