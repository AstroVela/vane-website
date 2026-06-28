import type {ProductId} from './products'

/* Pixel product glyphs, ported from the design prototype's GLYPHS map.
   `data` uses fixed tonal grays (its bars are part of the brand mark); the
   coming-soon products draw in `currentColor` so they inherit the muted tone
   of whatever tile they sit in. */
export default function ProductGlyph({ id, size = 13 }: { id: ProductId; size?: number }) {
  if (id === 'data') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="2" y="3" width="12" height="2" fill="#15171E" />
        <rect x="2" y="7" width="12" height="2" fill="#5B5F6B" />
        <rect x="2" y="11" width="12" height="2" fill="#9BA0AB" />
      </svg>
    )
  }
  if (id === 'agent') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="5" y="2" width="6" height="6" fill="currentColor" />
        <rect x="4" y="9" width="8" height="5" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="11" width="3" height="3" fill="currentColor" />
      <rect x="6" y="7" width="3" height="7" fill="currentColor" />
      <rect x="10" y="3" width="3" height="11" fill="currentColor" />
    </svg>
  )
}
