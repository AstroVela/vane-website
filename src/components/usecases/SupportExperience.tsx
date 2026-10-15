import {useState} from 'react'
import {useSiteLocale} from '../../siteI18n'
import {l} from '../../content/types'
import {DemoHeader, NextAction, SourceButton, SourceReader, Status, type Evidence} from './SolutionShared'

const sources: Evidence[] = [
  {id: 'order', title: l('Order 1042', '订单 1042'), meta: l('Verified customer C-108 · Region A · retrieved 14:30', '已核验客户 C-108 · 地区 A · 14:30 获取'), quote: l('Shipping address: 8B, North Court. Parcel: P-1042. One parcel in this order.', '收货地址：North Court，8B。包裹：P-1042。本订单仅有一个包裹。')},
  {id: 'delivery', title: l('14:10 · Delivery evidence', '14:10 · 配送依据'), meta: l('Carrier record · P-1042 · illustrative record', '承运商记录 · P-1042 · 演示记录'), quote: l('Status: delivered. The door identifier in the submitted delivery evidence reads “8D”.', '状态：已送达。提交的配送依据中，门牌文字为“8D”。'), note: l('Door illustration represents the sample record. Its difference from 8B is a lead, not a completed delivery investigation.', '门牌示意图对应演示记录。与 8B 的差异是调查线索，不代表已完成投递核查。')},
  {id: 'policy', title: l('Policy 3.2 · Delivery discrepancies', '政策 3.2 · 配送信息不一致'), meta: l('Region A · effective June 1 · standard parcel orders', '地区 A · 6 月 1 日生效 · 标准包裹订单'), quote: l('When the delivery evidence conflicts with the order address, open a location investigation. Replacement or refund eligibility depends on its result and the applicable order conditions.', '配送依据与订单地址不一致时，发起投递位置核查。是否补发或退款，需结合核查结果和订单适用条件判断。')},
  {id: 'customer', title: l('14:35 · Customer update', '14:35 · 客户补充'), meta: l('Authenticated case chat · customer C-108', '已认证案件会话 · 客户 C-108'), quote: l('8D is in the next building. I haven’t received a parcel or authorized someone there to collect it.', '8D 在旁边那栋楼。我没有收到包裹，也没授权那里的人代收。'), note: l('A new customer statement to verify against the carrier’s location evidence.', '这是新增客户陈述，仍需与承运商的位置依据核对。')},
  {id: 'carrier', title: l('14:50 · New carrier event', '14:50 · 新物流事件'), meta: l('P-1042 · retrieved 14:50 · sample event', 'P-1042 · 14:50 获取 · 演示事件'), quote: l('Location investigation accepted. The driver has been asked to verify the delivery coordinates and recipient. No investigation result yet.', '已受理投递位置核查，正在向配送员核对投递坐标和收件人，目前尚无核查结论。')},
]
export default function SupportExperience() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [updated, setUpdated] = useState(false), [carrierUpdate, setCarrierUpdate] = useState(false), [sourceId, setSource] = useState('delivery')
  const selected = sources.find(s => s.id === sourceId)!
  return <div className="solution-demo case-experience" data-case="customer-support">
    <DemoHeader name="CASE 1042"><Status tone="open">{t('Investigating', '调查中')}</Status></DemoHeader>
    <div className="solution-three-column support-panels">
      <div className="solution-task-pane">
        <span className="solution-label">{t('Case timeline', '案件时间线')}</span>
        <ol className="solution-timeline">
          <li><time>14:10</time><span>{t('Carrier marks the parcel delivered.', '承运商标记已送达。')}</span></li>
          <li><time>14:25</time><span>{t('Customer reports: “I never received it.”', '客户反馈：“我没有收到。”')}</span></li>
          <li><time>14:30</time><span>{t('Address and delivery evidence disagree.', '订单地址与配送依据不一致。')}</span></li>
          {updated && <li className="is-new"><time>14:35</time><span>{t('Customer identifies 8D as another building.', '客户说明 8D 位于另一栋楼。')}</span></li>}
          {carrierUpdate && <li className="is-new"><time>14:50</time><span>{t('Carrier accepts the location investigation.', '承运商已受理投递位置核查。')}</span></li>}
        </ol>
        <button type="button" className="solution-text-button" onClick={() => {setUpdated(!updated); setCarrierUpdate(false); setSource(updated ? 'delivery' : 'customer')}}>
          {updated ? t('Reset the example', '重置示例') : t('See the customer update', '查看客户补充信息')}<span aria-hidden="true">↗</span>
        </button>
        {updated && !carrierUpdate && <button type="button" className="solution-text-button" onClick={() => {setCarrierUpdate(true); setSource('carrier')}}>{t('See a new carrier event', '查看新物流事件')}<span aria-hidden="true">↗</span></button>}
      </div>
      <SourceReader source={selected}>{sourceId === 'delivery' && <div className="delivery-evidence" aria-label={t('Illustrated delivery record, door 8D', '配送记录示意，门牌 8D')}>
        <div className="delivery-door"><span>8D</span><i /></div><div className="delivery-parcel"><i /></div>
        <div className="delivery-record-label">{t('ORDER ADDRESS', '订单地址')} <b>8B</b></div>
      </div>}</SourceReader>
      <div className="solution-context-pane" aria-live="polite">
        <span className="solution-label">{t('Current case state', '当前案情')}</span>
          <h3>{carrierUpdate ? t('The investigation is under way.', '投递位置核查已受理。') : t('The location needs checking.', '需要核实投递位置。')}</h3>
        <div className="solution-fact-block"><Status tone="good">{t('Known', '已知事实')}</Status><p>{t('The order is for 8B. The carrier records a delivery at 14:10.', '订单地址为 8B，承运商记录 14:10 送达。')}</p></div>
        <div className="solution-fact-block"><Status tone="open">{t('Unresolved', '未解释的差异')}</Status><p>{updated ? t('The evidence shows 8D; the customer says it is another building. Confirm the carrier’s location and recipient.', '依据显示 8D，客户称其位于另一栋楼。需核对承运商投递位置和收件人。') : t('The evidence shows 8D, and the customer reports no receipt. A “delivered” status does not settle the case.', '依据显示 8D，客户称未收到。“已送达”状态无法单独解释这个问题。')}</p></div>
        <div className="solution-source-links">{sources.filter(s => (updated || s.id !== 'customer') && (carrierUpdate || s.id !== 'carrier')).map(s => <SourceButton key={s.id} source={s} selected={sourceId === s.id} onClick={() => setSource(s.id)} />)}</div>
      </div>
    </div>
    <NextAction>{carrierUpdate ? t('Track the existing investigation and give the customer a factual progress update. Use the verified result and the applicable policy to decide the remedy.', '跟进已有调查，向客户同步准确进展。根据核实结果与适用政策决定解决方式。') : t('Open a delivery-location investigation under policy 3.2. Pass the facts, contradiction and source evidence to the carrier or a support colleague; decide the remedy after verification.', '依据政策 3.2 发起投递位置核查。把事实、矛盾与原始依据交给承运商或接管同事，核实后决定解决方式。')}</NextAction>
  </div>
}
