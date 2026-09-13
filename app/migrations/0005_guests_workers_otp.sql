-- DayAxis: guest ownership/cap, worker photos, approval queue, OTP. Additive only.
ALTER TABLE members ADD COLUMN is_owner INTEGER NOT NULL DEFAULT 0;
UPDATE members SET is_owner = 1 WHERE id IN (SELECT MIN(id) FROM members GROUP BY home_id);

ALTER TABLE workers ADD COLUMN photo TEXT NOT NULL DEFAULT '';
ALTER TABLE workers ADD COLUMN approved INTEGER NOT NULL DEFAULT 0;      -- 0 pending | 1 approved | -1 rejected
ALTER TABLE workers ADD COLUMN phone_verified INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS otp (
  phone TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);