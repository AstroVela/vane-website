import type {PropsWithChildren, ReactNode} from 'react'
import Box from './Box'
import Mark from './Mark'

/* Centered closing CTA card. `children` are the action buttons. */
type CtaProps = PropsWithChildren<{
  title?: string
  kicker?: ReactNode
}>

export default function Cta({
  children,
  kicker,
  title = 'Build your first multimodal AI pipeline with Vane.',
}: CtaProps) {
  return (
    <Box className="cta">
      <Mark size={34} />
      {kicker && <div className="cta-kicker">{kicker}</div>}
      <h2 className="h2">{title}</h2>
      <div className="btns">{children}</div>
    </Box>
  )
}
