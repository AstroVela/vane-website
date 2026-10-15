import {useState} from 'react'
import {useSiteLocale} from '../../siteI18n'
import {l} from '../../content/types'
import {DemoHeader, DemoTabs, NextAction, SourceButton, SourceReader, Status, type Evidence} from './SolutionShared'

const sources: Evidence[] = [
  {id: 'meeting', title: l('June 3 · Project meeting', '6 月 3 日 · 项目会议'), meta: l('Transcript · 12:40–13:05 · project owner', '会议转写 · 12:40–13:05 · 项目负责人'), quote: l('Let’s pilot the billing module on June 20, provided the security review is approved. The other modules are outside this pilot.', '账单模块暂定 6 月 20 日试点，前提是安全评审通过。其他模块不在本次试点范围内。')},
  {id: 'email', title: l('June 12 · Date proposal', '6 月 12 日 · 日期调整邮件'), meta: l('Project email · 16:35 · Northstar → Atlas team', '项目邮件 · 16:35 · Northstar → Atlas 团队'), quote: l('Could we move the pilot to June 24? Please confirm this at our next meeting.', '试点是否可以调整到 6 月 24 日？请在下次推进会上确认。'), note: l('A proposed change. This email does not confirm a new date.', '这是调整建议，本邮件未确认新的日期。')},
  {id: 'crm', title: l('CRM · Current project record', 'CRM · 当前项目记录'), meta: l('Atlas / Northstar · retrieved June 15, 08:00', 'Atlas / Northstar · 6 月 15 日 08:00 获取'), quote: l('Pilot date: June 20. Scope: billing. Security review: pending.', '试点日期：6 月 20 日。范围：账单模块。安全评审：待完成。'), note: l('The CRM date has not incorporated the June 12 proposal.', 'CRM 日期尚未反映 6 月 12 日的调整建议。')},
  {id: 'decision', title: l('June 15 · Confirmed decision', '6 月 15 日 · 本次会议决定'), meta: l('Transcript · 18:20–18:45 · project owner', '会议转写 · 18:20–18:45 · 项目负责人'), quote: l('The target is now June 24. I’ll provide the security review documents by June 18. Starting the pilot still depends on review approval.', '目标改为 6 月 24 日，我在 6 月 18 日前补齐安全评审材料，启动仍以评审通过为条件。')},
]

export default function MeetingExperience() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [stage, setStage] = useState('before'), [sourceId, setSource] = useState('meeting')
  const after = stage === 'after'
  const selected = sources.find(s => s.id === sourceId)!
  const visible = after ? [sources[3], sources[0]] : sources.slice(0, 3)
  return <div className="solution-demo case-experience" data-case="meeting-intelligence">
    <DemoHeader name="ATLAS / NORTHSTAR" />
    <DemoTabs label={t('Meeting stage', '会议阶段')} value={stage} onChange={value => {setStage(value); setSource(value === 'after' ? 'decision' : 'meeting')}} options={[
      {id: 'before', label: t('Before the meeting', '会前准备')}, {id: 'during', label: t('During the meeting', '会中查证')}, {id: 'after', label: t('After the meeting', '会后跟进')},
    ]}>
      <div className="solution-three-column meeting-panels">
        <div className="solution-task-pane">
          <span className="solution-label">{t('The task at hand', '此刻的任务')}</span>
          <span className="solution-time">{after ? '18:45' : stage === 'during' ? '08:12' : t('PRE-MEETING', '会前')}</span>
          <h3>{after ? t('What did we agree?', '这次确认了什么？') : stage === 'during' ? t('“Are we still on the original date?”', '“我们还是按原来的日期推进吗？”') : t('Confirm the pilot date and security review.', '确认试点日期与安全评审。')}</h3>
          <p>{after ? t('Prepare the follow-up email with an owner, deadline and remaining condition.', '整理跟进邮件，写明负责人、截止日期与剩余条件。') : t('The discussion refers to a plan spread across a meeting, an email and CRM.', '这次讨论的计划，分散在会议、邮件与 CRM 中。')}</p>
          <div className="meeting-scope"><span>Northstar</span><span>Atlas</span><span>{t('Billing pilot', '账单模块试点')}</span></div>
        </div>
        <div className="solution-context-pane" aria-live="polite">
          <span className="solution-label">{t('Context for your agent', '交给 Agent 的上下文')}</span>
          <Status tone={after ? 'good' : 'open'}>{after ? t('Target confirmed', '目标日期已确认') : t('Date needs confirmation', '日期待确认')}</Status>
          <h3>{after ? t('June 24, with a condition.', '6 月 24 日，保留启动条件。') : t('Two dates. Different meanings.', '两个日期，两种含义。')}</h3>
          <ul className="solution-facts">
            <li>{after ? t('Confirmed target: June 24.', '已确认目标：6 月 24 日。') : t('June 20 is the original, conditional plan.', '6 月 20 日是附带前提的原计划。')}</li>
            <li>{after ? t('Project owner: review documents due June 18.', '项目负责人：6 月 18 日前补齐评审材料。') : t('June 24 is a later proposal, still unconfirmed.', '6 月 24 日是后续建议，仍待确认。')}</li>
            <li>{t('The pilot still requires security approval.', '试点启动仍需安全评审通过。')}</li>
          </ul>
          <div className="solution-source-links">{visible.map(source => <SourceButton key={source.id} source={source} selected={sourceId === source.id} onClick={() => setSource(source.id)} />)}</div>
        </div>
        <SourceReader source={selected} />
      </div>
      <NextAction>{after ? t('Draft the follow-up: June 24 target; owner to deliver review documents by June 18; launch remains conditional. Update records through the meeting agent’s connected tools.', '生成跟进邮件：6 月 24 日为目标；负责人于 6 月 18 日前补齐材料；启动仍附条件。再通过会议 Agent 的业务工具更新记录。') : stage === 'during' ? t('Surface the original condition and the later proposal so the meeting can make an explicit decision.', '提示原计划的前提与后续建议，帮助会议作出明确决定。') : t('Prepare an agenda that asks for the date decision and the owner of the security review.', '准备议程，确认目标日期和安全评审负责人。')}</NextAction>
    </DemoTabs>
  </div>
}
