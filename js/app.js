(function () {
  const isConfigured = SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
  const db = isConfigured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  if (!isConfigured) {
    document.getElementById("setup-warning").style.display = "block";
  }

  const today = new Date();
  const plan = getPlanForDate(today);
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
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <img class="exercise-icon" src="${ex.image}" alt="${ex.name} diagram" />
      <div class="exercise-body">
        <h3>${ex.name}</h3>
        <div class="exercise-target">Target: ${ex.target}</div>
        <div class="exercise-inputs">
          <div class="field">
            <label for="f1-${i}">${ex.field1}</label>
            <input id="f1-${i}" type="text" inputmode="decimal" />
          </div>
          <div class="field">
            <label for="f2-${i}">${ex.field2}</label>
            <input id="f2-${i}" type="text" />
          </div>
        </div>
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
      const v1 = document.getElementById(`f1-${i}`).value.trim();
      const v2 = document.getElementById(`f2-${i}`).value.trim();
      if (!v1 && !v2) return; // skip untouched rows
      rows.push({
        entry_date: entryDate,
        day_name: plan.day,
        session_name: plan.session,
        exercise_name: ex.name,
        field1_label: ex.field1,
        value1: v1,
        field2_label: ex.field2,
        value2: v2,
      });
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
