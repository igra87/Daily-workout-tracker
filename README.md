# Daily Workout Tracker

A simple website that shows you today's workout (based on your weekly plan),
lets you log the weight/reps you actually used, and keeps a history you can
review or export.

It's built as a set of plain files (no build step, no server) and hosted for
free on **GitHub Pages**. Your logged entries are saved in a free online
database called **Supabase**, since GitHub Pages on its own can only serve
files — it can't save anything you type into it.

The app supports multiple people sharing one link — each person signs up
with their own email/password and only ever sees their own schedule and
logs, never anyone else's.

There are four one-time setup steps: **(1) create a free Supabase
project**, **(2) turn on GitHub Pages**, **(3) turn on accounts/logins**,
and **(4) a short one-time migration** so your existing data ends up owned
by your new account. All take a few minutes and only need to be done once
— after that, sharing the link with a friend is as simple as them signing
up.

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
6. Click **New query** again, open the file **`supabase/schema_v2_schedule.sql`**
   from this repository, copy its contents, paste them in, and click **Run**.
   This creates a second table that stores your editable weekly plan (used by
   the **Plan** tab). This one *does* allow the app to update rows — that's
   needed so your schedule edits can be saved — but it's a separate table
   from your workout logs above, which stay insert/read-only.
7. Now click the **Settings** (gear icon) in the left sidebar, then **API**.
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

## Step 4 — Turn on accounts, so you and friends each get your own data

The app uses simple email + password logins (no separate email step) so
anyone with the link can sign up and get their own private schedule and
logs. This needs one Supabase setting changed, plus a short one-time
migration so your *existing* data (from before accounts existed) ends up
correctly owned by your account rather than orphaned. Follow these in
order:

1. In Supabase, go to **Authentication** in the left sidebar, then find the
   **Email** provider's settings (under **Providers**, or under
   **Sign In / Providers** depending on your dashboard version) and turn
   **off** the **"Confirm email"** option. This lets sign-ups work
   instantly, with no confirmation email needed — handy for a small group
   of friends, and it sidesteps Supabase's free-tier limits on how many
   emails it can send per hour.
2. Back in the **SQL Editor**, open **`supabase/schema_v3a_auth_columns.sql`**
   from this repo, copy it in, and click **Run**. This adds an "owner"
   column to your two tables, without breaking anything yet.
3. Make sure you've pulled/deployed the latest version of this app (the
   one with the **Log in** page). Open your app link — you'll be sent to a
   login screen.
4. Click **Sign up**, and create your own account with your email and a
   password of your choosing. You'll land on the Today page, but it'll look
   like a fresh start (default plan, empty history) — that's expected and
   temporary; your original data is still safe in the database, just not
   linked to your new account yet.
5. In Supabase, go to **Authentication → Users**. Find your email in the
   list and copy its **UID** (a long string of letters/numbers/dashes).
6. Open **`supabase/schema_v3b_auth_policies.sql`** from this repo. Replace
   every `YOUR_USER_ID_HERE` with the UID you just copied (keep the quote
   marks around it), then paste the whole thing into a new query in the
   SQL Editor and click **Run**. This links your existing logs/schedule to
   your account, and locks the database down so every user can only ever
   see and change their own rows — never anyone else's.
7. Refresh the app — your original history and schedule should now show up
   normally under your logged-in account.

From now on, sharing the app is just sharing the link: each friend opens
it, taps **Sign up**, and gets their own private schedule and history.
There's a **Log out** link in the top-right of every page.

---

## Using the app

- The first time (per device/browser), you'll be asked to log in or sign
  up with an email and password. After that you stay signed in; use
  **Log out** in the top-right of any page to switch accounts (e.g. to
  test what a friend would see).
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
- Tap **Progress** at the top, pick an exercise from the dropdown, and see a
  graph of that exercise's logged values over time (e.g. weight for Leg
  press, time held for Plank). Hover/tap a point for the exact date and
  value; tap "Show data table" for the plain numbers underneath.
- Tap **Plan** at the top to review or change your weekly schedule — see
  below.
- The timer near the top of the Today page stays visible as you scroll.
  Tap **Start**/**Stop** to time a hold (e.g. a plank) and read off the
  elapsed time to log; tap **20s** or **10s** for a Tabata-style countdown
  that flashes and beeps when it hits zero (tap the same button again to
  cancel it early, or **⟲** to reset).

### Editing your weekly plan

The **Plan** tab shows a card for each day of the week. From there you can:

- Mark a day as a **rest day** (hides its exercise list)
- Change the **session name, location, duration, or note** for a day
- **Add an exercise** to a day from the dropdown (grouped by type: gym
  strength, core, home cardio, warm-up/cool-down, flexible) — this list
  reflects your gym's equipment and the kinds of sessions from your original
  plan
- **Remove** an exercise (✕), **reorder** exercises (↑ / ↓), or edit an
  exercise's **target sets/reps**
- **Copy** one day's whole plan onto another — handy since Tuesday/Thursday
  used to auto-alternate between a Tabata circuit and a run; now that you
  can edit them directly, that automatic swap is gone, so use Copy (or edit
  by hand) whenever you want to switch which one you're doing that week
- **Reset everything to the default plan** if you want to start over (this
  only changes what's in the editor — nothing is applied until you tap
  **Save schedule**)

Nothing here affects the Today page until you tap **Save schedule**.

## Costs

GitHub Pages and Supabase's free tier (including accounts/logins) are
enough for this app — Supabase's free tier covers far more storage,
traffic, and monthly active users than a small group of friends will ever
use. No credit card is required for either.

## Making changes later

- **Change your weekly schedule:** use the **Plan** tab in the app — no code
  editing needed.
- **Add a new type of exercise to the master list:** edit
  `js/exercise-library.js` in this repo (via the pencil/edit icon on
  GitHub) to add an entry, and add a matching diagram to `images/` if you
  want one. It'll then show up in the Plan tab's "Add exercise" dropdown.
- **Change how it looks:** edit `css/style.css`.
- **Change the built-in default plan** (used for "Reset to default" and
  before you've customized anything): edit `js/plan.js`.

Any change committed to the `main` branch updates the live site
automatically within a minute or two.
