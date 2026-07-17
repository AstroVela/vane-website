// Canonical external references for the site, kept in one place.
export const GITHUB_REPO = 'AstroVela/vane'
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`
export const BENCHMARK_WORKFLOW_URL = `${GITHUB_URL}/tree/main/multimodal_inference_benchmarks`
export const vaneSourceFileUrl = (path: string) => `${GITHUB_URL}/blob/main/${path}`
export const DOCS_EDIT_BASE_URL = 'https://github.com/AstroVela/vane-website/edit/main'

// Community Discord invite.
export const DISCORD_URL = 'https://discord.gg/BuKhPQcqs'

// Contact inbox.
export const CONTACT_EMAIL = 'pulse@astrovela.ai'
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`

const mailtoWithSubject = (subject: string) => `${CONTACT_MAILTO}?subject=${encodeURIComponent(subject)}`

export const DESIGN_PARTNER_MAILTO = mailtoWithSubject('Vane design partner')
export const TRAINING_DESIGN_PARTNER_MAILTO = mailtoWithSubject('Vane multimodal training data design partner')
export const ENTERPRISE_DESIGN_PARTNER_MAILTO = mailtoWithSubject('Vane enterprise multimodal data design partner')
