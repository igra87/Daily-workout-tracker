// Master list of exercises available to you, given your gym's equipment and
// your original weekly plan. Used by the Plan editor to build/amend days.
// `fields` are the labels shown above the log-entry input boxes for that
// exercise (2 for most, 3 for weighted exercises: Amount/Reps/Sets).

const EXERCISE_LIBRARY = [
  { id: "warmup-walk", name: "Warm-up (bike/brisk walk)", category: "Warm-up / Cool-down", image: "images/warmup-cooldown.svg", fields: ["Duration", "Notes"], defaultTarget: "5 min" },
  { id: "cooldown-walk", name: "Cool-down walk", category: "Warm-up / Cool-down", image: "images/warmup-cooldown.svg", fields: ["Duration", "Notes"], defaultTarget: "2–3 min, easy pace" },
  { id: "cooldown-stretch", name: "Cool-down stretch", category: "Warm-up / Cool-down", image: "images/yoga.svg", fields: ["Duration", "Notes"], defaultTarget: "5 min" },

  { id: "leg-press", name: "Leg press machine", category: "Gym strength", image: "images/leg-press.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "seated-row", name: "Seated row machine", category: "Gym strength", image: "images/seated-row.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "bench-press", name: "Dumbbell bench press (flat bench)", category: "Gym strength", image: "images/bench-press.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "incline-dumbbell-press", name: "Incline dumbbell bench press", category: "Gym strength", image: "images/incline-dumbbell-press.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 10" },
  { id: "dumbbell-fly", name: "Lying dumbbell fly (flat bench)", category: "Gym strength", image: "images/dumbbell-fly.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "shoulder-press", name: "Shoulder press machine", category: "Gym strength", image: "images/shoulder-press.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 10" },
  { id: "leg-curl", name: "Leg curl machine", category: "Gym strength", image: "images/leg-machine.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "leg-extension", name: "Leg extension machine", category: "Gym strength", image: "images/leg-machine.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "lat-pulldown", name: "Lat pulldown", category: "Gym strength", image: "images/lat-pulldown.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "incline-press", name: "Fixed-weight bar incline/flat press", category: "Gym strength", image: "images/incline-press.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 10" },
  { id: "lateral-raise", name: "Dumbbell lateral raises", category: "Gym strength", image: "images/lateral-raise.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "bicep-curl", name: "Dumbbell bicep curl", category: "Gym strength", image: "images/bicep-curl.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },
  { id: "tricep-extension", name: "Overhead dumbbell tricep extension", category: "Gym strength", image: "images/tricep-extension.svg", fields: ["Amount", "Reps", "Sets"], defaultTarget: "3 x 12" },

  { id: "plank", name: "Plank", category: "Core", image: "images/plank.svg", fields: ["Time held (sec)", "Sets"], defaultTarget: "3 x 30–40 sec" },
  { id: "woodchop", name: "Cable woodchop / Pallof press", category: "Core", image: "images/woodchop.svg", fields: ["Amount", "Reps/side", "Sets"], defaultTarget: "2 x 12/side" },
  { id: "bicycle-crunch", name: "Bicycle crunches", category: "Core", image: "images/bicycle-crunch.svg", fields: ["Reps", "Sets"], defaultTarget: "part of 10–15 min core circuit" },
  { id: "leg-raise", name: "Leg raises", category: "Core", image: "images/leg-raise.svg", fields: ["Reps", "Sets"], defaultTarget: "part of 10–15 min core circuit" },
  { id: "russian-twist", name: "Russian twists", category: "Core", image: "images/russian-twist.svg", fields: ["Reps", "Sets"], defaultTarget: "part of 10–15 min core circuit" },

  { id: "squat", name: "Squats (Tabata)", category: "Home cardio", image: "images/squat.svg", fields: ["Rounds completed", "Notes"], defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "pushup", name: "Push-ups (Tabata)", category: "Home cardio", image: "images/pushup.svg", fields: ["Rounds completed", "Notes"], defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "mountain-climber", name: "Mountain climbers (Tabata)", category: "Home cardio", image: "images/mountain-climber.svg", fields: ["Rounds completed", "Notes"], defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "jump-lunge", name: "Jump lunges (Tabata)", category: "Home cardio", image: "images/jump-lunge.svg", fields: ["Rounds completed", "Notes"], defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "run", name: "Run / brisk walk / bike", category: "Home cardio", image: "images/run.svg", fields: ["Duration", "Distance"], defaultTarget: "25–30 min" },

  { id: "yoga", name: "Yoga / mobility / flexible activity", category: "Flexible", image: "images/yoga.svg", fields: ["Activity done", "Duration"], defaultTarget: "30–45 min" },
];
