import {l, type Localized} from './types'

export type ExampleSource = {name: Localized; locator: Localized; excerpt: Localized}
export type ExampleObservation = {label: Localized; marker: string; finding: Localized; sources: ExampleSource[]}

export const meetingExamples: ExampleObservation[] = [
  {marker: '14:08', label: l('“Let’s use the plan from last time.”', '“那就沿用上次的方案吧。”'),
    finding: l('“Last time” refers to the pilot plan in the September 29 review. The agreed scope covers one regional team.', '“上次”指 9 月 29 日评审的试点方案，已确认范围为一个区域团队。'), sources: [
      {name: l('Project review recording', '项目评审录制'), locator: l('Sep 29, 18:42', '9 月 29 日，18:42'), excerpt: l('“Start with the east region. We will review the pilot before agreeing to other regions.”', '“先在华东团队试点，其他区域等试点评估后再确认。”')},
      {name: l('CRM project note', 'CRM 项目记录'), locator: l('Pilot scope, revision 2', '试点范围，第 2 版'), excerpt: l('Customer: Cedar Retail. Project: service assistant pilot. Scope: east region. Expansion: not yet approved.', '客户：青杉零售。项目：服务助手试点。范围：华东团队。扩大范围：尚未审批。')},
    ]},
  {marker: '14:26', label: l('“The launch date was confirmed, right?”', '“上线日期已经确认了，对吧？”'),
    finding: l('October 20 is a target date. The latest email still makes it conditional on access approval.', '10 月 20 日是目标日期；最新邮件仍以访问权限获批为前提。'), sources: [
      {name: l('Follow-up email', '项目跟进邮件'), locator: l('Oct 10, 09:18', '10 月 10 日，09:18'), excerpt: l('“We are targeting October 20, provided access approval is complete by Friday. Please confirm before we announce the date.”', '“如果周五前完成访问权限审批，我们计划 10 月 20 日上线。对外公布前请再确认。”')},
    ]},
  {marker: '14:51', label: l('“Who is still waiting on what?”', '“现在还在等谁完成什么？”'),
    finding: l('The remaining dependency is customer-side access approval. No completion record appears in the supplied project notes.', '当前待办是客户侧的访问审批，已提供的项目记录中尚无完成记录。'), sources: [
      {name: l('Project action log', '项目行动项'), locator: l('Oct 12, open items', '10 月 12 日，未结事项'), excerpt: l('Access approval: customer IT owner. Status: pending. Validation run: after approval. Evidence of completion: not attached.', '访问审批：客户 IT 负责人。状态：待处理。联调：审批完成后安排。完成依据：未附。')},
    ]},
]

export const supportExamples: ExampleObservation[] = [
  {marker: '15:12', label: l('Carrier marks the order delivered', '物流记录显示已签收'), finding: l('The carrier recorded delivery at reception. The supplied record does not identify the recipient.', '物流记录写明已送达前台，但所提供记录没有签收人身份。'), sources: [
    {name: l('Shipment event', '物流事件'), locator: l('Order VS-2048, 15:12', '订单 VS-2048，15:12'), excerpt: l('Status: delivered. Location: reception. Recipient name: empty. Delivery photo attached to carrier record.', '状态：已送达。位置：前台。签收人：空。物流记录附有配送照片。')},
    {name: l('Delivery photo observation', '配送照片观察记录'), locator: l('Carrier attachment, example annotation', '物流附件，示例观察'), excerpt: l('A parcel is visible on a reception counter. Neither a street number nor an identifiable recipient is visible.', '画面中包裹放在前台台面，未见可辨认的门牌或签收人。')},
  ]},
  {marker: '16:03', label: l('Customer reports a missing parcel', '客户反馈未收到包裹'), finding: l('“Delivered” does not establish receipt by this customer. The drop-off location and actual recipient remain unverified.', '“已送达”尚不能证明客户本人收到，需要核实投递地点与实际签收人。'), sources: [
    {name: l('Customer conversation', '客户沟通'), locator: l('Case CS-031, 16:03', '案件 CS-031，16:03'), excerpt: l('“I checked with our reception. They have no parcel under my name. Could it have gone to another building?”', '“我问过前台，没有我的包裹。会不会送到隔壁楼了？”')},
    {name: l('Order destination', '订单收件信息'), locator: l('Order VS-2048', '订单 VS-2048'), excerpt: l('Destination: Building B reception. Proof supplied: counter photograph. Building identifier in proof: not visible.', '收件地点：B 座前台。已有依据：台面照片。依据中可见的楼栋标识：无。')},
  ]},
  {marker: 'NEXT', label: l('Check the applicable resolution policy', '核对适用的处理政策'), finding: l('The next step is to request location and recipient confirmation. The supplied policy does not yet establish refund eligibility.', '下一步应请求地点和签收确认；现有资料还不足以按政策确定退款条件。'), sources: [
    {name: l('Missing-delivery policy', '未收到货物处理政策'), locator: l('Revision 4, section 3', '第 4 版，第 3 节'), excerpt: l('When delivery is disputed, verify the address and recipient with the carrier. If receipt cannot be established, escalate for replacement or refund review.', '客户对签收提出异议时，向承运商核实地址与签收人；无法确认收到时，升级补发或退款审核。')},
  ]},
]

