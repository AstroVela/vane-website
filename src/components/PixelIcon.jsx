/* Bitmap-style pixel icons: <rect>s with shape-rendering:crispEdges (set in CSS
   via .ic svg) so they read as crisp glyphs. Keyed by use-case name. */
const RECTS = {
  embeddings: [
    [2, 2, 8, 2], [2, 5, 8, 2], [2, 8, 8, 2],
  ],
  retrieval: [
    [2, 2, 3, 3], [6, 2, 3, 3], [2, 6, 3, 3], [9, 9, 2, 2],
  ],
  preprocessing: [
    [2, 2, 4, 4], [6, 6, 4, 4],
  ],
  vision: [
    [3, 3, 2, 2], [6, 5, 2, 2], [2, 8, 8, 2],
  ],
  generation: [
    [5, 2, 2, 8], [2, 5, 8, 2],
  ],
  multimodal: [
    [2, 2, 3, 3], [7, 2, 3, 3], [2, 7, 3, 3], [7, 7, 3, 3],
  ],
  audio: [
    [2, 6, 1.6, 4], [4.6, 3, 1.6, 7], [7.2, 5, 1.6, 5], [9.8, 2, 1.6, 8],
  ],
}

export default function PixelIcon({ name, size = 16 }) {
  const rects = RECTS[name] || []
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      {rects.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} />
      ))}
    </svg>
  )
}
