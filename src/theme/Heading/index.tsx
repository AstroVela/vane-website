import clsx from 'clsx'
import type {ReactNode} from 'react'
import {useAnchorTargetClassName} from '@docusaurus/theme-common'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import type {Props} from '@theme/Heading'

export default function Heading({as: As, id, ...props}: Props): ReactNode {
  const brokenLinks = useBrokenLinks()
  const anchorTargetClassName = useAnchorTargetClassName(id)

  if (As === 'h1' || !id) {
    return <As {...props} id={undefined} />
  }

  brokenLinks.collectAnchor(id)

  return (
    <As
      {...props}
      className={clsx('anchor', anchorTargetClassName, props.className)}
      id={id}
    />
  )
}
