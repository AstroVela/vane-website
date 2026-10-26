import {useEffect, useState} from 'react'

function format(n: number) {
  return n < 1000 ? String(n) : (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
}

export function useGitHubStars(repo: string) {
  const [stars, setStars] = useState<string | null>(null)
  useEffect(() => {
    const key = `gh-stars:${repo}`
    try {
      const cached = sessionStorage.getItem(key)
      if (cached !== null && Number.isFinite(Number(cached)) && Number(cached) >= 0) {
        // Read browser-only cached state after hydration, without a synchronous effect render.
        const frame = requestAnimationFrame(() => setStars(format(Number(cached))))
        return () => cancelAnimationFrame(frame)
      }
    } catch { /* The link works when browser storage is unavailable. */ }
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${repo}`, {signal: controller.signal})
      .then(response => response.ok ? response.json() : Promise.reject(response.status))
      .then((data: {stargazers_count?: number}) => {
        const count = data.stargazers_count
        if (controller.signal.aborted || typeof count !== 'number' || !Number.isFinite(count) || count < 0) return
        setStars(format(count))
        try { sessionStorage.setItem(key, String(count)) } catch { /* Optional cache. */ }
      }).catch(() => {})
    return () => controller.abort()
  }, [repo])
  return stars
}
