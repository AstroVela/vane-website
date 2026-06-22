import { useEffect, useState } from 'react'

/* Live GitHub star count for an `owner/repo`, fetched once per session and
   cached in sessionStorage. Returns a formatted string ("4.2k") or null while
   loading and on any failure — including when the repo is private, where the
   public API responds 404. Callers should render nothing when it's null. */
function format(n) {
  if (n < 1000) return String(n)
  return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
}

export function useGitHubStars(repo) {
  const cacheKey = `gh-stars:${repo}`
  const [stars, setStars] = useState(() => {
    if (typeof sessionStorage === 'undefined') return null
    const cached = sessionStorage.getItem(cacheKey)
    return cached !== null ? format(Number(cached)) : null
  })

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return undefined
    if (sessionStorage.getItem(cacheKey) !== null) return undefined
    let cancelled = false
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled || typeof data.stargazers_count !== 'number') return
        sessionStorage.setItem(cacheKey, String(data.stargazers_count))
        setStars(format(data.stargazers_count))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [repo, cacheKey])

  return stars
}
