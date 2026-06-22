import type {ComponentPropsWithoutRef, ElementType, PropsWithChildren} from 'react'
import { cx } from './cx'

/* The signature surface: boxy card + dotted offset shadow.
   `flat` removes the shadow (tables). `as` swaps the element (e.g. an <a> card). */
type BoxOwnProps<T extends ElementType> = PropsWithChildren<{
  as?: T
  flat?: boolean
  className?: string
}>

type BoxProps<T extends ElementType> = BoxOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BoxOwnProps<T>>

export default function Box<T extends ElementType = 'div'>({
  flat,
  className,
  as,
  children,
  ...rest
}: BoxProps<T>) {
  const Tag = as ?? 'div'

  return (
    <Tag className={cx('box', flat && 'flat', className)} {...rest}>
      {children}
    </Tag>
  )
}
