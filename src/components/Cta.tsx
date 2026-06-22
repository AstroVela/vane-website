import type {PropsWithChildren} from 'react'
import Box from './Box'
import Mark from './Mark'

/* Centered closing CTA card. `children` are the action buttons. */
export default function Cta({ children }: PropsWithChildren) {
  return (
    <Box className="cta">
      <Mark size={34} />
      <h2 className="h2">Build your first multimodal AI pipeline with Vane.</h2>
      <div className="btns">{children}</div>
    </Box>
  )
}
