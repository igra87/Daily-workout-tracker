# Daily Workout Tracker

A simple website that shows you today's workout (based on your weekly plan),
lets you log the weight/reps you actually used, and keeps a history you can
review or export.

It's built as a set of plain files (no build step, no server) and hosted for
free on **GitHub Pages**. Your logged entries are saved in a free online
database called **Supabase**, since GitHub Pages on its own can only serve
files — it can't save anything you type into it.

There are two one-time setup steps before the app can save your data:
**(1) create a free Supabase project**, and **(2) turn on GitHub Pages**.
Both take a few minutes and only need to be done once.

---

## Step 1 — Create a free Supabase project

1. Go to **https://supabase.com** and click **Start your project**. Sign up
   (easiest: "Continue with GitHub" using your GitHub account).
2. Click **New project**. Give it any name, e.g. `workout-tracker`, choose
   any password (you won't need to remember it — Supabase asks for one but
   this app never uses it) and any region close to you. Click **Create new
   project**. It takes a minute or two to spin up.
3. Once it's ready, look at the left sidebar and click the **SQL Editor**
   icon (looks like `>_`).
4. Click **New query**. Open the file **`supabase/schema.sql`** from this
   repository, copy its full contents, and paste them into the query box.
5. Click **Run** (or press Ctrl/Cmd+Enter). This creates the table that will
   store your logged workouts, and sets rules so the app can only add and
   read entries — never delete or overwrite anything.
6. Now click the **Settings** (gear icon) in the left sidebar, then **API**.
   You'll see two values you need:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **anon public** key — a long string of letters/numbers
   Keep this browser tab open, you'll copy these into the app next.

## Step 2 — Add your Supabase details to the app

1. In this GitHub repository, open the file **`js/config.js`**.
2. Click the pencil (✏️) icon in the top right to edit it directly on
   GitHub — no need to install anything.
3. Replace `YOUR_SUPABASE_URL` with your **Project URL**, and
   `YOUR_SUPABASE_ANON_KEY` with your **anon public** key, keeping the
   quote marks. It should look like:
   ```js
   const SUPABASE_URL = "https://xxxxxxxxxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   ```
4. Scroll down and click **Commit changes...** then **Commit changes** again
   to save it directly to the `main` branch.

> **Is it safe for this key to be public in the code?** Yes — this "anon"
> key is designed to be used in public, browser-based apps like this one.
> The SQL script from Step 1 already locked it down so it can only insert
> and read rows in this one table — it can't delete data, read other
> projects, or do anything administrative.

## Step 3 — Turn on GitHub Pages

1. In this repository on GitHub, click **Settings** (top menu).
2. In the left sidebar, click **Pages**.
3. Under "Build and deployment" → **Source**, choose **Deploy from a
   branch**.
4. Under **Branch**, choose **main** and folder **/ (root)**, then click
   **Save**.
5. Wait about a minute, then refresh the page — GitHub will show you your
   site's link, something like:
   `https://igra87.github.io/daily-workout-tracker/`
6. Open that link on your phone or laptop and bookmark it. That's your app.

---

## Using the app

- Open the link any day — it automatically shows that day's session based
  on the weekly plan, with a simple diagram and target sets/reps for each
  exercise.
- Type the weight/reps (or time/distance, for cardio and core moves) you
  actually did into the boxes next to each exercise. You only need to fill
  in the ones you want to log — blank ones are skipped.
- Tap **Save today's entries** once you're done. You can come back and save
  again later the same day if you add more.
- Tap **History** at the top to see everything you've logged, most recent
  first, or tap **Download CSV** to get a spreadsheet file of everything
  (openable in Excel, Google Sheets, Numbers, etc.).

### About Tuesday/Thursday

Your plan alternates each week between a Tabata circuit and a run, and
Thursday mirrors whichever one you didn't do Tuesday. The app picks this
automatically (alternating by calendar week), so it won't always match
exactly what you end up doing — if you do something different, just note
it in the "Notes" box for that entry, or use the Notes field freely.

## Costs

Both GitHub Pages and Supabase's free tier are enough for this app
(Supabase's free tier covers far more storage and traffic than one
person's workout log will ever use). No credit card is required for either.

## Making changes later

- **Change the exercise plan or targets:** edit `js/plan.js` in this repo
  (via the pencil/edit icon on GitHub, same as `config.js` above).
- **Change how it looks:** edit `css/style.css`.
- **Change/add a diagram:** replace or add an SVG file in `images/` and
  point to it from `js/plan.js`.

Any change committed to the `main` branch updates the live site
automatically within a minute or two.
