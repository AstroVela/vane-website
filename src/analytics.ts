type EventName = 'hero_scenario_select' | 'hero_result_select' | 'hero_analysis_open' | 'hero_reference_open' | 'hero_media_select' | 'context_demo_click' | 'demo_submit_success' | 'demo_submit_error' | 'data_docs_click' | 'data_github_click'
type EventProperties = {product?: 'context' | 'data'; locale?: string; scenario?: string; result?: string; code?: string; media?: string; source?: 'manual' | 'auto'; insight?: string}
export function track(name: EventName, properties: EventProperties = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('vane:analytics', {detail: {name, path: window.location.pathname, ...properties}}))
}
