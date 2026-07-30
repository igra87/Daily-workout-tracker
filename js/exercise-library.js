// Master list of exercises available to you, given your gym's equipment and
// your original weekly plan. Used by the Plan editor to build/amend days.
// field1/field2 are the labels shown above the two log-entry input boxes.

const EXERCISE_LIBRARY = [
  { id: "warmup-walk", name: "Warm-up (bike/brisk walk)", category: "Warm-up / Cool-down", image: "images/warmup-cooldown.svg", field1: "Duration", field2: "Notes", defaultTarget: "5 min" },
  { id: "cooldown-walk", name: "Cool-down walk", category: "Warm-up / Cool-down", image: "images/warmup-cooldown.svg", field1: "Duration", field2: "Notes", defaultTarget: "2–3 min, easy pace" },
  { id: "cooldown-stretch", name: "Cool-down stretch", category: "Warm-up / Cool-down", image: "images/yoga.svg", field1: "Duration", field2: "Notes", defaultTarget: "5 min" },

  { id: "leg-press", name: "Leg press machine", category: "Gym strength", image: "images/leg-press.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 12" },
  { id: "seated-row", name: "Seated row machine", category: "Gym strength", image: "images/seated-row.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 12" },
  { id: "bench-press", name: "Dumbbell bench press (flat bench)", category: "Gym strength", image: "images/bench-press.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 12" },
  { id: "shoulder-press", name: "Shoulder press machine", category: "Gym strength", image: "images/shoulder-press.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 10" },
  { id: "leg-curl", name: "Leg curl machine", category: "Gym strength", image: "images/leg-machine.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 12" },
  { id: "leg-extension", name: "Leg extension machine", category: "Gym strength", image: "images/leg-machine.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 12" },
  { id: "lat-pulldown", name: "Lat pulldown", category: "Gym strength", image: "images/lat-pulldown.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 12" },
  { id: "incline-press", name: "Fixed-weight bar incline/flat press", category: "Gym strength", image: "images/incline-press.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 10" },
  { id: "lateral-raise", name: "Dumbbell lateral raises", category: "Gym strength", image: "images/lateral-raise.svg", field1: "Weight (kg)", field2: "Reps", defaultTarget: "3 x 12" },

  { id: "plank", name: "Plank", category: "Core", image: "images/plank.svg", field1: "Time held (sec)", field2: "Notes", defaultTarget: "3 x 30–40 sec" },
  { id: "woodchop", name: "Cable woodchop / Pallof press", category: "Core", image: "images/woodchop.svg", field1: "Weight (kg)", field2: "Reps/side", defaultTarget: "2 x 12/side" },
  { id: "bicycle-crunch", name: "Bicycle crunches", category: "Core", image: "images/bicycle-crunch.svg", field1: "Reps", field2: "Notes", defaultTarget: "part of 10–15 min core circuit" },
  { id: "leg-raise", name: "Leg raises", category: "Core", image: "images/leg-raise.svg", field1: "Reps", field2: "Notes", defaultTarget: "part of 10–15 min core circuit" },
  { id: "russian-twist", name: "Russian twists", category: "Core", image: "images/russian-twist.svg", field1: "Reps", field2: "Notes", defaultTarget: "part of 10–15 min core circuit" },

  { id: "squat", name: "Squats (Tabata)", category: "Home cardio", image: "images/squat.svg", field1: "Rounds completed", field2: "Notes", defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "pushup", name: "Push-ups (Tabata)", category: "Home cardio", image: "images/pushup.svg", field1: "Rounds completed", field2: "Notes", defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "mountain-climber", name: "Mountain climbers (Tabata)", category: "Home cardio", image: "images/mountain-climber.svg", field1: "Rounds completed", field2: "Notes", defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "jump-lunge", name: "Jump lunges (Tabata)", category: "Home cardio", image: "images/jump-lunge.svg", field1: "Rounds completed", field2: "Notes", defaultTarget: "20s work / 10s rest x 8 rounds, x2 through" },
  { id: "run", name: "Run / brisk walk / bike", category: "Home cardio", image: "images/run.svg", field1: "Distance", field2: "Time", defaultTarget: "25–30 min" },

  { id: "yoga", name: "Yoga / mobility / flexible activity", category: "Flexible", image: "images/yoga.svg", field1: "Activity done", field2: "Duration", defaultTarget: "30–45 min" },
];
