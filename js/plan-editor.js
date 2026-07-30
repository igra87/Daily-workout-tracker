(function () {
  const isConfigured = SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
  const db = isConfigured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  const ORDERED_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const editorEl = document.getElementById("schedule-editor");
  let schedule = null;

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  const libraryOptionsHtml = (() => {
    const byCategory = {};
    EXERCISE_LIBRARY.forEach((item) => {
      (byCategory[item.category] = byCategory[item.category] || []).push(item);
    });
    return Object.entries(byCategory).map(([cat, items]) => `
      <optgroup label="${escapeHtml(cat)}">
        ${items.map((i) => `<option value="${escapeHtml(i.id)}">${escapeHtml(i.name)}</option>`).join("")}
      </optgroup>`).join("");
  })();

  function renderDayCard(dayKey) {
    const day = schedule[dayKey];
    const label = DAY_LABELS[dayKey];

    const exercisesHtml = day.exercises.map((ex, idx) => `
      <div class="plan-exercise-row">
        <img class="exercise-icon-sm" src="${escapeHtml(ex.image)}" alt="" />
        <span class="plan-exercise-name">${escapeHtml(ex.name)}</span>
        <input type="text" class="plan-target-input" data-idx="${idx}" value="${escapeHtml(ex.target)}" />
        <button type="button" class="reorder-btn" data-action="up" data-idx="${idx}" title="Move up">↑</button>
        <button type="button" class="reorder-btn" data-action="down" data-idx="${idx}" title="Move down">↓</button>
        <button type="button" class="remove-btn" data-action="remove" data-idx="${idx}" title="Remove">✕</button>
      </div>`).join("");

    const copyOptions = ORDERED_DAYS.filter((d) => d !== dayKey)
      .map((d) => `<option value="${d}">${DAY_LABELS[d]}</option>`).join("");

    return `
      <div class="plan-day-card" data-day="${dayKey}">
        <div class="plan-day-head">
          <h2>${label}</h2>
          <label class="rest-toggle">
            <input type="checkbox" class="rest-checkbox" ${day.isRest ? "checked" : ""} />
            Rest day
          </label>
        </div>

        <div class="field">
          <label>Note (optional)</label>
          <input type="text" class="note-input" value="${escapeHtml(day.note || "")}" />
        </div>

        <div class="plan-day-fields" style="display:${day.isRest ? "none" : "block"}">
          <div class="field"><label>Session name</label><input type="text" class="session-input" value="${escapeHtml(day.session)}" /></div>
          <div class="plan-field-row">
            <div class="field"><label>Location</label><input type="text" class="location-input" value="${escapeHtml(day.location)}" /></div>
            <div class="field"><label>Duration</label><input type="text" class="duration-input" value="${escapeHtml(day.duration)}" /></div>
          </div>

          <div class="plan-exercise-list">
            ${exercisesHtml || '<p class="empty-hint">No exercises yet — add one below.</p>'}
          </div>

          <div class="plan-add-row">
            <select class="add-exercise-select">${libraryOptionsHtml}</select>
            <button type="button" class="add-exercise-btn" data-action="add">Add exercise</button>
          </div>
        </div>

        <div class="plan-copy-row">
          <span class="plan-copy-label">Copy from</span>
          <select class="copy-from-select">
            <option value="">choose a day…</option>
            ${copyOptions}
          </select>
          <button type="button" class="copy-from-btn" data-action="copy">Copy</button>
        </div>
      </div>`;
  }

  function render() {
    editorEl.innerHTML = ORDERED_DAYS.map(renderDayCard).join("");
  }

  editorEl.addEventListener("input", (e) => {
    const card = e.target.closest(".plan-day-card");
    if (!card) return;
    const day = schedule[card.getAttribute("data-day")];

    if (e.target.classList.contains("session-input")) day.session = e.target.value;
    else if (e.target.classList.contains("location-input")) day.location = e.target.value;
    else if (e.target.classList.contains("duration-input")) day.duration = e.target.value;
    else if (e.target.classList.contains("note-input")) day.note = e.target.value;
    else if (e.target.classList.contains("plan-target-input")) {
      const idx = parseInt(e.target.getAttribute("data-idx"), 10);
      day.exercises[idx].target = e.target.value;
    }
  });

  editorEl.addEventListener("change", (e) => {
    if (!e.target.classList.contains("rest-checkbox")) return;
    const card = e.target.closest(".plan-day-card");
    schedule[card.getAttribute("data-day")].isRest = e.target.checked;
    render();
  });

  editorEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const card = btn.closest(".plan-day-card");
    const dayKey = card.getAttribute("data-day");
    const day = schedule[dayKey];
    const action = btn.getAttribute("data-action");

    if (action === "add") {
      const id = card.querySelector(".add-exercise-select").value;
      const item = EXERCISE_LIBRARY.find((x) => x.id === id);
      if (item) {
        day.exercises.push({ name: item.name, target: item.defaultTarget, image: item.image, field1: item.field1, field2: item.field2 });
        render();
      }
    } else if (action === "remove") {
      day.exercises.splice(parseInt(btn.getAttribute("data-idx"), 10), 1);
      render();
    } else if (action === "up") {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (idx > 0) {
        [day.exercises[idx - 1], day.exercises[idx]] = [day.exercises[idx], day.exercises[idx - 1]];
        render();
      }
    } else if (action === "down") {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (idx < day.exercises.length - 1) {
        [day.exercises[idx + 1], day.exercises[idx]] = [day.exercises[idx], day.exercises[idx + 1]];
        render();
      }
    } else if (action === "copy") {
      const sourceKey = card.querySelector(".copy-from-select").value;
      if (!sourceKey) return;
      if (!confirm(`Replace ${DAY_LABELS[dayKey]}'s plan with a copy of ${DAY_LABELS[sourceKey]}'s? This won't be saved until you tap "Save schedule".`)) return;
      schedule[dayKey] = JSON.parse(JSON.stringify(schedule[sourceKey]));
      render();
    }
  });

  document.getElementById("reset-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (!confirm("This replaces your current unsaved changes in the editor with the original default plan. Continue?")) return;
    schedule = getDefaultWeeklySchedule();
    render();
    const statusEl = document.getElementById("status-msg");
    statusEl.textContent = "Defaults loaded into the editor — tap Save schedule to apply.";
    statusEl.className = "status-msg";
  });

  document.getElementById("save-btn").addEventListener("click", async () => {
    const statusEl = document.getElementById("status-msg");
    const saveBtn = document.getElementById("save-btn");
    saveBtn.disabled = true;
    statusEl.textContent = "Saving…";
    statusEl.className = "status-msg";

    const { error } = await saveWeeklySchedule(db, schedule);

    saveBtn.disabled = false;
    if (error) {
      statusEl.textContent = `Couldn't save: ${error.message}`;
      statusEl.className = "status-msg error";
    } else {
      statusEl.textContent = "Schedule saved! The Today page will use this from now on.";
      statusEl.className = "status-msg success";
    }
  });

  (async () => {
    schedule = isConfigured ? await loadWeeklySchedule(db) : getDefaultWeeklySchedule();
    render();
    if (isConfigured) {
      document.getElementById("save-bar").style.display = "block";
    } else {
      document.getElementById("setup-warning").style.display = "block";
    }
  })();
})();
