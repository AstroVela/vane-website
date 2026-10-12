import type {MediaKind} from '../../content/types'
export const mediaKinds: MediaKind[] = ['video', 'image', 'audio']
export type HeroState = {
  activeMedia: MediaKind; rotationMode: 'auto' | 'manual'; selectedInsight: Partial<Record<MediaKind, string>>
  selectionEpoch: number; requestedInsight?: string; hovered: boolean; focusWithin: boolean; visible: boolean
  documentVisible: boolean; modalOpen: boolean; audible: boolean
}
export type HeroAction =
  | {type: 'select'; media: MediaKind; insight?: string; manual?: boolean}
  | {type: 'rotate'} | {type: 'mode'; mode: 'auto' | 'manual'}
  | {type: 'environment'; values: Partial<Pick<HeroState, 'hovered' | 'focusWithin' | 'visible' | 'documentVisible' | 'modalOpen' | 'audible'>>}
export function initialHeroState(media: MediaKind = 'video', auto = true): HeroState {
  return {activeMedia: media, rotationMode: auto ? 'auto' : 'manual', selectedInsight: {}, selectionEpoch: 0,
    hovered: false, focusWithin: false, visible: false, documentVisible: true, modalOpen: false, audible: false}
}
export function canRotate(state: HeroState) {
  return state.rotationMode === 'auto' && state.visible && state.documentVisible && !state.hovered && !state.focusWithin && !state.modalOpen && !state.audible
}
export function heroReducer(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case 'select': return {...state, activeMedia: action.media, selectionEpoch: state.selectionEpoch + 1,
      rotationMode: action.manual === false ? state.rotationMode : 'manual', audible: false, modalOpen: false, requestedInsight: action.insight,
      selectedInsight: action.insight ? {...state.selectedInsight, [action.media]: action.insight} : state.selectedInsight}
    case 'rotate': return canRotate(state) ? {...state, activeMedia: mediaKinds[(mediaKinds.indexOf(state.activeMedia) + 1) % mediaKinds.length], selectionEpoch: state.selectionEpoch + 1, audible: false, requestedInsight: undefined} : state
    case 'mode': return {...state, rotationMode: action.mode}
    case 'environment': return Object.entries(action.values).some(([key, value]) => state[key as keyof HeroState] !== value) ? {...state, ...action.values} : state
  }
}
