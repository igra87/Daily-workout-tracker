-- Step 1 of the multi-user migration. Run this BEFORE you sign up for your
-- own account (see README.md for the full ordered walkthrough).
--
-- This adds an "owner" column to both tables. It's nullable for now so your
-- existing rows aren't broken, and the old "anyone with the key" policies
-- stay in place for one more step -- schema_v3b_auth_policies.sql locks
-- everything down to per-user access once your existing data has been
-- assigned to your new account.

alter table workout_logs
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();

alter table app_settings
  add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
