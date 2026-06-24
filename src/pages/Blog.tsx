import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import Cta from '../components/Cta'

export default function Blog() {
  return (
    <>
      <Nav />

      <section className="intro">
        <div className="wrap">
          <Eyebrow>Blog</Eyebrow>
          <h1 className="h1" style={{ marginTop: 16, fontSize: 'clamp(34px,4.6vw,52px)' }}>
            Notes from the Vane team
          </h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: 640 }}>
            Engineering notes, release deep dives, and field reports will appear here.
          </p>
        </div>
      </section>

      <div className="wrap"><div className="ddiv" /></div>

      <section className="section" style={{ padding: '44px 0 20px' }}>
        <div className="wrap">
          <Box style={{ padding: '30px 32px' }}>
            <div className="azt" style={{ textAlign: 'left' }}>Coming Soon</div>
            <h2 className="h2" style={{ marginTop: 12 }}>No posts published yet.</h2>
            <p className="lead" style={{ marginTop: 14, maxWidth: 620 }}>
              This page is reserved for long-form updates on multimodal data pipelines,
              benchmarks, and production usage patterns.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Button solid to="/docs" arrow>Read the Docs</Button>
              <Button to="/benchmarks">View benchmarks</Button>
            </div>
          </Box>
        </div>
      </section>

      <div className="wrap"><div className="ddiv" /></div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>Read the Docs</Button>
            <Button to="/use-cases">Explore use cases</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
