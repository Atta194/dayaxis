-- DayAxis schema (D1 / SQLite dialect). Additive only.
CREATE TABLE IF NOT EXISTS homes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'My Home',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  home_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#1E7A6B',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_members_home ON members(home_id);

-- repeat: 'none' | 'weekly' (weekdays CSV 0-6) | 'custom' (interval_days)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  home_id TEXT NOT NULL,
  member_id INTEGER,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'custom',
  notes TEXT NOT NULL DEFAULT '',
  task_date TEXT,
  time TEXT,
  repeat TEXT NOT NULL DEFAULT 'none',
  weekdays TEXT NOT NULL DEFAULT '',
  interval_days INTEGER,
  checklist TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tasks_home ON tasks(home_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(task_date);

CREATE TABLE IF NOT EXISTS completions (
  task_id TEXT NOT NULL,
  on_date TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'done',  -- 'done' | 'postponed'
  at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (task_id, on_date)
);
CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(on_date);

CREATE TABLE IF NOT EXISTS workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_home TEXT,
  name TEXT NOT NULL,
  trade TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  experience_years INTEGER NOT NULL DEFAULT 0,
  bio TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available', -- available | busy | offline
  availability TEXT NOT NULL DEFAULT 'now', -- now | today | week
  rate TEXT NOT NULL DEFAULT '',
  jobs_done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_workers_trade ON workers(trade);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  worker_id INTEGER NOT NULL,
  home_id TEXT NOT NULL,
  by_name TEXT NOT NULL DEFAULT 'Guest',
  rating INTEGER NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_worker ON reviews(worker_id);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  home_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS accounts (
  email TEXT PRIMARY KEY,
  home_id TEXT NOT NULL,
  passcode_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  home_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);