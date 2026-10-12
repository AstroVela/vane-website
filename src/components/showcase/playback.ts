export type PlaybackIntent = 'auto' | 'hover' | 'manual'
const priority: Record<PlaybackIntent, number> = {auto: 0, hover: 1, manual: 2}
/** One owner across every media element in a showcase, including source previews. */
export class PlaybackController {
  private elements = new Map<string, HTMLMediaElement>()
  private owner?: {id: string; intent: PlaybackIntent; generation: number}
  private generation = 0
  private pausing = new Set<string>()
  private explicitlyPaused = new Set<string>()
  register(id: string, element: HTMLMediaElement) {
    this.elements.set(id, element)
    return () => {this.pause(id); this.elements.delete(id)}
  }
  async play(id: string, intent: PlaybackIntent) {
    const element = this.elements.get(id)
    if (!element || (intent !== 'manual' && this.explicitlyPaused.has(id))) return false
    if (this.owner?.id === id && priority[this.owner.intent] > priority[intent]) return !element.paused
    if (this.owner && this.owner.id !== id && priority[this.owner.intent] > priority[intent] && !this.elements.get(this.owner.id)?.paused) return false
    for (const otherId of Array.from(this.elements.keys())) if (otherId !== id) this.pause(otherId)
    if (intent === 'manual') this.explicitlyPaused.delete(id)
    const generation = ++this.generation
    this.owner = {id, intent, generation}
    try {
      await element.play()
      if (this.owner?.generation !== generation) {
        if (this.owner?.id !== id) element.pause()
        return false
      }
      return true
    } catch {if (this.owner?.generation === generation) this.owner = undefined; return false}
  }
  pause(id: string, explicit = false) {
    const element = this.elements.get(id)
    if (explicit) this.explicitlyPaused.add(id)
    if (element && !element.paused) {this.pausing.add(id); element.pause()}
    if (this.owner?.id === id) this.owner = undefined
  }
  stopped(id: string) {
    if (this.pausing.delete(id)) return
    this.explicitlyPaused.add(id)
    if (this.owner?.id === id) this.owner = undefined
  }
  isManual(id: string) {return this.owner?.id === id && this.owner.intent === 'manual'}
  pauseAll() {for (const id of Array.from(this.elements.keys())) this.pause(id)}
}
