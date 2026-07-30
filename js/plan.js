// Weekly exercise plan.
// Each exercise has: name, target (sets/reps/time), image (diagram),
// field1/field2 (labels for the two input boxes shown next to it).

function strength(name, target, image) {
  return { name, target, image, field1: "Weight (kg)", field2: "Reps" };
}
function timed(name, target, image) {
  return { name, target, image, field1: "Time held (sec)", field2: "Notes" };
}
function cardio(name, target, image, field1 = "Distance", field2 = "Time") {
  return { name, target, image, field1, field2 };
}

const WARMUP = { name: "Warm-up", target: "5 min (bike or brisk walk)", image: "images/warmup-cooldown.svg", field1: "Duration", field2: "Notes" };
const COOLDOWN_WALK = { name: "Cool-down walk", target: "2–3 min, easy pace", image: "images/warmup-cooldown.svg", field1: "Duration", field2: "Notes" };
const COOLDOWN_STRETCH = { name: "Cool-down stretch", target: "5 min", image: "images/yoga.svg", field1: "Duration", field2: "Notes" };

function mondaySession() {
  return {
    session: "Gym — Full-body Strength A",
    location: "Gym (office)",
    duration: "30 min",
    note: "No shower needed after — keep effort moderate.",
    exercises: [
      WARMUP,
      strength("Leg press machine", "3 x 12", "images/leg-press.svg"),
      strength("Seated row machine", "3 x 12", "images/seated-row.svg"),
      strength("Dumbbell bench press (flat bench)", "3 x 12", "images/bench-press.svg"),
      strength("Shoulder press machine", "3 x 10", "images/shoulder-press.svg"),
      timed("Plank", "3 x 30–40 sec", "images/plank.svg"),
      COOLDOWN_WALK,
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
      WARMUP,
      strength("Leg curl machine", "3 x 12", "images/leg-machine.svg"),
      strength("Leg extension machine", "3 x 12", "images/leg-machine.svg"),
      strength("Lat pulldown", "3 x 12", "images/lat-pulldown.svg"),
      strength("Fixed-weight bar incline or flat press", "3 x 10", "images/incline-press.svg"),
      strength("Dumbbell lateral raises", "3 x 12", "images/lateral-raise.svg"),
      { name: "Cable woodchop or Pallof press", target: "2 x 12/side", image: "images/woodchop.svg", field1: "Weight (kg)", field2: "Reps/side" },
      COOLDOWN_WALK,
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
      WARMUP,
      { name: "Squats (Tabata)", target: "20s work / 10s rest x 8 rounds, x2 through", image: "images/squat.svg", field1: "Rounds completed", field2: "Notes" },
      { name: "Push-ups (Tabata)", target: "20s work / 10s rest x 8 rounds, x2 through", image: "images/pushup.svg", field1: "Rounds completed", field2: "Notes" },
      { name: "Mountain climbers (Tabata)", target: "20s work / 10s rest x 8 rounds, x2 through", image: "images/mountain-climber.svg", field1: "Rounds completed", field2: "Notes" },
      { name: "Jump lunges (Tabata)", target: "20s work / 10s rest x 8 rounds, x2 through", image: "images/jump-lunge.svg", field1: "Rounds completed", field2: "Notes" },
      COOLDOWN_STRETCH,
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
      WARMUP,
      cardio("Run", "25–30 min", "images/run.svg"),
      COOLDOWN_STRETCH,
    ],
  };
}

function saturdaySession() {
  return {
    session: "Home/Outdoor — Cardio + Core",
    location: "Home/outdoor",
    duration: "40–60 min",
    exercises: [
      cardio("Run, brisk walk, or bike", "30–40 min", "images/run.svg"),
      { name: "Bicycle crunches", target: "part of 10–15 min core circuit", image: "images/bicycle-crunch.svg", field1: "Reps", field2: "Notes" },
      { name: "Leg raises", target: "part of 10–15 min core circuit", image: "images/leg-raise.svg", field1: "Reps", field2: "Notes" },
      { name: "Plank variations", target: "part of 10–15 min core circuit", image: "images/plank.svg", field1: "Time held (sec)", field2: "Notes" },
      { name: "Russian twists", target: "part of 10–15 min core circuit", image: "images/russian-twist.svg", field1: "Reps", field2: "Notes" },
    ],
  };
}

function sundaySession() {
  return {
    session: "Flexible — Active Recovery",
    location: "Flexible",
    duration: "30–45 min",
    exercises: [
      { name: "Longer walk/hike, yoga/mobility, or an easy second run", target: "30–45 min — pick what your body needs", image: "images/yoga.svg", field1: "Activity done", field2: "Duration" },
    ],
  };
}

// ISO week number, used to alternate Tabata/Run between weeks.
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const diff = d - firstThursday;
  return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
}

function isTabataWeek(date) {
  return getISOWeek(date) % 2 === 0;
}

// Returns the full session info for a given JS Date.
function getPlanForDate(date) {
  const dow = date.getDay(); // 0 = Sunday ... 6 = Saturday
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = dayNames[dow];
  const tabataWeek = isTabataWeek(date);

  switch (dow) {
    case 1:
      return { day, isRest: false, ...mondaySession() };
    case 2: {
      const s = tabataWeek ? tabataSession() : runSession();
      return { day, isRest: false, ...s };
    }
    case 3:
      return { day, isRest: false, ...wednesdaySession() };
    case 4: {
      // Mirrors Tuesday: whichever option wasn't done Tuesday this week.
      const s = tabataWeek ? runSession() : tabataSession();
      return { day, isRest: false, ...s };
    }
    case 5:
      return {
        day,
        isRest: true,
        session: "Rest day",
        location: "",
        duration: "",
        note: "Childcare day — no session planned. Enjoy the rest!",
        exercises: [],
      };
    case 6:
      return { day, isRest: false, ...saturdaySession() };
    case 0:
      return { day, isRest: false, ...sundaySession() };
  }
}
