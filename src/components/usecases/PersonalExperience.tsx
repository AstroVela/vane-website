import {useState} from 'react'
import {useSiteLocale} from '../../siteI18n'
import {l} from '../../content/types'
import {DemoHeader, DemoTabs, NextAction, SourceReader, Status, revealEvidence, type Evidence} from './SolutionShared'

const sources: Evidence[] = [
  {id: 'facts', title: l('June 15 · Atlas weekly update', '6 月 15 日 · Atlas 项目周报'), meta: l('Your workspace / Atlas · current project facts', '个人工作空间 / Atlas · 当前项目事实'), quote: l('Phase-one features are complete. Integration testing is planned for next Tuesday, subject to approval of the API interface.', '一期功能已完成。计划下周二开始联调测试，前提是接口方案获得确认。')},
  {id: 'condition', title: l('June 15 · Voice memo', '6 月 15 日 · 语音备忘'), meta: l('Transcript · 00:18–00:29 · recorded by you', '转写 · 00:18–00:29 · 本人录制'), quote: l('The API interface is still awaiting confirmation. Don’t promise the testing date without mentioning that condition.', '接口方案还没确认。写测试日期时，要保留这个前提，不能直接承诺。')},
  {id: 'history', title: l('May 28 · Approved project scope', '5 月 28 日 · 已确认的项目范围'), meta: l('Atlas / phase one · approved customer email', 'Atlas / 一期 · 已确认客户邮件'), quote: l('Phase one covers the billing module. Reporting enhancements are planned separately for phase two.', '一期范围为账单模块，报表增强另列入二期计划。')},
  {id: 'style', title: l('Your confirmed writing preferences', '你明确确认的表达偏好'), meta: l('Personal / client communication · confirmed June 2', '个人 / 客户沟通 · 6 月 2 日确认'), quote: l('For client updates, lead with the conclusion. Use short sentences. State any conditions before making a commitment.', '客户更新先说结论。句子简短。作出承诺前，要说明前提条件。'), note: l('Explicit instructions from this user, within their own workspace.', '来自本人的明确要求，限定在其个人工作空间。')},
]

export default function PersonalExperience() {
  const locale = useSiteLocale(), t = (en: string, zh: string) => locale === 'en' ? en : zh
  const [view, setView] = useState('client'), [sourceId, setSource] = useState('facts')
  const source = sources.find(s => s.id === sourceId)!
  const mark = (id: string, label: string) => <button type="button" className={'draft-reference' + (sourceId === id ? ' is-active' : '')} aria-pressed={sourceId === id} onClick={event => {setSource(id); revealEvidence(event.currentTarget)}}>{label} <span aria-hidden="true">↗</span></button>
  return <div className="solution-demo case-experience" data-case="personal-work">
    <DemoHeader name="YOUR WORKSPACE / ATLAS"><Status>{t('Private context', '个人范围')}</Status></DemoHeader>
    <DemoTabs value={view} onChange={setView} label={t('Draft audience', '草稿的读者')} options={[{id: 'client', label: t('Client email', '客户邮件')}, {id: 'internal', label: t('Internal update', '内部更新')}]}>
      <div className="personal-workbench">
        <article className="personal-draft"><div className="solution-label">{t('Example draft by your work agent', '工作 Agent 的草稿示例')}</div>
          <div className="draft-envelope"><span>{t('To', '收件人')}</span><b>{view === 'client' ? 'Northstar' : t('Atlas project team', 'Atlas 项目组')}</b><span>{t('Subject', '主题')}</span><b>{view === 'client' ? t('Atlas: progress and next steps', 'Atlas：项目进展与下一步') : t('Atlas: ready for the next handoff', 'Atlas：下一步交接准备')}</b></div>
          <div aria-live="polite">
            <p>{view === 'client' ? t('Phase-one features are complete. We plan to begin integration testing next Tuesday, subject to approval of the API interface.', '一期功能已完成。计划下周二开始联调测试，前提是接口方案获得确认。') : t('The billing module is complete. The next step is integration testing; the planned Tuesday start still depends on API approval.', '账单模块已完成，下一步进入联调测试。计划下周二开始，仍需接口方案确认。')}{mark('facts', t('Current fact', '当前事实'))}</p>
            <p>{view === 'client' ? t('The current scope is the billing module. Reporting enhancements remain in phase two.', '本次范围为账单模块。报表增强仍安排在二期。') : t('Keep the test handoff within the agreed billing scope. Reporting changes belong to phase two.', '交接测试范围遵循已确认的账单模块范围。报表变更属于二期。')}{mark('history', t('Project history', '项目历史'))}</p>
            <p>{view === 'client' ? t('Please confirm the API interface so we can finalize the testing schedule.', '请协助确认接口方案，以便确定测试安排。') : t('Follow up on API approval before confirming the test date. Carry this dependency into the handoff note.', '确认测试日期前先跟进接口审批，在交接记录中保留这一依赖。')}{mark('condition', t('Open condition', '待确认条件'))}</p>
          </div>
          <div className="draft-style">{mark('style', t('Why this writing style?', '为什么这样写？'))}<span>{t('Conclusion first · short sentences · explicit conditions', '先说结论 · 简短句子 · 明确前提')}</span></div>
        </article>
        <SourceReader source={source} />
      </div>
      <NextAction>{t('Your work agent writes and edits for the chosen audience, using the supplied facts and preferences. User feedback refines the draft; an explicit lasting instruction can become a reusable preference.', '工作 Agent 按读者需要写作和编辑，使用已提供的事实与偏好。用户反馈继续修改草稿，明确的长期要求可以成为可复用偏好。')}</NextAction>
    </DemoTabs>
  </div>
}