export const equipmentExamples = [
  {time: '10:31:02', vibration: 1.4, current: 7.2, visual: l('Belt motion is steady.', '皮带运行平稳。'), sound: l('Continuous motor hum.', '连续、平稳的电机声。'), finding: l('Baseline observation before the event.', '异常发生前的基线观测。'), source: l('Equipment M-07 recording and sensor export, matched by source timestamp.', '设备 M-07 录制与传感器导出记录，按来源时间戳对齐。')},
  {time: '10:31:08', vibration: 4.1, current: 7.3, visual: l('A short lateral movement appears.', '出现一次短暂的横向偏移。'), sound: l('A periodic scraping sound begins.', '开始出现周期性摩擦声。'), finding: l('The sound and lateral movement precede the alarm. Check alignment before concluding a motor fault.', '摩擦声与偏移早于报警；应补充核对对齐状态，再判断是否为电机故障。'), source: l('Video observation 00:08; sound window 00:07-00:10; sensor reading at 10:31:08.', '视频观察 00:08；声音窗口 00:07-00:10；10:31:08 的传感器读数。')},
  {time: '10:31:14', vibration: 6.8, current: 8.9, visual: l('The belt edge contacts the guide.', '皮带边缘接触导向件。'), sound: l('Scraping persists as vibration rises.', '摩擦声持续，同时振动上升。'), finding: l('The alarm follows visible contact. This supports an alignment check; the recording alone cannot establish the root cause.', '报警发生在可见接触之后，支持继续检查对齐状态；仅凭录制还不能确定根因。'), source: l('Alarm VIB-HIGH at 10:31:14. Service note: guide alignment was adjusted during the previous inspection.', '10:31:14 报警 VIB-HIGH。维修记录：上次巡检调整过导向件对齐。')},
]

export const personalExamples: ExampleObservation[] = [
  {marker: 'VOICE', label: l('How I open a story', '我的开场方式'), finding: l('The supplied pieces start with a concrete observation, then explain the idea. Use this pattern as a reference for the new script.', '已提供作品通常先给出具体观察，再解释观点。新脚本可以借鉴这种开场方式。'), sources: [
    {name: l('Field notebook: the morning commute', '随笔：通勤路上的观察'), locator: l('Opening paragraph', '开头第 1 段'), excerpt: l('“At 8:10, three people were waiting beside an empty bike rack. That small gap said more about the city than the traffic report.”', '“8 点 10 分，三个人站在空着的单车架旁等车。这个小小的缺口，比交通报告更能说明城市的问题。”')},
    {name: l('Writing preferences', '写作偏好'), locator: l('User note, Oct 2', '用户说明，10 月 2 日'), excerpt: l('Start with something specific. Keep the language direct. Separate observations from conclusions.', '从具体的事物开始，表达直接。把观察和结论分开。')},
  ]},
  {marker: 'IDEA', label: l('A relevant earlier viewpoint', '可以延续的观点'), finding: l('A past note distinguishes the convenience of a tool from the habit it helps build. Keep that original context when reusing the idea.', '一篇旧笔记区分了工具的便利与它帮助形成的习惯，引用时保留这个语境。'), sources: [
    {name: l('Notes on everyday tools', '关于日常工具的笔记'), locator: l('Section: repeated use', '重复使用章节'), excerpt: l('“The useful question is whether I reach for it again next week. A feature list tells me less than the routine it makes easier.”', '“有用的问题是，下周我还会不会再次拿起它。比起功能列表，我更关心它让哪种日常习惯变得容易。”')},
  ]},
  {marker: 'ASSET', label: l('Material I can use again', '可再次使用的素材'), finding: l('The archive includes an unused opening from a previous draft, with its original project and usage note attached.', '作品库里有一段旧草稿未使用的开场，附有原项目与使用备注。'), sources: [
    {name: l('Travel journal script', '旅行记录脚本'), locator: l('Draft 3, unused opening', '第 3 稿，未使用的开场'), excerpt: l('“I packed for a whole week, then noticed which three things I used every day.” Usage note: personal work, reusable with revision.', '“我打包了一周的行李，后来发现，每天反复用到的只有三样东西。”使用备注：个人作品，可修改后复用。')},
  ]},
]

export const commerceExamples = [
  {id: 'portability', label: l('Portability', '携带'), conclusion: l('The lighter model fits the travel brief better. Confirm the required serving size before choosing.', '轻装款更符合携带需求，选择前还需确认每次需要的容量。'),
    values: [l('430 g / 350 ml', '430 克 / 350 毫升'), l('690 g / 600 ml', '690 克 / 600 毫升')], source: l('Example catalog, weight and capacity fields. Weight includes the base; travel accessories are excluded.', '示例商品目录的重量与容量字段。重量包含底座，不包含出行配件。')},
  {id: 'cleaning', label: l('Cleaning', '清洗'), conclusion: l('Both allow rinsing the cup. Only the larger model has a removable blade assembly; neither base can be submerged.', '两款杯体都可以冲洗，大容量款支持拆卸刀头，两款底座都不可浸水。'),
    values: [l('Rinse cup; fixed blades', '冲洗杯体；刀头不可拆'), l('Removable blade assembly', '刀头组件可拆卸')], source: l('Example care instructions, section 2: disconnect power, rinse the cup and keep the motor base out of water.', '示例维护说明第 2 节：断开电源、冲洗杯体，电机底座不可浸水。')},
  {id: 'availability', label: l('Availability', '价格与库存'), conclusion: l('These are dated sample records. The sales agent should check the connected commerce system again before purchase.', '这里展示的是带时间的示例记录，下单前由导购 Agent 再核对交易系统。'),
    values: [l('$42 / in stock', '¥299 / 有库存'), l('$59 / restock pending', '¥419 / 等待补货')], source: l('Illustrative commerce snapshot: Oct 12, 09:00. Example prices and stock, not an offer for sale.', '演示业务记录：10 月 12 日 09:00。示例价格与库存，不构成商品报价。')},
]
