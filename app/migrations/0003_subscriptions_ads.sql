-- DayAxis: subscriptions (trial + paid plans) and sponsor ads. Additive only.
CREATE TABLE IF NOT EXISTS subscriptions (
  home_id TEXT PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'none',      -- none | trial | weekly | monthly | yearly
  status TEXT NOT NULL DEFAULT 'none',    -- none | active | expired
  started_at TEXT,
  expires_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  home_id TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  views INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ads_home ON ads(home_id);