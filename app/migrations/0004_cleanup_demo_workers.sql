-- Remove demo/seed marketplace data (real data only from here on).
DELETE FROM reviews WHERE home_id = 'seed';
DELETE FROM workers WHERE owner_home IS NULL;