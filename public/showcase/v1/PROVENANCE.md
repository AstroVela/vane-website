# Luma Go showcase assets

Luma Go is a fictional portable blender. This collection was authored for Vane's website to demonstrate ideal multimodal search, analysis and inspectable references. Images, speech, document facts and result copy are illustrative. No customer materials or private service results are included.

## Images

Generated with the built-in image generation tool on 2026-10-12. Full prompts:

1. **Preparation / product-action.webp**: Premium editorial product photograph for a fictional, unbranded portable blender. A small sage-green cylindrical motor base with one round button, transparent cup, sage lid, strawberries, peach and milk on a sunlit stone kitchen counter. A hand secures the lid. Warm natural daylight, linen, calm sage accents, close-up composition, 16:9. No logos, text, watermarks or UI.
2. **Blending / product-blended.webp**: Edit the preparation photograph, preserving the exact blender shape, kitchen, camera angle and sage-green finish. Show uniform pink smoothie inside the transparent cup, a hand pressing the round button on the base. Premium product photography, natural light, no logos, text or UI.
3. **Product / product-catalog.webp**: Edit the preparation photograph. Preserve the same unbranded sage portable blender. Remove the person and hand. Show the blender filled with smooth pink smoothie next to a glass of the drink and strawberries. Clean, premium product catalogue composition, sage background, natural light, 16:9. No logos, text or UI.

Generated originals were resized to 1280 px wide and encoded as WebP. These prompts record the intended visual specification; image variations may differ in small details.

## Video

`product-demo.mp4` is an 18-second animated storyboard assembled from those three generated images, six seconds per scene, with a gentle camera crop. It is a silent H.264 MP4 with fast-start metadata. Source references locate the preparation, blending and finished-product scenes at 0–6, 6–12 and 12–18 seconds. It is authored example media, not a recording of a real customer's product.

## Audio

`product-briefing.wav` is synthesized English speech. Its transcript:

> Luma Go is a portable blender with a five hundred milliliter cup. Add liquid first, then small pieces of fruit. Secure the lid before starting. After use, detach and rinse the cup. Keep the motor base out of water.

The waveform and duration in `audio-metadata.json` were computed from the actual WAV. Chinese text is a translation, not a separate Chinese recording.

## Document

`product-guide.pdf` is an authored three-page guide for the same fictional product: page 1 operating steps, page 2 capacity and specifications, page 3 cleaning. Its WebP page previews are rendered from that PDF. Source citations and excerpts refer to those pages.

## Maintenance

Update `src/content/showcases.ts` when assets change. Run `npm run showcase:check` to validate asset existence, IDs, locators and translated content. Browser checks exercise playback, page/image enlargement and return to the selected result. The website performs no online ingestion, retrieval or model analysis.
