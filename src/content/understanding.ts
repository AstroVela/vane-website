import {l, type Localized, type MediaKind} from './types'
import {insightFor, showcaseFor} from './showcases'
import brief from '../../public/showcase/context/brief.json'

export type UnderstandingMedia = MediaKind | 'pdf'
export type Evidence = {
  id: string; media: UnderstandingMedia; title: Localized; detail: Localized
  channel: Localized; quote?: string; translation?: Localized
  page?: number; region?: {x: number; y: number; width: number; height: number}
}
export type Question = {question: Localized; answer: Localized; evidence: string[]}
export type Field = {key: string; label: Localized; value: Localized; evidence: string}
export const understandingMedia: UnderstandingMedia[] = ['video','image','audio','pdf']
export const mediaLabels = {video:l('Video','视频'),image:l('Images','图片'),audio:l('Audio','音频'),pdf:l('PDF','PDF')}
export const pdfBrief = brief
const visual=l('Visual','画面'), speech=l('Speech','语音'), page=l('Page','页面')
export const evidence: Evidence[] = [
  ...['ingredients','blending','camping','cup','food','caption','portable','morning'].map(id=>{
    const i=insightFor(id)
    const media: MediaKind = ['ingredients','blending','camping'].includes(id)?'video':['cup','food','caption'].includes(id)?'image':'audio'
    return {id,media,title:i.title,detail:i.explanation,channel:id==='caption'?l('Image text','画面文字'):media==='audio'?speech:visual,quote:i.sourceExcerpt?.text,translation:i.translation}
  }),
  {id:'brief-direction',media:'pdf',title:l('A clear preparation sequence.','清晰的饮品制作顺序'),detail:l('The brief calls for ingredients, blending and serving in a campsite setting.','策划文档要求在露营场景中展示准备食材、搅拌和出杯的顺序。'),channel:page,page:1,region:{x:.065,y:.24,width:.87,height:.14}},
  {id:'brief-chart',media:'pdf',title:l('Preparation takes half the plan.','制作过程占计划内容的一半'),detail:l('The chart allocates 50% to preparation, 30% to outdoor use and 20% to serving. These are planned shares.','图表将计划内容的 50% 分配给制作过程，30% 给户外使用，20% 给出杯展示。这是计划占比。'),channel:l('Chart','图表'),page:2,region:{x:.065,y:.295,width:.87,height:.3}},
  {id:'brief-boundary',media:'pdf',title:l('Footage is not performance data.','画面不能证明产品表现'),detail:l('The brief explicitly separates creative references from product performance and conversion claims.','文档明确区分创作参考与产品性能、转化效果，不能仅凭画面推断。'),channel:page,page:1,region:{x:.065,y:.68,width:.87,height:.145}},
]
export const evidenceFor=(id: string)=>evidence.find(e=>e.id===id)!
export const summaries: Record<UnderstandingMedia,Localized> = {
 video:showcaseFor('video').summary,image:showcaseFor('image').summary,audio:showcaseFor('audio').summary,
 pdf:l('An example creative brief, with an outdoor scene, a planned content mix and clear source boundaries.','一份示例创作简报，包含露营场景要求、计划内容分配和资料使用边界。'),
}
export const questions:Record<UnderstandingMedia,Question[]>={
 video:[
  {question:l('How is the product used?','视频如何展示产品的使用方式？'),answer:l('The video shows a preparation sequence: pour a drink and add ice, then start the blender on the outdoor table. The campsite makes the setting explicit.','视频通过连续动作展示使用方式：先倒入饮料与冰块，再在户外桌面上启动搅拌机。帐篷和草地交代了露营场景。'),evidence:['ingredients','blending','camping']},
  {question:l('Which moments show preparation?','哪些片段可以用作制作过程参考？'),answer:l('Use the ingredient sequence at 00:01-00:04 and the blending action at 00:05-00:07. These show visible actions, without establishing performance or conversion results.','可以参考 00:01-00:04 的加入饮料与冰块，以及 00:05-00:07 的搅拌动作。这些片段说明可见操作，不证明性能或转化效果。'),evidence:['ingredients','blending']},
 ],
 image:[
  {question:l('What ingredients are visible?','画面里有哪些食材？'),answer:l('The three bowls contain strawberries, banana and powder. The powder’s exact composition cannot be confirmed visually.','三个碗中分别有草莓、香蕉和粉末。仅凭画面无法确定粉末的具体成分。'),evidence:['food']},
  {question:l('What does the caption mean?','画面文字是什么意思？'),answer:l('The Dutch caption reads “Aardbeien + Chocolade smoothie”: strawberry + chocolate smoothie. The nutribullet mark is also visible on the cup.','荷兰语标题“Aardbeien + Chocolade smoothie”意为“草莓＋巧克力奶昔”。杯体上还可以看到 nutribullet 标识。'),evidence:['caption','cup']},
 ],
 audio:[
  {question:l('Which use cases does the narrator describe?','旁白强调了哪些使用场景？'),answer:l('The narrator connects portability with making smoothies anywhere, then names a morning smoothie routine. These are the ad’s statements, not independently verified product claims.','旁白先将便携性与随时制作奶昔联系起来，再提到早晨饮品习惯。这些是广告中的表达，不是独立验证的产品结论。'),evidence:['portable','morning']},
  {question:l('Where is portability expressed?','便携性的表达出现在哪里？'),answer:l('At 00:03-00:07, the narrator says: “I can take it anywhere and blend smoothies anytime.” Listen to that source window to verify the wording.','在 00:03-00:07，旁白表达“我可以把它带到任何地方，随时制作奶昔”。可以试听该时间窗口核对原话。'),evidence:['portable']},
 ],
 pdf:[
  {question:l('Where should the content focus?','内容应该重点分配在哪个部分？'),answer:l('Preparation has the largest planned share at 50%, followed by outdoor use at 30% and serving at 20%. The chart describes editorial allocation, not measured campaign performance.','制作过程的计划占比最高，为 50%；其次是户外使用 30%、出杯展示 20%。图表描述内容规划，不是活动效果实测。'),evidence:['brief-chart']},
  {question:l('What can the reference assets support?','这些参考素材可以支持哪些判断？'),answer:l('They can illustrate the planned scene and preparation actions. The brief cautions against inferring product performance or conversion from footage alone.','素材可以说明计划中的场景与制作动作。简报明确提醒，不应仅凭画面推断产品性能或转化效果。'),evidence:['brief-direction','brief-boundary']},
 ],
}
export const fields:Record<UnderstandingMedia,Field[]>={
 video:[{key:'scene',label:l('Setting','使用场景'),value:l('Outdoor campsite','户外露营'),evidence:'camping'},{key:'preparation',label:l('Preparation','准备动作'),value:l('Pour the drink; add ice','倒入饮料，加入冰块'),evidence:'ingredients'},{key:'action',label:l('Product action','产品操作'),value:l('Start blending','启动搅拌'),evidence:'blending'}],
 image:[{key:'brand_visible',label:l('Visible brand','可见品牌'),value:l('nutribullet','nutribullet'),evidence:'cup'},{key:'ingredients_visible',label:l('Visible ingredients','可见食材'),value:l('Strawberries, banana, powder','草莓、香蕉、粉末'),evidence:'food'},{key:'caption_original',label:l('Original text','画面原文'),value:l('Aardbeien + Chocolade smoothie','Aardbeien + Chocolade smoothie'),evidence:'caption'},{key:'caption_translation',label:l('Translation','译文'),value:l('Strawberry + chocolate smoothie','草莓＋巧克力奶昔'),evidence:'caption'}],
 audio:[{key:'message',label:l('Ad message','宣传表达'),value:l('Take it anywhere','随身携带'),evidence:'portable'},{key:'use_case',label:l('Use case','使用场景'),value:l('Morning smoothie routine','早晨饮品习惯'),evidence:'morning'},{key:'source_quote',label:l('Original words','对应原话'),value:l('I can take it anywhere and blend smoothies anytime.','I can take it anywhere and blend smoothies anytime.'),evidence:'portable'}],
 pdf:[{key:'setting',label:l('Planned setting','计划场景'),value:l('Campsite','露营'),evidence:'brief-direction'},{key:'preparation_share',label:l('Preparation share','制作过程占比'),value:l('50% of planned content','计划内容的 50%'),evidence:'brief-chart'},{key:'outdoor_share',label:l('Outdoor use share','户外使用占比'),value:l('30% of planned content','计划内容的 30%'),evidence:'brief-chart'},{key:'serving_share',label:l('Serving share','出杯展示占比'),value:l('20% of planned content','计划内容的 20%'),evidence:'brief-chart'}],
}
