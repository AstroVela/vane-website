export type DatabaseResult<T> = {results: T[]; success: boolean; meta: {changes?: number}}
export interface DatabaseStatement {
  bind(...values: unknown[]): DatabaseStatement
  first<T = Record<string, unknown>>(): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<DatabaseResult<T>>
  run(): Promise<DatabaseResult<Record<string, unknown>>>
}
export interface DemoDatabase {prepare(sql: string): DatabaseStatement}
export type Env = {
  ASSETS: {fetch(request: Request): Promise<Response>}
  DEMO_DB?: DemoDatabase; RESEND_API_KEY?: string; DEMO_FROM?: string; DEMO_TO?: string
  DEMO_RATE_LIMIT_SECRET?: string; DEMO_MODE?: 'production' | 'local'; DEMO_RETENTION_DAYS?: string
}
export type ExecutionContext = {waitUntil(promise: Promise<unknown>): void}
