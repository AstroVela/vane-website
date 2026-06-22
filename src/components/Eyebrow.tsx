import type {HTMLAttributes, PropsWithChildren} from 'react'
import { cx } from './cx'

/* Uppercase section kicker. `solo` (default) renders a single leading rule. */
type EyebrowProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement> & {
  solo?: boolean
}>

export default function Eyebrow({ children, solo = true, className, ...rest }: EyebrowProps) {
  return (
    <span className={cx('eyebrow', solo && 'solo', className)} {...rest}>
      {children}
    </span>
  )
}
