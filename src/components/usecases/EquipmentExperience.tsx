import {useState} from 'react'
import {useSiteLocale} from '../../siteI18n'
import {l} from '../../content/types'
import {DemoHeader, DemoTabs, NextAction, SourceButton, SourceReader, Status, type Evidence} from './SolutionShared'

const moments = [
  {id: 'before', time: '10:41:50', label: l('Before the change', '异常前'), value: '2.1', x: 76, y: 102,
    visual: l('Pump running; no visible movement at the coupling guard.', '泵运行中，联轴器护罩未见明显移动。'), sound: l('Steady operating sound in the recording.', '录音中为稳定的运行声。'), alarm: l('No vibration alarm.', '无振动报警。')},
  {id: 'change', time: '10:42:10', label: l('First change', '出现变化'), value: '4.8', x: 244, y: 61,
    visual: l('Visible movement appears at the coupling guard.', '联轴器护罩处出现可见抖动。'), sound: l('A sustained unusual sound begins in this window.', '此时间窗开始出现持续异响。'), alarm: l('The alarm has not fired yet.', '此时尚未触发报警。')},
  {id: 'after', time: '10:42:30', label: l('After the alarm', '报警后'), value: '7.2', x: 412, y: 25,
    visual: l('Movement remains visible after the alarm.', '报警后仍可见抖动。'), sound: l('The unusual sound continues.', '异响持续。'), alarm: l('VIB-HIGH logged at 10:42:22.', '10:42:22 记录 VIB-HIGH 报警。')},
]
const workOrder: Evidence = {id: 'workorder', title: l('WO-204 · Coupling replacement', 'WO-204 · 联轴器更换工单'), meta: l('June 14, 17:30 · P-204 / CP-40', '6 月 14 日 17:30 · P-204 / CP-40'), quote: l('Replaced the coupling. Returned the pump to service. The alignment measurement attachment is not available in the connected records.', '已更换联轴器，设备恢复运行。当前接入记录中没有本次对中测量附件。')}
const manual: Evidence = {id: 'manual', title: l('CP-40 manual · Alignment checks', 'CP-40 手册 · 对中检查'), meta: l('Revision 4 · §6.3 · page 42 · sample manual', '第 4 版 · 6.3 节 · 第 42 页 · 演示手册'), quote: l('After replacing the coupling, check alignment at the specified measurement points and operating conditions. Use the measurement record when investigating post-maintenance vibration.', '更换联轴器后，在指定测点及工况下检查对中。调查检修后振动时，应核对相应测量记录。')}

export function PumpDrawing({active = false}: {active?: boolean}) {
  const locale = useSiteLocale()
  return <svg className="pump-drawing" viewBox="0 0 460 200" role="img" aria-label={locale === 'en' ? 'Illustrated P-204 pump, with the coupling inspection area highlighted' : 'P-204 泵示意图，标出联轴器检查位置'}>
    <path d="M30 163H430M60 163V177H405V163" stroke="#adb6a7" fill="none" strokeWidth="2" />
    <path d="M60 79H201V148H60Z" fill="#dfe5db" stroke="#71806a" strokeWidth="2" />
    {[78,94,110,126,142,158,174].map(x => <path key={x} d={`M${x} 87V140`} stroke="#a4b19b" strokeWidth="3" />)}
    <rect x="95" y="61" width="58" height="18" rx="3" fill="#c3cebb" stroke="#71806a" />
    <path d="M75 149V163M181 149V163M320 146V163M379 146V163" stroke="#71806a" strokeWidth="8" />
    <path d="M203 115H287" stroke="#71806a" strokeWidth="12" /><rect x="218" y="89" width="54" height="53" rx="7" fill={active ? '#eee3d4' : '#e5e9e1'} stroke={active ? '#a36d2f' : '#85957d'} strokeWidth="2" />
    <path d="M290 79Q318 59 359 72L388 94V143H289Z" fill="#c3cebb" stroke="#71806a" strokeWidth="2" />
    <circle cx="333" cy="108" r="25" fill="#e7ece2" stroke="#71806a" strokeWidth="2" /><circle cx="333" cy="108" r="10" fill="#b5c4ac" />
    <path d="M367 80V39H403V87" fill="#e7ece2" stroke="#71806a" strokeWidth="2" />
    <path d="M289 120H271" stroke="#71806a" strokeWidth="10" />
    <rect x="210" y="81" width="70" height="70" rx="11" stroke={active ? '#a36d2f' : '#aeb8a7'} fill="none" strokeDasharray="4 4" />
    <path d="M245 80V37H186" stroke="#8a967f" fill="none" /><text x="89" y="33" fontSize="12" fill="#58634f">{locale === 'en' ? 'Coupling' : '联轴器'}</text>
    <text x="330" y="194" fontSize="11" fill="#68735f">P-204 / CP-40</text>
  </svg>
}

