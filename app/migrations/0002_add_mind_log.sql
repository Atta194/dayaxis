-- DayAxis: meditation & sleep logs. Additive only.
CREATE TABLE IF NOT EXISTS mind_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  home_id TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'meditation', -- 'meditation' | 'sleep'
  minutes INTEGER NOT NULL DEFAULT 0,
  mood INTEGER,
  note TEXT NOT NULL DEFAULT '',
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mind_home ON mind_log(home_id);