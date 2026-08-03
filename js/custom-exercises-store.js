// Custom exercises you've added yourself, on top of the built-in
// EXERCISE_LIBRARY (js/exercise-library.js). Stored in the same app_settings
// table your weekly schedule uses, just under a different key -- so no
// extra database setup is needed for this feature.

const EXERCISE_CATEGORIES = ["Gym strength", "Core", "Home cardio", "Warm-up / Cool-down", "Flexible", "Other"];

async function loadCustomExercises(db) {
  if (!db) return [];
  const { data, error } = await db
    .from("app_settings")
    .select("value")
    .eq("key", "custom_exercises")
    .maybeSingle();

  if (error) {
    console.error("Failed to load custom exercises:", error.message);
    return [];
  }
  return data ? data.value : [];
}

async function saveCustomExercises(db, list) {
  return db.from("app_settings").upsert({
    key: "custom_exercises",
    value: list,
    updated_at: new Date().toISOString(),
  });
}

function getFullExerciseLibrary(customExercises) {
  return [...EXERCISE_LIBRARY, ...(customExercises || [])];
}

// Builds <optgroup>-grouped <option> markup for a library array, for use in
// "add exercise" pickers. Escapes untrusted text (custom exercise names are
// user-entered).
function buildExerciseOptionsHtml(library) {
  const escapeHtml = (str) => String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

  const byCategory = {};
  library.forEach((item) => {
    (byCategory[item.category] = byCategory[item.category] || []).push(item);
  });

  return Object.entries(byCategory).map(([cat, items]) => `
    <optgroup label="${escapeHtml(cat)}">
      ${items.map((i) => `<option value="${escapeHtml(i.id)}">${escapeHtml(i.name)}</option>`).join("")}
    </optgroup>`).join("");
}
