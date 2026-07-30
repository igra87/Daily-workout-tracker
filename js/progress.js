(async function () {
  const chartArea = document.getElementById("chart-area");
  const select = document.getElementById("exercise-select");

  if (!isConfigured) {
    document.getElementById("setup-warning").style.display = "block";
    chartArea.innerHTML = `<div class="empty-state">No data source configured yet.</div>`;
    select.disabled = true;
    return;
  }
  if (!(await requireAuth())) return;

  let allRows = [];

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function parseNumeric(str) {
    const m = String(str ?? "").match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  function niceTicks(min, max, count) {
    if (min === max) { min -= 1; max += 1; }
    const range = max - min;
    const rawStep = range / count;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / mag;
    let step;
    if (norm < 1.5) step = 1 * mag;
    else if (norm < 3) step = 2 * mag;
    else if (norm < 7) step = 5 * mag;
    else step = 10 * mag;
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = niceMin; v <= niceMax + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
    return ticks;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function layoutChart(points) {
    const W = 640, H = 280;
    const padL = 46, padR = 20, padT = 20, padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const xs = points.map((p) => p.t);
    const ys = points.map((p) => p.value);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const ticks = niceTicks(yMin, yMax, 4);
    const tickMin = ticks[0], tickMax = ticks[ticks.length - 1];

    const xPos = (t) => xMin === xMax ? padL + plotW / 2 : padL + ((t - xMin) / (xMax - xMin)) * plotW;
    const yPos = (v) => padT + plotH - ((v - tickMin) / (tickMax - tickMin)) * plotH;

    const coords = points.map((p) => ({ ...p, x: xPos(p.t), y: yPos(p.value) }));
    return { W, H, padL, padR, padT, padB, plotW, plotH, ticks, yPos, coords };
  }

  function renderChart(layout, unitLabel) {
    const { W, H, padL, padR, padT, padB, plotW, plotH, ticks, yPos, coords } = layout;

    const gridLines = ticks.map((tick) => {
      const y = yPos(tick);
      return `<line class="chart-grid" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" />
              <text class="chart-axis-text" x="${padL - 8}" y="${y + 4}" text-anchor="end">${tick}</text>`;
    }).join("");

    // Show a handful of x-axis date labels: first, last, and evenly spaced ones between.
    const labelCount = Math.min(5, coords.length);
    const labelIdxs = new Set();
    for (let i = 0; i < labelCount; i++) {
      labelIdxs.add(Math.round((i / (labelCount - 1 || 1)) * (coords.length - 1)));
    }
    const xLabels = [...labelIdxs].map((i) => {
      const c = coords[i];
      return `<text class="chart-axis-text" x="${c.x}" y="${H - padB + 18}" text-anchor="middle">${formatDate(c.date)}</text>`;
    }).join("");

    const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
    const markers = coords.map((c) => `<circle class="chart-marker" cx="${c.x}" cy="${c.y}" r="4" />`).join("");

    const hitAreas = coords.map((c, i) => `<rect class="chart-hit-area" data-i="${i}" x="${c.x - (plotW / coords.length) / 2}" y="${padT}" width="${Math.max(24, plotW / coords.length)}" height="${plotH}" />`).join("");

    return `
      <div class="chart-wrap">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Chart of ${unitLabel || "value"} over time">
          ${gridLines}
          ${xLabels}
          <path class="chart-line" d="${linePath}" />
          ${markers}
          <line class="chart-crosshair" id="crosshair" x1="0" y1="${padT}" x2="0" y2="${H - padB}" />
          ${hitAreas}
        </svg>
        <div class="chart-tooltip" id="tooltip"><span class="tt-date"></span><br/><span class="tt-value"></span></div>
      </div>`;
  }

  function attachHover(container, coords, unitLabel) {
    const crosshair = container.querySelector("#crosshair");
    const tooltip = container.querySelector("#tooltip");
    const ttDate = tooltip.querySelector(".tt-date");
    const ttValue = tooltip.querySelector(".tt-value");
    const svg = container.querySelector("svg");

    container.querySelectorAll(".chart-hit-area").forEach((rect) => {
      const i = parseInt(rect.getAttribute("data-i"), 10);
      const c = coords[i];

      function show() {
        crosshair.setAttribute("x1", c.x);
        crosshair.setAttribute("x2", c.x);
        crosshair.style.opacity = "1";

        const svgRect = svg.getBoundingClientRect();
        const scale = svgRect.width / svg.viewBox.baseVal.width;
        tooltip.style.left = `${c.x * scale}px`;
        tooltip.style.top = `${c.y * scale - 8}px`;
        tooltip.style.opacity = "1";
        ttDate.textContent = new Date(c.date + "T12:00:00").toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
        ttValue.textContent = `${c.value}${unitLabel ? " " + unitLabel : ""}`;
      }
      function hide() {
        crosshair.style.opacity = "0";
        tooltip.style.opacity = "0";
      }

      rect.addEventListener("pointerenter", show);
      rect.addEventListener("pointermove", show);
      rect.addEventListener("pointerleave", hide);
      rect.addEventListener("focus", show);
      rect.addEventListener("blur", hide);
    });
  }

  function renderTable(rows) {
    const trs = rows.map((r) => `
      <tr>
        <td>${escapeHtml(r.entry_date)}</td>
        <td>${escapeHtml(r.field1_label)}: ${escapeHtml(r.value1) || "—"}</td>
        <td>${escapeHtml(r.field2_label)}: ${escapeHtml(r.value2) || "—"}</td>
      </tr>`).join("");
    return `
      <details class="data-table-toggle">
        <summary>Show data table</summary>
        <div class="table-scroll">
          <table class="history-table">
            <thead><tr><th>Date</th><th>Detail 1</th><th>Detail 2</th></tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>
      </details>`;
  }

  function renderExercise(name) {
    const rows = allRows
      .filter((r) => r.exercise_name === name)
      .sort((a, b) => a.entry_date.localeCompare(b.entry_date) || a.created_at.localeCompare(b.created_at));

    if (rows.length === 0) {
      chartArea.innerHTML = `<div class="empty-state">No entries yet for this exercise.</div>`;
      return;
    }

    const unitLabel = rows[rows.length - 1].field1_label || "";
    const points = rows
      .map((r) => ({ date: r.entry_date, t: new Date(r.entry_date + "T12:00:00").getTime(), value: parseNumeric(r.value1) }))
      .filter((p) => p.value !== null);

    let chartHtml;
    let layout = null;
    if (points.length >= 2) {
      layout = layoutChart(points);
      chartHtml = renderChart(layout, unitLabel);
    } else {
      chartHtml = `<div class="empty-state">Not enough numeric data yet to graph — log a couple more sessions of this exercise.</div>`;
    }

    chartArea.innerHTML = `
      <div class="chart-card">
        <h2>${escapeHtml(name)}</h2>
        <div class="chart-sub">${escapeHtml(unitLabel)} over time · ${rows.length} logged ${rows.length === 1 ? "entry" : "entries"}</div>
        ${chartHtml}
        ${renderTable(rows)}
      </div>`;

    if (layout) {
      attachHover(chartArea, layout.coords, unitLabel);
    }
  }

  (async () => {
    chartArea.innerHTML = `<div class="empty-state">Loading…</div>`;
    const { data, error } = await db.from("workout_logs").select("*").order("entry_date", { ascending: true });

    if (error) {
      chartArea.innerHTML = `<div class="empty-state">Couldn't load data: ${escapeHtml(error.message)}</div>`;
      return;
    }

    allRows = data || [];
    if (allRows.length === 0) {
      chartArea.innerHTML = `<div class="empty-state">No entries logged yet. Go log today's workout!</div>`;
      select.disabled = true;
      return;
    }

    const names = [...new Set(allRows.map((r) => r.exercise_name))].sort();
    select.innerHTML = names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");

    select.addEventListener("change", () => renderExercise(select.value));
    renderExercise(names[0]);
  })();
})();
