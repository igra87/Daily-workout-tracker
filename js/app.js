(async function () {
  if (!isConfigured) {
    document.getElementById("setup-warning").style.display = "block";
  } else if (!(await requireAuth())) {
    return; // requireAuth() is already redirecting to the login page
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  const today = new Date();
  const dayKey = DAY_KEYS[today.getDay()];
  const schedule = await loadWeeklySchedule(db);
  const dayPlan = schedule[dayKey];
  const plan = { day: DAY_LABELS[dayKey], ...dayPlan };
  const dateStr = today.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  document.getElementById("day-title").textContent = `${plan.day} — ${plan.session}`;
  document.getElementById("session-meta").textContent =
    [dateStr, plan.location, plan.duration].filter(Boolean).join(" · ");
  document.getElementById("session-note").textContent = plan.note || "";

  const listEl = document.getElementById("exercise-list");
  const saveBar = document.getElementById("save-bar");

  if (plan.isRest) {
    listEl.innerHTML = `
      <div class="rest-card">
        <img class="exercise-icon" src="images/rest.svg" alt="Rest day" />
        <p>Rest day — no session planned today.</p>
      </div>`;
    return; // nothing to log, save bar stays hidden
  }

  plan.exercises.forEach((ex, i) => {
    const fields = getExerciseFields(ex);
    const inputsHtml = fields.map((label, fi) => `
      <div class="field">
        <label for="f${fi + 1}-${i}">${escapeHtml(label)}</label>
        <input id="f${fi + 1}-${i}" type="text" ${fi === 0 ? 'inputmode="decimal"' : ""} />
      </div>`).join("");

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <img class="exercise-icon" src="${escapeHtml(ex.image)}" alt="${escapeHtml(ex.name)} diagram" />
      <div class="exercise-body">
        <h3>${escapeHtml(ex.name)}</h3>
        <div class="exercise-target">Target: ${escapeHtml(ex.target)}</div>
        <div class="exercise-inputs">${inputsHtml}</div>
      </div>`;
    listEl.appendChild(card);
  });

  saveBar.style.display = "block";

  document.getElementById("save-btn").addEventListener("click", async () => {
    const statusEl = document.getElementById("status-msg");

    if (!isConfigured) {
      statusEl.textContent = "Can't save yet — finish the Supabase setup in the README first.";
      statusEl.className = "status-msg error";
      return;
    }

    const entryDate = today.toISOString().slice(0, 10);
    const rows = [];

    plan.exercises.forEach((ex, i) => {
      const fields = getExerciseFields(ex);
      const values = fields.map((_, fi) => document.getElementById(`f${fi + 1}-${i}`).value.trim());
      if (!values.some(Boolean)) return; // skip untouched rows

      const row = {
        entry_date: entryDate,
        day_name: plan.day,
        session_name: plan.session,
        exercise_name: ex.name,
      };
      fields.forEach((label, fi) => {
        row[`field${fi + 1}_label`] = label;
        row[`value${fi + 1}`] = values[fi];
      });
      rows.push(row);
    });

    if (rows.length === 0) {
      statusEl.textContent = "Nothing entered yet — fill in at least one exercise.";
      statusEl.className = "status-msg error";
      return;
    }

    const saveBtn = document.getElementById("save-btn");
    saveBtn.disabled = true;
    statusEl.textContent = "Saving…";
    statusEl.className = "status-msg";

    const { error } = await db.from("workout_logs").insert(rows);

    saveBtn.disabled = false;
    if (error) {
      statusEl.textContent = `Couldn't save: ${error.message}`;
      statusEl.className = "status-msg error";
    } else {
      statusEl.textContent = `Saved ${rows.length} ${rows.length === 1 ? "entry" : "entries"}!`;
      statusEl.className = "status-msg success";
    }
  });
})();
