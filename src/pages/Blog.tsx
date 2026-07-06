import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Box from '../components/Box'
import Button from '../components/Button'
import Eyebrow from '../components/Eyebrow'
import Cta from '../components/Cta'
import { pickLocale, useSiteLocale } from '../siteI18n'

export default function Blog() {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      eyebrow: 'Blog',
      heading: 'Notes from the Vane team',
      lead: 'Engineering notes, release deep dives, and field reports will appear here.',
      soon: 'Coming Soon',
      empty: 'No posts published yet.',
      reserved: 'This page is reserved for long-form updates on multimodal data pipelines, benchmarks, and production usage patterns.',
      readDocs: 'Read the Docs',
      benchmarks: 'View benchmarks',
      explore: 'Explore use cases',
    },
    {
      eyebrow: '博客',
      heading: 'Vane 团队笔记',
      lead: '这里会发布工程笔记、版本深度解读和实践报告。',
      soon: '即将推出',
      empty: '还没有发布文章。',
      reserved: '这个页面会用于发布多模态数据 pipeline、基准测试和生产使用模式相关的长文更新。',
      readDocs: '阅读文档',
      benchmarks: '查看基准测试',
      explore: '浏览使用场景',
    },
  )

  return (
    <>
      <Nav />

      <section className="intro">
        <div className="wrap">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 className="h1" style={{ marginTop: 16, fontSize: 'clamp(34px,4.6vw,52px)' }}>
            {copy.heading}
          </h1>
          <p className="lead" style={{ marginTop: 18, maxWidth: 640 }}>
            {copy.lead}
          </p>
        </div>
      </section>

      <div className="wrap"><div className="ddiv" /></div>

      <section className="section" style={{ padding: '44px 0 20px' }}>
        <div className="wrap">
          <Box style={{ padding: '30px 32px' }}>
            <div className="azt" style={{ textAlign: 'left' }}>{copy.soon}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{copy.empty}</h2>
            <p className="lead" style={{ marginTop: 14, maxWidth: 620 }}>
              {copy.reserved}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
              <Button solid to="/docs" arrow>{copy.readDocs}</Button>
              <Button to="/benchmarks">{copy.benchmarks}</Button>
            </div>
          </Box>
        </div>
      </section>

      <div className="wrap"><div className="ddiv" /></div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Cta>
            <Button solid to="/docs" arrow>{copy.readDocs}</Button>
            <Button to="/use-cases">{copy.explore}</Button>
          </Cta>
        </div>
      </section>

      <Footer />
    </>
  )
}
