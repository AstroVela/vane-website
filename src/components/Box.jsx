import { cx } from './cx'

/* The signature surface: boxy card + dotted offset shadow.
   `flat` removes the shadow (tables). `as` swaps the element (e.g. an <a> card). */
export default function Box({ flat, className, as: Tag = 'div', children, ...rest }) {
  return (
    <Tag className={cx('box', flat && 'flat', className)} {...rest}>
      {children}
    </Tag>
  )
}
