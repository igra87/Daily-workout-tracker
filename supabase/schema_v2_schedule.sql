-- Run this once in your Supabase project's SQL Editor to add the Plan tab.
-- (This is in addition to schema.sql, which you should already have run.)
--
-- This table stores your editable weekly schedule. Unlike workout_logs,
-- the app needs to be able to update this table (to save your edits), so
-- its public key permissions are wider here -- worst case if misused is
-- someone rewrites your workout schedule, which you can always fix from
-- the Plan tab's "Reset to default" button. Your actual logged history in
-- workout_logs is unaffected and stays insert/read-only as before.

create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table app_settings enable row level security;

create policy "Allow public read settings" on app_settings
  for select
  to anon
  using (true);

create policy "Allow public insert settings" on app_settings
  for insert
  to anon
  with check (true);

create policy "Allow public update settings" on app_settings
  for update
  to anon
  using (true)
  with check (true);
