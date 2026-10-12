import type {Locator} from '../../content/types'
export function formatTime(seconds: number) {
  const time = Math.max(0, Math.floor(seconds))
  return `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`
}
export function locatorLabel(locator: Locator, locale: 'en' | 'zh-CN') {
  return locator.kind === 'time' ? `${formatTime(locator.start)}–${formatTime(locator.end)}` : locale === 'en' ? 'View in image' : '定位原图'
}
