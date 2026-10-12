export type Localized = {en: string; 'zh-CN': string}
export const l = (en: string, zh: string): Localized => ({en, 'zh-CN': zh})
export type MediaKind = 'video' | 'image' | 'audio'
export type Locator =
  | {kind: 'time'; assetId: string; start: number; end: number}
  | {kind: 'image'; assetId: string; regionIds: string[]}
export type ShowcaseAsset = {
  id: string; kind: MediaKind; title: Localized; alt: Localized
  url: string; posterUrl?: string; width?: number; height?: number
  duration?: number; waveform?: number[]
}
export type ImageRegion = {id: string; assetId: string; x: number; y: number; width: number; height: number}
export type Insight = {
  id: string; title: Localized; explanation: Localized; locators: Locator[]
  sourceExcerpt?: {language: string; text: string}; translation?: Localized
}
export type Showcase = {
  kind: MediaKind; assetId: string; headlineWord: Localized; label: Localized
  subtitle: Localized; summary: Localized; insightIds: string[]
}
