-- Re-applies the row-level security policies on workout_logs and
-- app_settings from scratch. Safe to run any number of times.
--
-- Use this if you're seeing "new row violates row-level security policy"
-- even though you've already run the earlier migration scripts -- it
-- usually means one of the policy-creation statements didn't actually take
-- effect (e.g. an earlier statement in that script errored out first).

alter table workout_logs enable row level security;
alter table app_settings enable row level security;

drop policy if exists "Users insert own logs" on workout_logs;
drop policy if exists "Users read own logs" on workout_logs;
create policy "Users insert own logs" on workout_logs
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users read own logs" on workout_logs
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users read own settings" on app_settings;
drop policy if exists "Users insert own settings" on app_settings;
drop policy if exists "Users update own settings" on app_settings;
create policy "Users read own settings" on app_settings
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own settings" on app_settings
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own settings" on app_settings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
