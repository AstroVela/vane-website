import {useEffect, useRef, useState} from 'react'
import {PlayIcon} from '@radix-ui/react-icons'
import {useSiteLocale} from '../../siteI18n'
import {assetFor, insightFor} from '../../content/showcases'
import MediaPreview from '../showcase/MediaPreview'
import {formatTime} from '../showcase/locator'
import {DemoHeader, DemoTabs, NextAction, Status} from './SolutionShared'

const ignore = () => {}
export function CampaignMetrics() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <div className="campaign-metrics">
    <div className="campaign-metrics-heading"><span className="solution-label">{t('Comparable campaign records', '一致范围下的投放记录')}</span><Status>{t('Sample data', '演示数据')}</Status></div>
    <div className="solution-table-scroll" tabIndex={0} role="region" aria-label={t('Campaign comparison', '投放表现对照')}><table><thead><tr><th>{t('Creative', '创意')}</th><th>{t('Impressions', '曝光')}</th><th>{t('Clicks', '点击')}</th><th>{t('Conversions', '转化')}</th><th>CTR</th><th>CVR</th></tr></thead><tbody>
      <tr><th>DEMO-A</th><td>100,000</td><td>2,000</td><td>60</td><td>2.0%</td><td><b>3.0%</b></td></tr>
      <tr><th>DEMO-B</th><td>100,000</td><td>2,500</td><td>50</td><td><b>2.5%</b></td><td>2.0%</td></tr>
    </tbody></table></div>
    <details className="solution-details"><summary>{t('Scope & metric definitions', '统计范围与指标口径')}</summary><p>{t('June 1–7 · the same sample audience and paid social channel · a 7-day post-click attribution window. CTR = clicks ÷ impressions. CVR = attributed conversions ÷ clicks. These authored campaign records demonstrate the comparison; they are not performance measurements for the reference media.', '6 月 1–7 日 · 相同演示人群与社交广告渠道 · 点击后 7 天归因窗口。CTR = 点击 ÷ 曝光；CVR = 归因转化 ÷ 点击。这些自编投放记录用于演示比较机制，不是参考媒体的实际表现。')}</p></details>
  </div>
}

function CreativeMedia({kind}: {kind: 'video' | 'image' | 'audio'}) {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const asset = assetFor(kind === 'video' ? 'comp_001' : kind === 'image' ? 'comp_005' : 'comp_008')
  const options = kind === 'video' ? ['ingredients','blending','camping'] : kind === 'image' ? ['food','caption','cup'] : ['portable','morning']
  const [selected, setSelected] = useState(options[0]), [epoch, setEpoch] = useState(0), [requested, setRequested] = useState(false), [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null), insight = insightFor(selected), locator = insight.locators[0]
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting))
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  const choose = (id: string) => {setSelected(id); setRequested(false); setEpoch(e => e + 1)}
  return <div className={'creative-media creative-media-' + kind} ref={ref}>
    <div className="creative-media-player"><MediaPreview key={asset.id} asset={asset} selected={selected} epoch={epoch} request={requested ? {epoch, locator} : undefined} initialPosition={locator.kind === 'time' ? locator.start : 0} loadEnabled={false} autoPreview={false} visible={visible} onProgress={ignore} onInteract={ignore} onAudible={ignore} onModal={ignore} /></div>
    <div className="creative-media-findings">
      <span className="solution-label">{t('What the source supports', '来源能支持什么')}</span>
      <div className="creative-observation-options" role="group" aria-label={t('Source observations', '来源中的观测')}>{options.map(id => <button type="button" key={id} aria-pressed={selected === id} onClick={() => choose(id)}>{insightFor(id).title[locale]}</button>)}</div>
      <p>{insight.explanation[locale]}</p>
      {insight.sourceExcerpt && <blockquote>{insight.sourceExcerpt.text}</blockquote>}
      {locator.kind === 'time' ? <button type="button" className="solution-text-button creative-play-reference" onClick={() => {setRequested(true); setEpoch(e => e + 1)}}><PlayIcon aria-hidden="true" />{t('Play reference', '播放引用')} {formatTime(locator.start)}–{formatTime(locator.end)}</button> : <p className="solution-footnote">{t('Open the image to inspect the highlighted region.', '点击图片，查看高亮的原图区域。')}</p>}
      <span className="solution-meta">{asset.id} · {t('Original media', '原始媒体')}</span>
    </div>
  </div>
}

