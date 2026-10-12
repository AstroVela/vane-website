import audio from '../../public/showcase/v1/audio-metadata.json'
import {l, type ShowcaseAsset, type ShowcaseReference, type ShowcaseResult, type ShowcaseScenario, type Locator} from './types'
const path = '/showcase/v1/'
const attribution = l('Luma Go · authored example collection', 'Luma Go · 自制示例资料')
export const showcaseAssets: ShowcaseAsset[] = [
  {id: 'demo-video', modality: 'video', title: l('Luma Go / strawberry smoothie demonstration', 'Luma Go / 草莓奶昔演示'),
    alt: l('A sage-green portable blender, strawberries and milk on a sunlit kitchen counter.', '阳光下的厨房台面，鼠尾草绿便携搅拌杯、草莓与牛奶。'),
    previewUrl: path + 'product-demo.mp4', originalUrl: path + 'product-demo.mp4', posterUrl: path + 'product-action.webp', durationMs: 18000, posterFrames:[{startMs:0,url:path+'product-action.webp'},{startMs:6000,url:path+'product-blended.webp'},{startMs:12000,url:path+'product-catalog.webp'}], attribution, provenance: 'authored-example'},
  {id: 'catalog-image', modality: 'image', title: l('Luma Go / product image', 'Luma Go / 产品图片'), alt: l('A sage-green blender filled with pink smoothie, next to a glass and strawberries.', '装有粉色奶昔的绿色搅拌杯，旁边是玻璃杯与草莓。'),
    previewUrl: path + 'product-catalog.webp', originalUrl: path + 'product-catalog.webp', posterUrl: path + 'product-catalog.webp', attribution, provenance: 'authored-example'},
  {id: 'action-image', modality: 'image', title: l('Luma Go / preparation scene', 'Luma Go / 准备场景'), alt: l('Fruit and milk in the blender before blending.', '搅拌前杯内的水果与牛奶。'),
    previewUrl: path + 'product-action.webp', originalUrl: path + 'product-action.webp', posterUrl: path + 'product-action.webp', attribution, provenance: 'authored-example'},
  {id: 'briefing-audio', modality: 'audio', title: l('Luma Go / product briefing', 'Luma Go / 产品介绍录音'), alt: l('Spoken product briefing about cup capacity, preparation and cleaning.', '介绍杯体容量、准备步骤与清洁方法的语音。'),
    previewUrl: path + 'product-briefing.wav', originalUrl: path + 'product-briefing.wav', posterUrl: path + 'audio-poster.svg', durationMs: audio.durationMs, waveform: audio.waveform,
    transcript: l(audio.transcript, 'Luma Go 是一款带 500 毫升杯体的便携搅拌杯。先加入液体，再加入小块水果。启动前旋紧杯盖。使用后拆下杯体冲洗，不要将电机底座浸入水中。'),
    attribution, provenance: 'authored-example'},
  {id: 'product-guide', modality: 'pdf', title: l('Luma Go / product guide', 'Luma Go / 产品说明书'), alt: l('Product guide with setup steps, specifications and cleaning instructions.', '包含操作步骤、规格和清洁说明的产品说明书。'),
    previewUrl: path + 'product-guide.pdf', originalUrl: path + 'product-guide.pdf', posterUrl: path + 'guide-page-2.webp', pageCount: 3,
    pageImages: {1: path + 'guide-page-1.webp', 2: path + 'guide-page-2.webp', 3: path + 'guide-page-3.webp'}, attribution, provenance: 'authored-example'},
]
const time = (startMs: number, endMs: number): Locator => ({kind: 'time_range', startMs, endMs})
const page = (page: number): Locator => ({kind: 'pdf_page', page})
export const showcaseReferences: ShowcaseReference[] = [
  {id: 'prepare', assetId: 'demo-video', locator: time(0, 6000), label: l('Video · 00:00–00:06', '视频 · 00:00–00:06')},
  {id: 'blend', assetId: 'demo-video', locator: time(6000, 12000), label: l('Video · 00:06–00:12', '视频 · 00:06–00:12')},
  {id: 'serve', assetId: 'demo-video', locator: time(12000, 18000), label: l('Video · 00:12–00:18', '视频 · 00:12–00:18')},
  {id: 'image', assetId: 'catalog-image', locator: {kind: 'image'}, label: l('Product image', '产品原图')},
  {id: 'action', assetId: 'action-image', locator: {kind: 'image'}, label: l('Preparation image', '准备场景原图')},
  {id: 'speech', assetId: 'briefing-audio', locator: time(0, audio.durationMs), label: l('Audio · product briefing', '音频 · 产品介绍')},
  {id: 'steps', assetId: 'product-guide', locator: page(1), label: l('Guide · page 1', '说明书 · 第 1 页'), excerpt: l('Add liquid first, then small pieces of fruit. Secure the lid before starting.', '先加入液体，再加入小块水果。启动前旋紧杯盖。')},
  {id: 'capacity', assetId: 'product-guide', locator: page(2), label: l('Guide · page 2', '说明书 · 第 2 页'), excerpt: l('Cup capacity: 500 ml. Charging connector: USB-C.', '杯体容量：500 ml。充电接口：USB-C。')},
  {id: 'care', assetId: 'product-guide', locator: page(3), label: l('Guide · page 3', '说明书 · 第 3 页'), excerpt: l('Detach and rinse the cup after use. Keep the motor base out of water.', '使用后拆下并冲洗杯体。不要将电机底座浸入水中。')},
]
const demo: ShowcaseResult = {
  id: 'preparation-clip', assetId: 'demo-video', locator: time(0, 12000), title: l('From ingredients to a smoothie.', '从食材到奶昔，关键步骤都在这里。'),
  summary: l('This segment brings together the ingredients, secured lid and blending controls. See the relevant steps and their source references.', '这个片段呈现了食材准备、杯盖与启动按钮。展开即可查看操作要点及对应依据。'),
  referenceIds: ['prepare', 'blend'],
  analysis: [
    {text: l('The preparation scene shows strawberries and milk inside the transparent blending cup.', '准备场景中，透明杯体里已经放入草莓与牛奶。'), referenceIds: ['prepare', 'action']},
    {text: l('The matching demonstration places the start control on the base, then shows the finished pink smoothie.', '演示将启动操作定位在杯体底座，并展示完成后的粉色奶昔。'), referenceIds: ['blend', 'serve']},
    {text: l('The guide adds the operating instruction: add liquid first and secure the lid before starting.', '说明书补充了操作要求：先加液体，启动前旋紧杯盖。'), referenceIds: ['steps']},
  ],
}
const audioResult: ShowcaseResult = {id: 'audio-briefing', assetId: 'briefing-audio', locator: time(0, audio.durationMs),
  title: l('The spoken instructions, ready to inspect.', '语音中的使用说明，也能核对。'), summary: l('A short briefing explains capacity, preparation and cleaning. Play the recording alongside its transcript.', '一段简短介绍说明了容量、准备步骤和清洁方法，可对照转写播放原录音。'),
  referenceIds: ['speech'], analysis: [
    {text: l('The briefing names a 500 ml cup and explains the order of adding ingredients.', '介绍中明确提到 500 毫升杯体，以及先加液体的顺序。'), referenceIds: ['speech', 'capacity']},
    {text: l('It separates cleaning the removable cup from protecting the motor base.', '录音将可拆杯体的清洗与电机底座的防水注意事项分开说明。'), referenceIds: ['speech', 'care']},
  ]}
