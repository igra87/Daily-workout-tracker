-- Step 2 of the multi-user migration. Only run this AFTER you have:
--   1. Run schema_v3a_auth_columns.sql
--   2. Signed up for your own account in the app (see README.md)
--   3. Copied your new User UID from Supabase Dashboard -> Authentication -> Users
--
-- Before running: replace every occurrence of YOUR_USER_ID_HERE below with
-- the UID you copied (keep the surrounding quotes).

-- 1) Attach your existing rows to your new account.
update workout_logs set user_id = 'YOUR_USER_ID_HERE' where user_id is null;
update app_settings set user_id = 'YOUR_USER_ID_HERE' where user_id is null;

-- 2) Require every row to have an owner from now on.
alter table workout_logs alter column user_id set not null;
alter table app_settings alter column user_id set not null;

-- 3) app_settings needs one schedule row per person, not one for the whole
--    app -- switch its primary key from just "key" to "(user_id, key)".
alter table app_settings drop constraint app_settings_pkey;
alter table app_settings add primary key (user_id, key);

-- 4) Remove the old "anyone with the public key" rules...
drop policy if exists "Allow public insert" on workout_logs;
drop policy if exists "Allow public read" on workout_logs;
drop policy if exists "Allow public read settings" on app_settings;
drop policy if exists "Allow public insert settings" on app_settings;
drop policy if exists "Allow public update settings" on app_settings;

-- ...and replace them with rules that only allow a logged-in user to see
-- and change their OWN rows, never anyone else's.
create policy "Users insert own logs" on workout_logs
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users read own logs" on workout_logs
  for select to authenticated using (auth.uid() = user_id);

create policy "Users read own settings" on app_settings
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own settings" on app_settings
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own settings" on app_settings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
