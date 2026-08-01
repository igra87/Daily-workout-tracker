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
    session: "Gym — Full-body Strength A",
    location: "Gym (office)",
    duration: "30 min",
    note: "No shower needed after — keep effort moderate.",
    exercises: [
      pick("warmup-walk"),
      pick("leg-press", "3 x 12"),
      pick("seated-row", "3 x 12"),
      pick("bench-press", "3 x 12"),
      pick("shoulder-press", "3 x 10"),
      pick("plank", "3 x 30–40 sec"),
      pick("cooldown-walk"),
    ],
  };
}

function wednesdaySession() {
  return {
    session: "Gym — Full-body Strength B",
    location: "Gym (office)",
    duration: "30 min",
    note: "No shower needed after.",
    exercises: [
      pick("warmup-walk"),
      pick("leg-curl", "3 x 12"),
      pick("leg-extension", "3 x 12"),
      pick("lat-pulldown", "3 x 12"),
      pick("incline-press", "3 x 10"),
      pick("lateral-raise", "3 x 12"),
      pick("woodchop", "2 x 12/side"),
      pick("cooldown-walk"),
    ],
  };
}

function tabataSession() {
  return {
    session: "Home — Tabata Circuit",
    location: "Home (WFH)",
    duration: "45–60 min",
    note: "Shower after.",
    exercises: [
      pick("warmup-walk"),
      pick("squat"),
      pick("pushup"),
      pick("mountain-climber"),
      pick("jump-lunge"),
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
    tuesday: { isRest: false, ...tabataSession() },
    wednesday: { isRest: false, ...wednesdaySession() },
    thursday: { isRest: false, ...runSession() },
    friday: { isRest: true, ...restDay() },
    saturday: { isRest: false, ...saturdaySession() },
    sunday: { isRest: false, ...sundaySession() },
  };
}
