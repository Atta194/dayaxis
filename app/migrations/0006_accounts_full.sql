-- DayAxis: full accounts - roles, phone, admin. Additive only.
ALTER TABLE accounts ADD COLUMN role TEXT NOT NULL DEFAULT 'user';      -- 'user' | 'admin'
ALTER TABLE accounts ADD COLUMN phone TEXT NOT NULL DEFAULT '';
ALTER TABLE accounts ADD COLUMN phone_verified INTEGER NOT NULL DEFAULT 0;

-- The family-owner account becomes the admin (founder rule).
UPDATE accounts SET role='admin'
WHERE home_id IN (SELECT home_id FROM members WHERE is_owner = 1);