export const showcaseScenarios: ShowcaseScenario[] = [
  {id: 'usage-demo', label: l('Find a demonstration', '找一段使用演示'), question: l('Which clips show how to use this portable blender?', '哪些内容展示了这款便携搅拌杯的使用步骤？'), defaultResultId: demo.id, solutionSlug: 'video-research',
    results: [demo, {id: 'finished-smoothie', assetId: 'demo-video', locator: time(12000, 18000), title: l('A clear view of the finished drink.', '完成效果与产品同框。'), summary: l('The finished smoothie and product appear together in the closing shot.', '收尾画面中，成品奶昔与搅拌杯一同出现。'), referenceIds: ['serve'], analysis: [{text: l('The closing scene provides a clean product-and-result view for presenting the finished drink.', '收尾场景提供了清晰的产品与完成效果画面。'), referenceIds: ['serve', 'image']}]}, audioResult]},
  {id: 'image-match', label: l('Search with an image', '用图片找素材'), question: l('Find media featuring the product in this reference image.', '找到与这张产品图相关的素材。'), referenceImageAssetId: 'catalog-image', defaultResultId: 'matching-product', solutionSlug: 'product-verification',
    results: [
      {id: 'matching-product', assetId: 'catalog-image', locator: {kind: 'image'}, title: l('The same product, in a clean campaign shot.', '同款产品，适合展示的素材。'), summary: l('The sage base, transparent cup and pink smoothie connect this image to the demonstration.', '绿色底座、透明杯体与粉色奶昔，将产品图与演示素材对应起来。'), referenceIds: ['image'], analysis: [
        {text: l('The matching features are the sage-green cylindrical base, single round control and transparent cup.', '匹配特征包括鼠尾草绿圆柱底座、单个圆形按钮和透明杯体。'), referenceIds: ['image', 'action']},
        {text: l('The demonstration contains the same product in use, adding context to the catalogue view.', '演示片段中的同款产品提供了产品图之外的使用场景。'), referenceIds: ['blend']},
      ]},
      {id: 'matching-preparation', assetId: 'action-image', locator: {kind: 'image'}, title: l('A related preparation scene.', '相关的食材准备场景。'), summary: l('The same product with fruit and milk, before blending.', '同款产品与水果、牛奶一同出现，呈现搅拌前的状态。'), referenceIds: ['action'], analysis: [{text: l('The product shape and sage-green finish match the reference image.', '产品形状与绿色外观和参考图一致。'), referenceIds: ['action', 'image']}]},
      {id: 'matching-video', assetId: 'demo-video', locator: time(6000, 12000), title: l('The product in the demonstration.', '演示中的同款产品。'), summary: l('Find the relevant time window, rather than scanning the entire video.', '直接定位相关时间窗，无需逐段浏览整个视频。'), referenceIds: ['blend'], analysis: [{text: l('The matching clip shows the control on the same blender base.', '命中片段展示了同款搅拌杯底座上的按钮。'), referenceIds: ['blend', 'image']}]},
    ]},
  {id: 'document-evidence', label: l('Find document evidence', '查找文档依据'), question: l('What is the cup capacity, and where is it documented?', '这款搅拌杯的容量是多少？资料里的说明在哪里？'), defaultResultId: 'cup-capacity', solutionSlug: 'product-verification',
    results: [
      {id: 'cup-capacity', assetId: 'product-guide', locator: page(2), title: l('500 ml, with the source page.', '500 毫升，原始页码可直接核对。'), summary: l('The specification on page 2 lists the cup capacity. The same value appears in the recorded briefing.', '说明书第 2 页列出了杯体容量，产品介绍录音中也有对应说明。'), referenceIds: ['capacity'], analysis: [
        {text: l('The specification states “Cup capacity: 500 ml”.', '规格说明明确写出“杯体容量：500 ml”。'), referenceIds: ['capacity']},
        {text: l('The spoken briefing provides a second source for the capacity.', '产品介绍录音为容量提供了另一份对应依据。'), referenceIds: ['speech']},
        {text: l('The cleaning page distinguishes the cup from the motor base. Capacity describes the cup, not the full assembly.', '清洁页区分了杯体与电机底座；容量描述的是杯体。'), referenceIds: ['care']},
      ]},
      {id: 'operating-guide', assetId: 'product-guide', locator: page(1), title: l('The operating steps.', '完整的使用步骤。'), summary: l('Preparation and starting instructions, on page 1.', '第 1 页中的准备与启动说明。'), referenceIds: ['steps'], analysis: [{text: l('The guide specifies adding liquid first and securing the lid.', '说明书明确要求先加液体并旋紧杯盖。'), referenceIds: ['steps', 'prepare']}]},
      {id: 'cleaning-guide', assetId: 'product-guide', locator: page(3), title: l('Cleaning and care.', '清洁与维护说明。'), summary: l('Page 3 explains which parts can be rinsed.', '第 3 页说明了哪些部件可以清洗。'), referenceIds: ['care'], analysis: [{text: l('Rinse the detached cup; do not immerse the motor base.', '拆下杯体冲洗，不要将电机底座浸入水中。'), referenceIds: ['care', 'speech']}]},
    ]},
]
