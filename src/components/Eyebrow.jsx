import { cx } from './cx'

/* Uppercase section kicker. `solo` (default) renders a single leading rule. */
export default function Eyebrow({ children, solo = true, className, ...rest }) {
  return (
    <span className={cx('eyebrow', solo && 'solo', className)} {...rest}>
      {children}
    </span>
  )
}
