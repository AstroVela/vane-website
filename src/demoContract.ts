export const demoModalities = ['video', 'audio', 'image', 'pdf', 'text'] as const
export const demoSources = ['home', 'nav', 'footer', 'product-context', 'solution', 'developer', 'contact', 'direct'] as const
export const demoScenarios = ['usage-demo', 'image-match', 'document-evidence', 'video-research', 'audio-evidence', 'product-verification'] as const
export type DemoField = 'name' | 'email' | 'company' | 'need' | 'notes' | 'modalities'
export type DemoPayload = {name: string; email: string; company: string; need: string; notes: string; modalities: string[]; locale: 'en' | 'zh-CN'; source: string; scenario: string}
export type FieldError = 'required' | 'too_long' | 'invalid'
export const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
export function validateDemo(input: unknown): {payload?: DemoPayload; fieldErrors: Partial<Record<DemoField, FieldError>>} {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {fieldErrors: {name: 'required', email: 'required', company: 'required', need: 'required'}}
  const data = input as Record<string, unknown>
  const payload: DemoPayload = {name: '', email: '', company: '', need: '', notes: '', modalities: [], locale: data.locale === 'zh-CN' ? 'zh-CN' : 'en', source: demoSources.includes(data.source as typeof demoSources[number]) ? String(data.source) : 'direct', scenario: demoScenarios.includes(data.scenario as typeof demoScenarios[number]) ? String(data.scenario) : ''}
  const fieldErrors: Partial<Record<DemoField, FieldError>> = {}
  for (const [field, max, required] of [['name',80,true], ['email',254,true], ['company',160,true], ['need',2000,true], ['notes',1000,false]] as const) {
    if (data[field] != null && typeof data[field] !== 'string') {fieldErrors[field] = 'invalid'; continue}
    const value = typeof data[field] === 'string' ? (data[field] as string).trim() : ''
    payload[field] = value
    if (!value && required) fieldErrors[field] = 'required'
    else if (value.length > max) fieldErrors[field] = 'too_long'
  }
  payload.email = payload.email.toLowerCase()
  if (payload.email && !emailPattern.test(payload.email)) fieldErrors.email = 'invalid'
  if (data.modalities != null) {
    if (!Array.isArray(data.modalities) || data.modalities.some(v => typeof v !== 'string' || !demoModalities.includes(v as typeof demoModalities[number]))) fieldErrors.modalities = 'invalid'
    else payload.modalities = Array.from(new Set(data.modalities as string[])).sort()
  }
  return {payload: Object.keys(fieldErrors).length ? undefined : payload, fieldErrors}
}
export function demoBusinessIdentity(payload: DemoPayload) {
  return JSON.stringify([payload.name, payload.email, payload.company, payload.need, payload.modalities, payload.notes])
}
