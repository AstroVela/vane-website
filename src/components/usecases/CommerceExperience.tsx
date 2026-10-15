import {useState} from 'react'
import {useSiteLocale} from '../../siteI18n'
import {l} from '../../content/types'
import {DemoHeader, NextAction, SourceButton, SourceReader, Status, type Evidence} from './SolutionShared'

export function BackpackDrawing({variant}: {variant: 'A' | 'B'}) {
  const locale = useSiteLocale(), large = variant === 'B'
  return <svg viewBox="0 0 220 210" className="backpack-drawing" role="img" aria-label={locale === 'en' ? `Illustration of sample backpack ${variant}` : `演示背包 ${variant} 的结构示意图`}>
    <path d="M82 50V28Q110 10 138 28V50" fill="none" stroke="#6f7b66" strokeWidth="8" />
    <path d="M60 61Q36 90 47 171M160 61Q184 90 173 171" fill="none" stroke="#bec7b6" strokeWidth="15" />
    <path d={large ? 'M56 58Q110 25 164 58L173 178Q110 199 47 178Z' : 'M64 58Q110 31 156 58L164 178Q110 194 56 178Z'} fill={large ? '#cec7b8' : '#c3ceb9'} stroke={large ? '#8b8371' : '#75856a'} strokeWidth="2" />
    <path d="M69 64Q110 45 151 64M68 72Q110 53 152 72" fill="none" stroke={large ? '#9c937f' : '#91a083'} strokeWidth="2" />
    <rect x={large ? '67' : '74'} y={large ? '105' : '113'} width={large ? '86' : '72'} height="58" rx="9" fill={large ? '#ded9ce' : '#dce4d3'} stroke={large ? '#9c937f' : '#91a083'} />
    <path d={large ? 'M76 119H144M108 125V158' : 'M83 128H137'} fill="none" stroke={large ? '#9c937f' : '#91a083'} strokeWidth="2" />
    {!large && <path d="M151 94V149" stroke="#557344" strokeWidth="4" />}
    <rect x="99" y="81" width="22" height="9" rx="2" fill={large ? '#8b8371' : '#75856a'} />
  </svg>
}

