import {l, type Insight, type Showcase, type ShowcaseAsset} from './types'
import waveform from '../../public/showcase/marketing/audio-waveform.json'
import regions from '../../public/showcase/marketing/image-regions.json'
import videoEvidence from '../../public/showcase/marketing/video-evidence.json'
import audioEvidence from '../../public/showcase/marketing/audio-evidence.json'

const media = '/showcase/marketing/'
export const showcaseAssets: ShowcaseAsset[] = [
  {id: 'comp_001', kind: 'video', title: l('A drink at the campsite', '露营饮品视频'),
    alt: l('A portable blender on an outdoor camping table, with drink preparation and blending.', '户外露营桌上的便携搅拌机，展示倒入饮料与搅拌过程。'),
    url: media + 'comp_001-video.d6e511e9ab24.mp4', posterUrl: media + 'comp_001-poster.45b2669dc293.webp', width: 720, height: 1280, duration: 21.802,
    previews: [{url: media + 'comp_001-preview-360.f4d47ff971a3.mp4', width: 360, height: 640}, {url: media + 'comp_001-preview-480.82ffe06af783.mp4', width: 480, height: 854}]},
  {id: 'comp_005', kind: 'image', title: l('Ingredients in the kitchen', '饮品制作图片'),
    alt: l('The first original frame: a nutribullet cup, strawberries, banana and powder, with the text Aardbeien + Chocolade smoothie.', '原始首帧：nutribullet 搅拌杯、草莓、香蕉和粉末，画面文字为 Aardbeien + Chocolade smoothie。'),
    url: media + 'comp_005-image.b3187abe73e8.webp', width: 576, height: 1024},
  {id: 'comp_008', kind: 'audio', title: l('The product in the narrator’s words', '产品广告旁白'),
    alt: l('Original English advertising narration about a portable bottle blender.', '便携式搅拌机的原始英文广告旁白。'),
    url: media + 'comp_008-audio.bde3f1654c99.m4a', duration: 14.789, waveform},
]
export const imageRegions = regions
const videoLocators = (id: string) => videoEvidence.filter(e => e.id === id).map(e => ({kind: 'time' as const, assetId: e.assetId, start: e.start, end: e.end}))
const audioLocators = (id: string) => audioEvidence.filter(e => e.id === id).map(e => ({kind: 'time' as const, assetId: e.assetId, start: e.start, end: e.end}))
export const showcaseInsights: Insight[] = [
  {id: 'ingredients', title: l('Pour the drink. Add ice.', '倒入饮料与冰块'),
    explanation: l('The opening shows the ingredients going into the blender cup.', '开场展示将饮料和冰块加入搅拌杯。'), locators: videoLocators('ingredients')},
  {id: 'blending', title: l('Start blending.', '启动搅拌'),
    explanation: l('The next action shows the blender in use on the outdoor table.', '随后在户外桌面上启动搅拌机。'), locators: videoLocators('blending')},
  {id: 'camping', title: l('An outdoor camping setting.', '露营场景'),
    explanation: l('The tent, outdoor table and grass establish the setting.', '帐篷、户外桌面与草地交代了使用场景。'), locators: videoLocators('camping')},
  {id: 'cup', title: l('Blender cup and brand.', '搅拌杯与品牌标识'),
    explanation: l('A cup is held in the center. The nutribullet mark is visible on its base.', '画面中央手持搅拌杯，杯体底部可见 nutribullet 标识。'),
    locators: [{kind: 'image', assetId: 'comp_005', regionIds: ['cup']}]},
  {id: 'food', title: l('Strawberries, banana and powder.', '草莓、香蕉与粉末'),
    explanation: l('Three bowls of ingredients are visible on the kitchen counter.', '厨房台面上的三个碗中，分别有草莓、香蕉和粉末。'),
    locators: [{kind: 'image', assetId: 'comp_005', regionIds: ['strawberries', 'banana', 'powder']}]},
  {id: 'caption', title: l('Read the words in the image.', '识别画面文字'),
    explanation: l('The caption names a strawberry and chocolate smoothie.', '画面标题说明这是草莓与巧克力奶昔。'),
    sourceExcerpt: {language: 'nl', text: 'Aardbeien + Chocolade smoothie'}, translation: l('Strawberry + chocolate smoothie', '草莓＋巧克力奶昔'),
    locators: [{kind: 'image', assetId: 'comp_005', regionIds: ['text']}]},
  {id: 'portable', title: l('Portability, in the narrator’s words.', '旁白强调便携性'),
    explanation: l('The narrator says the blender can be taken anywhere to make smoothies.', '旁白表达了随身携带、随时制作奶昔的使用方式。'),
    sourceExcerpt: {language: 'en', text: audioEvidence[0].text}, translation: l(audioEvidence[0].text, '我可以把它带到任何地方，随时制作奶昔。'), locators: audioLocators('portable')},
  {id: 'morning', title: l('A morning smoothie routine.', '早晨饮品场景'),
    explanation: l('The next line connects the product to a morning routine.', '下一句将产品使用与早晨的饮品习惯联系起来。'),
    sourceExcerpt: {language: 'en', text: audioEvidence[1].text}, translation: l(audioEvidence[1].text, '现在我不用担心错过早晨的奶昔了。'), locators: audioLocators('morning')},
]
export const showcases: Showcase[] = [
  {kind: 'video', assetId: 'comp_001', label: l('Video', '视频'), headlineWord: l('videos', '视频'),
    subtitle: l('Understand scenes and actions. Find the relevant moments.', '看懂场景与动作，定位值得使用的片段。'),
    summary: l('A drink comes together at the campsite: pour the ingredients, then start blending.', '露营场景中的饮品制作：倒入饮料、加入冰块，随后启动搅拌。'), insightIds: ['ingredients', 'blending', 'camping']},
  {kind: 'image', assetId: 'comp_005', label: l('Images', '图片'), headlineWord: l('images', '图片'),
    subtitle: l('Understand objects, scenes and text. Inspect the source image.', '理解物体、场景与文字，定位画面中的依据。'),
    summary: l('A kitchen scene with a blender cup, ingredients and a strawberry + chocolate smoothie caption.', '搅拌杯与饮品食材的厨房场景，画面文字说明草莓与巧克力奶昔。'), insightIds: ['cup', 'food', 'caption']},
  {kind: 'audio', assetId: 'comp_008', label: l('Audio', '音频'), headlineWord: l('audio', '音频'),
    subtitle: l('Understand what is said. Listen to the source.', '听懂内容与表达，定位每一句话的出处。'),
    summary: l('The advertising narrator describes portability, making smoothies anywhere and a morning routine.', '广告旁白中的产品表达：便携、随时制作奶昔，以及日常早餐场景。'), insightIds: ['portable', 'morning']},
]
export function showcaseFor(kind: string) {return showcases.find(s => s.kind === kind) ?? showcases[0]}
export function assetFor(id: string) {return showcaseAssets.find(a => a.id === id)!}
export function insightFor(id: string) {return showcaseInsights.find(i => i.id === id)!}
