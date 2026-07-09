import type {PropsWithChildren, ReactNode} from 'react'
import Box from './Box'
import Mark from './Mark'
import { pickLocale, useSiteLocale } from '../siteI18n'

/* Centered closing CTA card. `children` are the action buttons. */
type CtaProps = PropsWithChildren<{
  title?: string
  kicker?: ReactNode
}>

export default function Cta({
  children,
  kicker,
  title,
}: CtaProps) {
  const locale = useSiteLocale()
  const defaultTitle = pickLocale(
    locale,
    'Build your first AI pipeline on multimodal data.',
    '用多模态数据跑起第一条 AI 流水线',
  )

  return (
    <Box className="cta">
      <Mark size={34} />
      {kicker && <div className="cta-kicker">{kicker}</div>}
      <h2 className="h2">{title ?? defaultTitle}</h2>
      <div className="btns">{children}</div>
    </Box>
  )
}
