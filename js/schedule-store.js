const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAY_LABELS = {
  sunday: "Sunday", monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday",
};

// Loads the live weekly schedule from Supabase. Falls back to the built-in
// default (js/plan.js) if not configured yet, or if it hasn't been saved
// there before.
async function loadWeeklySchedule(db) {
  if (!db) return getDefaultWeeklySchedule();

  const { data, error } = await db
    .from("app_settings")
    .select("value")
    .eq("key", "weekly_schedule")
    .maybeSingle();

  if (error) {
    console.error("Failed to load weekly schedule, using defaults:", error.message);
    return getDefaultWeeklySchedule();
  }
  return data ? data.value : getDefaultWeeklySchedule();
}

async function saveWeeklySchedule(db, schedule) {
  return db.from("app_settings").upsert({
    key: "weekly_schedule",
    value: schedule,
    updated_at: new Date().toISOString(),
  });
}
