export const NAV_OFFSET = 72

const MAX_HASH_SCROLL_ATTEMPTS = 20

export const prefersReducedMotion = () =>
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function decodeHash(hash) {
  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return hash.slice(1)
  }
}

export function scrollToHash(id, smooth) {
  let tries = 0
  const attempt = () => {
    const el = document.getElementById(id)
    if (!el) {
      if (tries++ < MAX_HASH_SCROLL_ATTEMPTS) requestAnimationFrame(attempt)
      return
    }

    const y = el.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET
    window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' })
  }
  attempt()
}
