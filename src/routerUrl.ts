type LinkClickTarget = {
  href: string
  to: string
  currentHref: string
}

export function resolveLinkClickUrl({ href, to, currentHref }: LinkClickTarget): URL {
  const currentUrl = new URL(currentHref)
  const target = to.startsWith('#') ? to : href
  const base = target.startsWith('#') ? currentUrl.href : currentUrl.origin

  return new URL(target, base)
}
