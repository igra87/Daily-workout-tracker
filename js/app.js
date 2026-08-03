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

  const customExercises = isConfigured ? await loadCustomExercises(db) : [];
  const fullLibrary = getFullExerciseLibrary(customExercises);

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
  }

  // Today's working list of exercises: starts as a copy of the plan, and
  // can grow with ad-hoc additions that aren't part of the saved schedule.
  const todaysExercises = plan.isRest ? [] : plan.exercises.map((ex) => ({ ...ex }));

  function renderExerciseList() {
    if (plan.isRest && todaysExercises.length === 0) return; // rest-day card already shown, nothing else to render

    listEl.innerHTML = "";
    todaysExercises.forEach((ex, i) => {
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
          ${ex.isAdHoc ? `<button type="button" class="remove-custom-btn remove-oneoff-btn" data-idx="${i}">✕ Remove</button>` : ""}
        </div>`;
      listEl.appendChild(card);
    });
  }

  renderExerciseList();

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-oneoff-btn");
    if (!btn) return;
    todaysExercises.splice(parseInt(btn.getAttribute("data-idx"), 10), 1);
    renderExerciseList();
  });

  const oneoffRow = document.getElementById("oneoff-add-row");
  const oneoffSelect = document.getElementById("oneoff-select");
  oneoffSelect.innerHTML = buildExerciseOptionsHtml(fullLibrary);
  oneoffRow.style.display = "block";

  document.getElementById("oneoff-add-btn").addEventListener("click", () => {
    const item = fullLibrary.find((x) => x.id === oneoffSelect.value);
    if (!item) return;
    todaysExercises.push({
      name: item.name,
      target: item.defaultTarget,
      image: item.image,
      fields: item.fields.slice(),
      isAdHoc: true,
    });
    renderExerciseList();
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

    todaysExercises.forEach((ex, i) => {
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
