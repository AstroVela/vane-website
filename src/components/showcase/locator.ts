import type {Locator, ShowcaseAsset} from '../../content/types'
export function formatTime(ms: number) {const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')}
export function locatorLabel(locator: Locator, locale: string) {
  if (locator.kind === 'time_range') return formatTime(locator.startMs) + '–' + formatTime(locator.endMs)
  if (locator.kind === 'pdf_page') return locale === 'en' ? 'Page ' + locator.page : '第 ' + locator.page + ' 页'
  return locale === 'en' ? 'Original image' : '原图'
}
export function sourceTime(asset: ShowcaseAsset, sourceMs: number) {return (sourceMs - (asset.sourceStartMs ?? 0)) / 1000}

export function posterFor(asset:ShowcaseAsset,locator:Locator) {
  if(locator.kind==='pdf_page')return asset.pageImages?.[locator.page]??asset.posterUrl
  if(locator.kind==='time_range')return asset.posterFrames?.filter(frame=>frame.startMs<=locator.startMs).at(-1)?.url??asset.posterUrl
  return asset.posterUrl
}
