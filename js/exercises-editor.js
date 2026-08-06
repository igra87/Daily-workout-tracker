(function () {
  const ICON_CHOICES = [
    { value: "images/generic-exercise.svg", label: "Generic (default)" },
    { value: "images/warmup-cooldown.svg", label: "Walking" },
    { value: "images/yoga.svg", label: "Yoga / stretch" },
    { value: "images/leg-press.svg", label: "Leg press" },
    { value: "images/seated-row.svg", label: "Seated row" },
    { value: "images/bench-press.svg", label: "Bench press" },
    { value: "images/incline-dumbbell-press.svg", label: "Incline dumbbell press" },
    { value: "images/dumbbell-fly.svg", label: "Dumbbell fly" },
    { value: "images/shoulder-press.svg", label: "Shoulder press" },
    { value: "images/plank.svg", label: "Plank" },
    { value: "images/squat.svg", label: "Squat" },
    { value: "images/pushup.svg", label: "Push-up" },
    { value: "images/mountain-climber.svg", label: "Mountain climber" },
    { value: "images/jump-lunge.svg", label: "Jump lunge" },
    { value: "images/run.svg", label: "Run / walk / bike" },
    { value: "images/leg-machine.svg", label: "Leg curl/extension machine" },
    { value: "images/lat-pulldown.svg", label: "Lat pulldown" },
    { value: "images/incline-press.svg", label: "Incline/flat press" },
    { value: "images/lateral-raise.svg", label: "Lateral raise" },
    { value: "images/bicep-curl.svg", label: "Bicep curl" },
    { value: "images/tricep-extension.svg", label: "Tricep extension" },
    { value: "images/woodchop.svg", label: "Woodchop / Pallof press" },
    { value: "images/bicycle-crunch.svg", label: "Bicycle crunch" },
    { value: "images/leg-raise.svg", label: "Leg raise" },
    { value: "images/russian-twist.svg", label: "Russian twist" },
  ];

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  const categorySelect = document.getElementById("ex-category");
  categorySelect.innerHTML = EXERCISE_CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");

  const iconSelect = document.getElementById("ex-icon");
  const iconPreview = document.getElementById("ex-icon-preview");
  iconSelect.innerHTML = ICON_CHOICES.map((i) => `<option value="${escapeHtml(i.value)}">${escapeHtml(i.label)}</option>`).join("");
  iconSelect.addEventListener("change", () => { iconPreview.src = iconSelect.value; });

  document.getElementById("add-field3-link").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("field3-row").style.display = "block";
    e.target.style.display = "none";
  });

  function renderBuiltinList() {
    const byCategory = {};
    EXERCISE_LIBRARY.forEach((item) => {
      (byCategory[item.category] = byCategory[item.category] || []).push(item.name);
    });
    const html = Object.entries(byCategory).map(([cat, names]) => `
      <p><strong>${escapeHtml(cat)}:</strong> ${names.map(escapeHtml).join(", ")}</p>
    `).join("");
    document.getElementById("builtin-list").innerHTML = html;
  }
  renderBuiltinList();

  if (!isConfigured) {
    document.getElementById("setup-warning").style.display = "block";
    document.getElementById("add-exercise-form").style.display = "none";
    document.getElementById("custom-list").innerHTML = `<div class="empty-state">No data source configured yet.</div>`;
    return;
  }

  let customExercises = [];

  function renderCustomList() {
    const listEl = document.getElementById("custom-list");
    if (customExercises.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No custom exercises added yet.</div>`;
      return;
    }
    listEl.innerHTML = customExercises.map((ex, i) => `
      <div class="exercise-card">
        <img class="exercise-icon" src="${escapeHtml(ex.image)}" alt="${escapeHtml(ex.name)} diagram" />
        <div class="exercise-body">
          <h3>${escapeHtml(ex.name)}</h3>
          <div class="exercise-target">${escapeHtml(ex.category)}${ex.defaultTarget ? " · Target: " + escapeHtml(ex.defaultTarget) : ""}</div>
          <div class="exercise-target">Fields: ${ex.fields.map(escapeHtml).join(", ")}</div>
          <button type="button" class="remove-custom-btn" data-idx="${i}">Remove</button>
        </div>
      </div>`).join("");
  }

  document.getElementById("custom-list").addEventListener("click", async (e) => {
    const btn = e.target.closest(".remove-custom-btn");
    if (!btn) return;
    const idx = parseInt(btn.getAttribute("data-idx"), 10);
    const ex = customExercises[idx];
    if (!confirm(`Remove "${ex.name}" from your custom exercises? This won't affect days that already have it added.`)) return;
    customExercises.splice(idx, 1);
    renderCustomList();
    await saveCustomExercises(db, customExercises);
  });

  document.getElementById("add-exercise-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById("status-msg");

    const name = document.getElementById("ex-name").value.trim();
    const category = categorySelect.value;
    const target = document.getElementById("ex-target").value.trim();
    const field1 = document.getElementById("ex-field1").value.trim();
    const field2 = document.getElementById("ex-field2").value.trim();
    const field3 = document.getElementById("ex-field3").value.trim();
    const image = iconSelect.value;

    if (!name || !field1 || !field2) {
      statusEl.textContent = "Fill in at least the name and the first two log fields.";
      statusEl.className = "status-msg error";
      return;
    }

    const fields = [field1, field2];
    if (field3) fields.push(field3);

    const newExercise = {
      id: `custom-${crypto.randomUUID()}`,
      name,
      category,
      image,
      fields,
      defaultTarget: target,
    };

    customExercises.push(newExercise);
    renderCustomList();

    const { error } = await saveCustomExercises(db, customExercises);
    if (error) {
      statusEl.textContent = `Couldn't save: ${error.message}`;
      statusEl.className = "status-msg error";
      return;
    }

    statusEl.textContent = `Added "${name}" — it'll now show up in the Plan and Today "add exercise" pickers.`;
    statusEl.className = "status-msg success";
    e.target.reset();
    categorySelect.selectedIndex = 0;
    iconSelect.selectedIndex = 0;
    iconPreview.src = iconSelect.value;
    document.getElementById("field3-row").style.display = "none";
    document.getElementById("add-field3-link").style.display = "inline";
  });

  (async () => {
    if (!(await requireAuth())) return;
    customExercises = await loadCustomExercises(db);
    renderCustomList();
  })();
})();
