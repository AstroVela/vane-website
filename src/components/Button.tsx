import type {AnchorHTMLAttributes, PropsWithChildren} from 'react'
import { Link } from '../router'
import { cx } from './cx'

/* Square mono button. Variants: solid (ink fill), sm (compact).
   Pass `to` for internal route links, `href` for plain/external anchors.
   `arrow` appends the trailing → in a .ar span. */
type ButtonProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string
  solid?: boolean
  sm?: boolean
  arrow?: boolean
}>

export default function Button({
  to,
  href,
  solid,
  sm,
  arrow,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cx('btn', solid && 'btn-solid', sm && 'btn-sm', className)
  const inner = (
    <>
      {children}
      {arrow && (
        <>
          {' '}
          <span className="ar">→</span>
        </>
      )}
    </>
  )
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={href || '#'} className={cls} {...rest}>
      {inner}
    </a>
  )
}
