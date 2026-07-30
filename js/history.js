(function () {
  const isConfigured = SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
  const contentEl = document.getElementById("history-content");
  const countEl = document.getElementById("entry-count");
  const csvBtn = document.getElementById("csv-btn");
  csvBtn.disabled = true;

  if (!isConfigured) {
    document.getElementById("setup-warning").style.display = "block";
    contentEl.innerHTML = `<div class="empty-state">No data source configured yet.</div>`;
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let rows = [];

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function render() {
    if (rows.length === 0) {
      contentEl.innerHTML = `<div class="empty-state">No entries logged yet. Go log today's workout!</div>`;
      countEl.textContent = "";
      return;
    }

    countEl.textContent = `${rows.length} ${rows.length === 1 ? "entry" : "entries"}`;

    const tableRows = rows.map((r) => `
      <tr>
        <td>${escapeHtml(r.entry_date)}</td>
        <td>${escapeHtml(r.day_name)}</td>
        <td>${escapeHtml(r.session_name)}</td>
        <td>${escapeHtml(r.exercise_name)}</td>
        <td>${escapeHtml(r.field1_label)}: ${escapeHtml(r.value1) || "—"}</td>
        <td>${escapeHtml(r.field2_label)}: ${escapeHtml(r.value2) || "—"}</td>
      </tr>`).join("");

    contentEl.innerHTML = `
      <div class="table-scroll">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th><th>Day</th><th>Session</th><th>Exercise</th><th>Detail 1</th><th>Detail 2</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>`;
  }

  function toCsv() {
    const headers = ["entry_date", "day_name", "session_name", "exercise_name", "field1_label", "value1", "field2_label", "value2", "created_at"];
    const escapeCsv = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(",")];
    rows.forEach((r) => lines.push(headers.map((h) => escapeCsv(r[h])).join(",")));
    return lines.join("\n");
  }

  csvBtn.addEventListener("click", () => {
    const blob = new Blob([toCsv()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workout-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  (async () => {
    contentEl.innerHTML = `<div class="empty-state">Loading…</div>`;
    const { data, error } = await db
      .from("workout_logs")
      .select("*")
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      contentEl.innerHTML = `<div class="empty-state">Couldn't load history: ${escapeHtml(error.message)}</div>`;
      return;
    }

    rows = data || [];
    csvBtn.disabled = rows.length === 0;
    render();
  })();
})();