export default function MarketingExperience() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [stage, setStage] = useState('brief'), [kind, setKind] = useState<'video' | 'image' | 'audio'>('video')
  const [opening, setOpening] = useState('scene')
  return <div className="solution-demo case-experience" data-case="marketing-campaigns">
    <DemoHeader name={t('CAMPAIGN / OUTDOOR WEEKEND', 'CAMPAIGN / 户外周末')} />
    <DemoTabs label={t('Campaign task', '营销任务')} value={stage} onChange={setStage} options={[{id: 'brief', label: t('Prepare the brief', '准备 Brief')}, {id: 'compare', label: t('Compare creative', '比较创意')}, {id: 'learn', label: t('Improve the next campaign', '复盘与迭代')}]}>
      <div className="campaign-brief"><span className="solution-label">{t('The brief', '本次 Brief')}</span><p>{t('A portable drink product for weekend outdoor use. Show a concrete use moment, respect the brand’s claim limits, and prepare opening ideas worth testing.', '面向周末户外场景的便携饮品产品。展示具体使用时刻，遵循品牌表达限制，准备值得测试的开场思路。')}</p></div>
      {stage !== 'learn' && <>
        <div className="creative-media-tabs" role="group" aria-label={t('Reference type', '参考资料类型')}>{(['video','image','audio'] as const).map(value => <button type="button" key={value} aria-pressed={kind === value} onClick={() => setKind(value)}>{value === 'video' ? t('Video reference', '视频参考') : value === 'image' ? t('Image details', '图片细节') : t('Narration', '音频表达')}</button>)}</div>
        <CreativeMedia key={kind} kind={kind} />
      </>}
      {stage === 'brief' && <div className="campaign-constraints"><div><Status tone="good">{t('Useful creative material', '可用创作材料')}</Status><p>{t('A specific outdoor setting, an observable product action, and narration patterns to adapt.', '具体的户外场景、可观察的产品动作，以及可借鉴的旁白表达。')}</p></div><div><Status tone="open">{t('Claim limits', '表达限制')}</Status><p>{t('Reference media establishes what it shows. Battery life, health effects and your own product’s specifications require separate approved facts.', '参考媒体只支持它实际展示的内容。续航、健康效果及本产品参数，需要另有已批准事实支持。')}</p></div></div>}
      {stage === 'compare' && <div className="creative-openings"><span className="solution-label">{t('Two testable opening ideas', '两种可测试的开场思路')}</span><div className="opening-options">
        <button type="button" aria-pressed={opening === 'scene'} onClick={() => setOpening('scene')}><b>{t('A · Scene first', 'A · 场景先行')}</b><span>{t('Open on drink preparation at the campsite.', '从营地制作饮品的动作开始。')}</span></button>
        <button type="button" aria-pressed={opening === 'question'} onClick={() => setOpening('question')}><b>{t('B · Question first', 'B · 问题先行')}</b><span>{t('“What would you make after setting up camp?”', '“搭好帐篷后，你想做杯什么？”')}</span></button>
      </div><p aria-live="polite">{opening === 'scene' ? t('The original clip supports an action-led opening. Test whether starting with the use moment improves downstream engagement.', '原片支持以动作开场。可测试直接展示使用时刻，是否改善后续互动。') : t('The question is a new creative proposal. Pair it with an appropriate source clip and test audience response.', '这个问题是新创意提案。搭配合适的原始片段，再测试受众反应。')}</p><CampaignMetrics /></div>}
      {stage === 'learn' && <div className="campaign-learning"><CampaignMetrics /><div className="campaign-learning-note"><Status tone="good">{t('What the sample records show', '演示记录显示')}</Status><h3>{t('More clicks and more conversions are different outcomes.', '更多点击，与更高转化率，是不同结果。')}</h3><p>{t('DEMO-B has the higher CTR. DEMO-A has the higher post-click CVR. The opening alone cannot explain the difference.', 'DEMO-B 的 CTR 更高，DEMO-A 的点击后 CVR 更高。不能仅凭这些数据，将差异归因于开场。')}</p><p>{t('Carry the useful asset observations forward. Design a comparable A/B test for the opening while holding audience, offer and measurement consistent.', '保留有效素材理解，下一轮在受众、商品条件与统计口径一致的情况下测试开场。')}</p></div></div>}
      <NextAction>{t('Your marketing agent develops the strategy and creative, checks brand facts, and uses its publishing tools. Vane Context supplies relevant material, claim limits, references and campaign evidence for the next iteration.', '营销 Agent 制定策略与创意、核对品牌事实，再通过业务工具发布。Vane Context 提供相关材料、表达限制、引用和支持下一轮迭代的投放依据。')}</NextAction>
    </DemoTabs>
  </div>
}
