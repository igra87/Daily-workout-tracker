// Builds the default (factory) weekly schedule from the exercise library.
// This is used as a fallback when Supabase isn't configured yet, as the
// starting point the first time the Plan editor loads, and as the target
// for "Reset to default" in that editor.

function pick(id, targetOverride) {
  const item = EXERCISE_LIBRARY.find((e) => e.id === id);
  if (!item) throw new Error(`Unknown exercise id: ${id}`);
  return {
    name: item.name,
    target: targetOverride || item.defaultTarget,
    image: item.image,
    fields: item.fields.slice(),
  };
}

function mondaySession() {
  return {
    session: "Gym — Chest & Arms",
    location: "Gym (office)",
    duration: "30 min",
    note: "No shower needed after — keep effort moderate.",
    exercises: [
      pick("warmup-walk"),
      pick("bench-press", "3 x 12"),
      pick("incline-dumbbell-press", "3 x 10"),
      pick("dumbbell-fly", "3 x 12"),
      pick("bicep-curl", "3 x 12"),
      pick("tricep-extension", "3 x 12"),
      pick("cooldown-walk"),
    ],
  };
}

function wednesdaySession() {
  return {
    session: "Gym — Back, Shoulders & Legs",
    location: "Gym (office)",
    duration: "35–40 min",
    note: "No shower needed after.",
    exercises: [
      pick("warmup-walk"),
      pick("seated-row", "3 x 12"),
      pick("lat-pulldown", "3 x 12"),
      pick("shoulder-press", "3 x 10"),
      pick("lateral-raise", "3 x 12"),
      pick("leg-press", "3 x 12"),
      pick("leg-curl", "3 x 12"),
      pick("cooldown-walk"),
    ],
  };
}

function tabataSession() {
  const tabataTarget = "20s work / 10s rest x 8 rounds, x2 through";
  return {
    session: "Home — Core & Fat-Loss Tabata",
    location: "Home (WFH)",
    duration: "40–45 min",
    note: "Shower after.",
    exercises: [
      pick("warmup-walk"),
      pick("mountain-climber", tabataTarget),
      pick("bicycle-crunch", tabataTarget),
      pick("russian-twist", tabataTarget),
      pick("jump-lunge", tabataTarget),
      pick("cooldown-stretch"),
    ],
  };
}

function runSession() {
  return {
    session: "Home — Run",
    location: "Home (WFH)",
    duration: "45–60 min",
    note: "Shower after.",
    exercises: [
      pick("warmup-walk"),
      pick("run", "25–30 min"),
      pick("cooldown-stretch"),
    ],
  };
}

function saturdaySession() {
  return {
    session: "Home/Outdoor — Cardio + Core",
    location: "Home/outdoor",
    duration: "40–60 min",
    exercises: [
      pick("run", "30–40 min"),
      pick("bicycle-crunch"),
      pick("leg-raise"),
      pick("plank", "part of 10–15 min core circuit"),
      pick("russian-twist"),
    ],
  };
}

function sundaySession() {
  return {
    session: "Flexible — Active Recovery",
    location: "Flexible",
    duration: "30–45 min",
    exercises: [
      pick("yoga", "30–45 min — pick what your body needs"),
    ],
  };
}

function restDay() {
  return {
    session: "Rest day",
    location: "",
    duration: "",
    note: "Childcare day — no session planned. Enjoy the rest!",
    exercises: [],
  };
}

function getDefaultWeeklySchedule() {
  return {
    monday: { isRest: false, ...mondaySession() },
    tuesday: { isRest: false, ...runSession() },
    wednesday: { isRest: false, ...wednesdaySession() },
    thursday: { isRest: false, ...tabataSession() },
    friday: { isRest: true, ...restDay() },
    saturday: { isRest: false, ...saturdaySession() },
    sunday: { isRest: false, ...sundaySession() },
  };
}
