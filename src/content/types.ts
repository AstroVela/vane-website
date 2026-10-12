export type Localized = {en: string; 'zh-CN': string}
export const l = (en: string, zh: string): Localized => ({en, 'zh-CN': zh})
export type Modality = 'video' | 'image' | 'audio' | 'pdf'
export type Locator =
  | {kind: 'time_range'; startMs: number; endMs: number}
  | {kind: 'pdf_page'; page: number}
  | {kind: 'image'}
export type ShowcaseAsset = {
  id: string; modality: Modality; title: Localized; alt: Localized
  previewUrl: string; originalUrl?: string; posterUrl: string
  posterFrames?: {startMs:number;url:string}[]
  durationMs?: number; pageCount?: number; pageImages?: Record<number, string>
  sourceStartMs?: number; transcript?: Localized; waveform?: number[]
  attribution: Localized; provenance: 'authored-example'; sourceUrl?: string
}
export type ShowcaseReference = {id: string; assetId: string; locator: Locator; label: Localized; excerpt?: Localized}
export type ShowcaseResult = {
  id: string; assetId: string; locator: Locator; title: Localized; summary: Localized
  analysis: {text: Localized; referenceIds: string[]}[]; referenceIds: string[]
}
export type ShowcaseScenario = {
  id: string; label: Localized; question: Localized; defaultResultId: string
  referenceImageAssetId?: string; results: ShowcaseResult[]; solutionSlug: string
}
