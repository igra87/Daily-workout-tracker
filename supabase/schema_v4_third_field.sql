-- Run this once in your Supabase project's SQL Editor.
--
-- Weighted exercises (leg press, bench press, etc.) now log three things
-- (Amount, Reps, Sets) instead of two, so workout_logs needs a third
-- label/value column pair. It's nullable -- exercises that only use two
-- fields simply leave it empty.

alter table workout_logs
  add column if not exists field3_label text,
  add column if not exists value3 text;
