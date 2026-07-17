import { Link } from '../router'
import { pickLocale, useSiteLocale } from '../siteI18n'
import Mark from './Mark'
import { DISCORD_URL, GITHUB_URL } from '../siteLinks'

/* Paper footer with ink text, organized as a 5-column sitemap. The `home`
   variant adds the `pip install` line in the brand column; the link columns
   are identical across variants. */
export default function Footer({ home = false }: { home?: boolean }) {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      homeBlurb: 'Unifies multimodal data, intelligence, and continuous learning with Python and SQL interfaces, seamlessly scaling from local environments to Ray clusters.',
      blurb: 'Unifies multimodal data, intelligence, and continuous learning with Python and SQL interfaces, seamlessly scaling from local environments to Ray clusters.',
      product: 'Product',
      training: 'Multimodal Data Pipeline',
      enterprise: 'Enterprise Multimodal Data',
      benchmarks: 'Benchmarks',
      docs: 'Docs',
      quickstart: 'Quickstart',
      concepts: 'Concepts',
      examples: 'Examples',
      contributing: 'Contributing',
      resources: 'Resources',
      blog: 'Blog',
      releaseNotes: 'Release Notes',
      community: 'Community',
      discussions: 'Discussions',
      contact: 'Contact us',
      built: 'Built for engineers.',
    },
    {
      homeBlurb: '通过 Python 和 SQL 接口统一多模态数据处理、智能计算与持续学习，并从本地环境无缝扩展到 Ray 集群。',
      blurb: '面向 AI 流水线与 Agents 的多模态原生引擎。',
      product: '产品',
      training: '多模态数据流水线',
      enterprise: '企业多模态数据',
      benchmarks: '基准测试',
      docs: '文档',
      quickstart: '快速开始',
      concepts: '核心概念',
      examples: '示例',
      contributing: '贡献',
      resources: '资源',
      blog: '博客',
      releaseNotes: '发布说明',
      community: '社区',
      discussions: '讨论',
      contact: '联系我们',
      built: '为工程师构建。',
    },
  )
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-top">
          <div>
            <div className="brand">
              <Mark size={22} />
              <span className="wm" style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.04em' }}>
                vane
              </span>
            </div>
            {home ? (
              <>
                <p className="mut" style={{ fontSize: 13, maxWidth: 270, marginTop: 13, lineHeight: 1.55 }}>
                  {copy.homeBlurb}
                </p>
                <div style={{ marginTop: 13, fontSize: 12.5 }}>
                  <span className="p" style={{ color: 'var(--green-ink)' }}>$</span> pip install vane-ai
                </div>
              </>
            ) : (
              <p className="mut" style={{ fontSize: 13, maxWidth: 270, marginTop: 13, lineHeight: 1.55 }}>
                {copy.blurb}
              </p>
            )}
          </div>

          <div>
            <h4>{copy.product}</h4>
            <Link to="/solutions/training">{copy.training}</Link>
            <Link to="/solutions/enterprise-agent">{copy.enterprise}</Link>
            <Link to="/benchmarks">{copy.benchmarks}</Link>
          </div>

          <div>
            <h4>{copy.docs}</h4>
            <Link to="/docs/data/quickstart/quickstart">{copy.quickstart}</Link>
            <Link to="/docs/data/concepts/sql-vs-python">{copy.concepts}</Link>
            <Link to="/docs/data/examples">{copy.examples}</Link>
            <Link to="/docs/data/contributing/development">{copy.contributing}</Link>
          </div>

          <div>
            <h4>{copy.resources}</h4>
            <Link to="/blog">{copy.blog}</Link>
            <a href={`${GITHUB_URL}/releases`} target="_blank" rel="noreferrer">{copy.releaseNotes}</a>
          </div>

          <div>
            <h4>{copy.community}</h4>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={`${GITHUB_URL}/discussions`} target="_blank" rel="noreferrer">{copy.discussions}</a>
            <a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord ↗</a>
            <Link to="/contact">{copy.contact}</Link>
          </div>
        </div>
        <div className="ft-bot">
          <span>© 2026 Vane · Apache-2.0</span>
          <span>{copy.built}</span>
        </div>
      </div>
    </footer>
  )
}
