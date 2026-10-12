export type ShowcaseState = {scenarioId:string; selections:Record<string,string>; analysisOpen:boolean; referenceId?:string; referenceImageOpen:boolean}
export type ShowcaseAction = {type:'scenario';id:string} | {type:'result';id:string} | {type:'analysis'} | {type:'reference';id?:string} | {type:'image';open:boolean} | {type:'initialize';scenario:string;result?:string}
export function initialShowcaseState(scenarioId='usage-demo'):ShowcaseState {return {scenarioId,selections:{},analysisOpen:false,referenceImageOpen:false}}
export function showcaseReducer(state:ShowcaseState,action:ShowcaseAction):ShowcaseState {
  switch(action.type) {
    case 'scenario': return {...state,scenarioId:action.id,analysisOpen:false,referenceId:undefined,referenceImageOpen:false}
    case 'result': return {...state,selections:{...state.selections,[state.scenarioId]:action.id},referenceId:undefined}
    case 'analysis': return {...state,analysisOpen:!state.analysisOpen}
    case 'reference': return {...state,referenceId:action.id}
    case 'image': return {...state,referenceImageOpen:action.open}
    case 'initialize': return {...state,scenarioId:action.scenario,selections:action.result?{[action.scenario]:action.result}:{}}
  }
}
