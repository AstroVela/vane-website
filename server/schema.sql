CREATE TABLE IF NOT EXISTS demo_requests (
  request_id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  need TEXT NOT NULL,
  notes TEXT NOT NULL,
  modalities TEXT NOT NULL,
  locale TEXT NOT NULL,
  source TEXT NOT NULL,
  scenario TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  notified_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at INTEGER NOT NULL,
  lease_until INTEGER,
  last_error_code TEXT
);
CREATE INDEX IF NOT EXISTS demo_notifications_due ON demo_requests (next_attempt_at) WHERE notified_at IS NULL AND attempts < 6;
CREATE INDEX IF NOT EXISTS demo_requests_created ON demo_requests (created_at);
CREATE TABLE IF NOT EXISTS demo_rate_limits (
  ip_hash TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, window_start)
);