const sources: Evidence[] = [
  {id: 'spec', title: l('A-20 / B-24 · Product specifications', 'A-20 / B-24 · 商品规格'), meta: l('Catalog revision 2 · authored sample products', '目录第 2 版 · 自编演示商品'), quote: l('A-20: 690 g; internal laptop compartment 32 × 23 × 2 cm. B-24: 980 g; compartment 34 × 25 × 3 cm. Compare the device’s physical dimensions, including any sleeve.', 'A-20：690 g，电脑仓内尺寸 32 × 23 × 2 cm。B-24：980 g，电脑仓 34 × 25 × 3 cm。按电脑实际尺寸核对；装保护套时需计入保护套尺寸。')},
  {id: 'structure', title: l('Product structure · Access and compartments', '商品结构 · 取物与分区'), meta: l('A-20 / B-24 · illustrative product drawings', 'A-20 / B-24 · 演示商品结构图'), quote: l('A-20 has a side-access opening. B-24 uses a top opening and has more internal compartments. Choose according to the shopper’s actual access needs.', 'A-20 支持侧面取物。B-24 为顶部开口，内部分区更多。按用户实际取物需求比较。')},
  {id: 'offer', title: l('Current offer · Region CN', '当前可售记录 · 中国区'), meta: l('Sample business records · June 15, 09:00 · CNY', '演示业务记录 · 6 月 15 日 09:00 · 人民币'), quote: l('A-20 / sage: ¥399, available. B-24 / sand: ¥469, available. Prices and availability apply to these variants at the stated time.', 'A-20 / 鼠尾草色：399 元，可售。B-24 / 沙色：469 元，可售。价格与状态仅对应这些规格和获取时间。'), note: l('The commerce system checks the latest price and stock before checkout.', '结算前由交易系统核对最新价格与库存。')},
]
export default function CommerceExperience() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [size, setSize] = useState('unknown'), [sourceId, setSource] = useState('spec')
  const large = size === 'large'
  return <div className="solution-demo case-experience" data-case="commerce-sales">
    <DemoHeader name={t('SHOPPING / DAILY COMMUTE', '导购 / 日常通勤')} />
    <div className="commerce-needs"><span>{t('Daily commute', '日常通勤')}</span><span>{t('Laptop', '携带电脑')}</span><span>≤ ¥500</span><span>{t('Lightweight', '轻便')}</span></div>
    <div className="commerce-comparison">
      <div className="commerce-products">{(['A','B'] as const).map(variant => <div key={variant}><BackpackDrawing variant={variant} /><div><span className="solution-label">{variant === 'A' ? 'A-20 / SAGE' : 'B-24 / SAND'}</span><h3>{variant === 'A' ? t('Less weight. Side access.', '更轻，支持侧面取物。') : t('More room. More compartments.', '容量更大，分区更多。')}</h3><strong className="commerce-price">{variant === 'A' ? '¥399' : '¥469'}<span>{variant === 'A' ? '690 g' : '980 g'}</span></strong></div></div>)}</div>
      <div className="commerce-criteria" role="table" aria-label={t('Product comparison', '商品比较')}>
        <div role="row"><span role="columnheader">{t('What matters', '用户关心什么')}</span><b role="columnheader">A-20</b><b role="columnheader">B-24</b></div>
        <div role="row"><span role="rowheader">{t('Carry weight', '背起来多重')}</span><span role="cell">690 g</span><span role="cell">980 g</span></div>
        <div role="row"><span role="rowheader">{t('Laptop fit', '电脑是否放得下')}</span><span role="cell"><Status tone={size === 'unknown' || large ? 'open' : 'good'}>{size === 'unknown' ? t('Needs dimensions', '待核对尺寸') : large ? t('Does not fit', '无法容纳') : t('Fits', '可容纳')}</Status></span><span role="cell"><Status tone={size === 'unknown' ? 'open' : 'good'}>{size === 'unknown' ? t('Needs dimensions', '待核对尺寸') : t('Fits', '可容纳')}</Status></span></div>
        <div role="row"><span role="rowheader">{t('Everyday access', '收纳是否顺手')}</span><span role="cell">{t('Side opening', '侧面开口')}</span><span role="cell">{t('Top opening; more sections', '顶部开口，更多分区')}</span></div>
        <div role="row"><span role="rowheader">{t('Offer at 09:00', '09:00 可售记录')}</span><span role="cell">{t('Available · CN', '可售 · 中国区')}</span><span role="cell">{t('Available · CN', '可售 · 中国区')}</span></div>
      </div>
    </div>
    <div className="commerce-decision"><div className="commerce-question"><span className="solution-label">{t('One useful follow-up', '一个关键补问')}</span><h3>{t('What are your laptop’s dimensions?', '电脑的实际尺寸是多少？')}</h3><p>{t('Choose a sample answer to see how the recommendation changes.', '选择一个示例回答，看看推荐如何变化。')}</p><div className="commerce-size-options" role="group" aria-label={t('Laptop dimensions', '电脑尺寸')}>
      <button type="button" aria-pressed={size === 'small'} onClick={() => setSize('small')}>31 × 22 × 1.8 cm</button><button type="button" aria-pressed={large} onClick={() => setSize('large')}>33 × 24 × 2 cm</button>
      {size !== 'unknown' && <button type="button" className="commerce-reset" onClick={() => setSize('unknown')}>{t('Reset', '重置')}</button>}
    </div><div className="commerce-recommendation" aria-live="polite"><Status tone={size === 'unknown' ? 'open' : 'good'}>{size === 'unknown' ? t('Fit is still unknown', '尺寸适配仍待核对') : large ? t('B-24 fits this requirement', 'B-24 满足尺寸要求') : t('A-20 suits the weight preference', 'A-20 更符合轻便偏好')}</Status><p>{size === 'unknown' ? t('Both meet the budget. A is lighter; B has more space. Check fit before making a final recommendation.', '两者都在预算内。A 更轻，B 空间更大。最终推荐前需核对尺寸。') : large ? t('A’s compartment is too small. B fits the stated device dimensions and stays within the budget, at a higher carry weight.', 'A 的电脑仓过小。B 可容纳这组尺寸且在预算内，代价是更重。') : t('Both compartments fit the stated dimensions. A saves 290 g and provides side access. B remains an option for more compartments.', '两者都可容纳。A 轻 290 g 且支持侧面取物；更看重分区时仍可考虑 B。')}</p></div></div>
      <div className="commerce-sources"><div className="solution-source-links">{sources.map(s => <SourceButton key={s.id} source={s} selected={sourceId === s.id} onClick={() => setSource(s.id)} />)}</div><SourceReader source={sources.find(s => s.id === sourceId)!} /></div>
    </div>
    <NextAction>{t('Your shopping agent asks the missing question, explains the trade-off and passes the selected variant to the commerce system for current availability and checkout.', '导购 Agent 补问关键条件、解释取舍，再将选定规格交给交易系统核对当前状态并完成购买。')}</NextAction>
  </div>
}