export default function EquipmentExperience() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [momentId, setMoment] = useState('change'), [sourceId, setSource] = useState('observation')
  const moment = moments.find(m => m.id === momentId)!
  const observation: Evidence = {id: 'observation', title: l('Aligned observation record', '对齐后的观测记录'), meta: l(`June 15 · ${moment.time} UTC+08 · sample data`, `6 月 15 日 · ${moment.time} UTC+08 · 演示数据`), quote: l(`${moment.visual.en} ${moment.sound.en} Velocity RMS: ${moment.value} mm/s. ${moment.alarm.en}`, `${moment.visual['zh-CN']}${moment.sound['zh-CN']}速度振动有效值：${moment.value} mm/s。${moment.alarm['zh-CN']}`)}
  const sources = [observation, workOrder, manual]
  return <div className="solution-demo case-experience" data-case="equipment-diagnosis">
    <DemoHeader name="P-204 / CP-40"><Status>{t('Sample incident', '演示事件')}</Status></DemoHeader>
    <DemoTabs value={momentId} onChange={value => {setMoment(value); setSource('observation')}} label={t('Incident window', '异常时间窗')} options={moments.map(m => ({id: m.id, label: m.label[locale]}))}>
      <div className="equipment-observations">
        <div className="equipment-scene"><span className="solution-label">{t('Equipment & inspection area', '设备与检查位置')}</span><PumpDrawing active={momentId !== 'before'} /><span className="solution-meta">{t('Illustration of the sample equipment', '示例设备示意图')}</span></div>
        <div className="equipment-readings" aria-live="polite"><span className="solution-time">{moment.time} <small>UTC+08</small></span>
          <dl><div><dt>{t('Video observation', '画面观测')}</dt><dd>{moment.visual[locale]}</dd></div><div><dt>{t('Sound observation', '声音观测')}</dt><dd>{moment.sound[locale]}</dd></div><div><dt>{t('Velocity RMS', '速度振动有效值')}</dt><dd className="equipment-value">{moment.value} <span>mm/s</span></dd></div></dl>
        </div>
      </div>
      <div className="equipment-timeline">
        <div className="equipment-track-labels"><span>{t('Video window', '视频窗口')}</span><span>{t('Sound window', '声音窗口')}</span><span>{t('Sensor trend', '传感器趋势')}</span><span>{t('Alarm', '报警')}</span></div>
        <div className="equipment-track-plot"><svg viewBox="0 0 480 190" preserveAspectRatio="none" className="equipment-tracks" role="img" aria-label={t('Sample vibration rises from 2.1 to 7.2 mm/s; alarm at 10:42:22.', '演示振动由 2.1 升至 7.2 mm/s，10:42:22 报警。')}>
          <rect x="20" y="6" width="440" height="21" rx="3" fill="#e3e8de" /><rect x="200" y="6" width="240" height="21" rx="3" fill="#c4d1b9" />
          <rect x="20" y="41" width="440" height="21" rx="3" fill="#ece9e0" /><path d="M20 51H194L200 47L204 55L210 43L216 59L222 41L228 61L234 46L240 56L246 41L252 60L258 43L264 59L270 44L276 58L282 43L288 60L294 44L300 57L306 41L312 60L318 42L324 58L330 45L336 60L342 43L348 58L354 44L360 60L366 42L372 57L378 45L384 59L390 42L396 60L402 44L408 58L414 43L420 58H460" fill="none" stroke="#8b846e" strokeWidth="1.4" />
          <path d="M20 154H460M20 120H460M20 86H460" stroke="#e2e6dc" fill="none" />
          <path d="M20 153L76 150L150 147L200 139L244 109L280 98L345 83L412 73L460 72" fill="none" stroke="#627e51" strokeWidth="2.5" />
          <circle cx={moment.x} cy={moment.y + 48} r="4" fill="#456332" />
          <path d="M20 177H460" stroke="#d9ddd3" /><path d="M345 169L352 177L345 185L338 177Z" fill="#a36d2f" />
          <path d={`M${moment.x} 1V190`} stroke="#637457" strokeWidth="1.5" strokeDasharray="3 4" />
        </svg><div className="equipment-track-times"><span>10:41:50</span><span>10:42:10</span><span>10:42:30</span></div></div>
      </div>
      <div className="equipment-evidence"><div><span className="solution-label">{t('Follow the evidence', '核对依据')}</span>{sources.map(source => <SourceButton key={source.id} source={source} selected={sourceId === source.id} onClick={() => setSource(source.id)} />)}
        <details className="solution-details"><summary>{t('Sources & timing', '来源与时间')}</summary><p>{t('Same sample asset: P-204. Sensor and alarm use UTC+08. Video 00:00 maps to 10:41:30; audio is corrected by +2 seconds. Both media clocks have ±1 second uncertainty. Values represent drive-end velocity RMS under the same load.', '同一演示设备 P-204。传感器和报警采用 UTC+08。视频 00:00 对应 10:41:30；音频校正 +2 秒，两者仍有 ±1 秒的不确定度。数值为相同负载下驱动端的速度振动有效值。')}</p></details>
      </div><SourceReader source={sources.find(s => s.id === sourceId)!} /></div>
      <NextAction>{t('Request the alignment measurement record and appropriate specialist checks. A maintenance professional reviews the inspection plan before acting.', '补查本次对中测量记录与专业检查依据，由维修人员核验检查计划后执行。')}</NextAction>
    </DemoTabs>
  </div>
}

export function EquipmentHypotheses() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  return <div className="solution-hypotheses">
    <div className="hypothesis-header"><span>{t('Hypothesis', '待核实假设')}</span><span>{t('Available evidence', '已有依据')}</span><span>{t('What would help distinguish it', '还需要什么来区分')}</span></div>
    <div><h4>{t('Coupling alignment', '联轴器对中问题')}</h4><p>{t('Coupling replacement preceded the change; the manual specifies alignment checks.', '更换联轴器后出现变化，手册要求进行对中检查。')}</p><p>{t('The actual alignment measurements, points and operating conditions.', '本次对中测量值、测点与实际工况。')}</p></div>
    <div><h4>{t('Bearing-related issue', '轴承相关问题')}</h4><p>{t('Unusual sound and vibration provide a lead, without identifying a cause.', '异响与振动提供线索，目前不能确认原因。')}</p><p>{t('Specialist spectrum data or an inspection record at the relevant measurement point.', '相应测点的专业频谱数据或检查记录。')}</p></div>
  </div>
}
