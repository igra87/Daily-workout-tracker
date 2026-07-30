(function () {
  const displayEl = document.getElementById("timer-display");
  const labelEl = document.getElementById("timer-label");
  const stopwatchBtn = document.getElementById("timer-stopwatch-btn");
  const btn20 = document.getElementById("timer-20-btn");
  const btn10 = document.getElementById("timer-10-btn");
  const resetBtn = document.getElementById("timer-reset-btn");
  const presetButtons = { 20: btn20, 10: btn10 };

  let mode = "idle"; // idle | stopwatch | countdown
  let seconds = 0;
  let intervalId = null;
  let activePreset = null;

  function formatTime(total) {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateDisplay() {
    displayEl.textContent = formatTime(seconds);
  }

  function highlightPreset(preset) {
    Object.entries(presetButtons).forEach(([key, btn]) => {
      btn.classList.toggle("timer-active", Number(key) === preset);
    });
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      osc.onended = () => ctx.close();
    } catch (e) {
      // Audio not available/blocked — ignore, the visual flash still shows.
    }
    if (navigator.vibrate) navigator.vibrate(300);
  }

  function stopInterval() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  function resetAll() {
    stopInterval();
    mode = "idle";
    seconds = 0;
    activePreset = null;
    updateDisplay();
    labelEl.textContent = "Ready";
    stopwatchBtn.textContent = "Start";
    stopwatchBtn.classList.remove("timer-active");
    highlightPreset(null);
    displayEl.classList.remove("timer-flash", "timer-running");
  }

  function startStopwatch() {
    stopInterval();
    mode = "stopwatch";
    seconds = 0;
    activePreset = null;
    highlightPreset(null);
    updateDisplay();
    labelEl.textContent = "Stopwatch running";
    stopwatchBtn.textContent = "Stop";
    stopwatchBtn.classList.add("timer-active");
    displayEl.classList.add("timer-running");
    displayEl.classList.remove("timer-flash");
    intervalId = setInterval(() => {
      seconds++;
      updateDisplay();
    }, 1000);
  }

  function stopStopwatch() {
    stopInterval();
    mode = "idle";
    labelEl.textContent = `Stopped at ${formatTime(seconds)}`;
    stopwatchBtn.textContent = "Start";
    stopwatchBtn.classList.remove("timer-active");
    displayEl.classList.remove("timer-running");
  }

  function startCountdown(from) {
    stopInterval();
    mode = "countdown";
    seconds = from;
    activePreset = from;
    highlightPreset(from);
    stopwatchBtn.textContent = "Start";
    stopwatchBtn.classList.remove("timer-active");
    updateDisplay();
    labelEl.textContent = `${from}s countdown running`;
    displayEl.classList.add("timer-running");
    displayEl.classList.remove("timer-flash");
    intervalId = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        seconds = 0;
        updateDisplay();
        stopInterval();
        mode = "idle";
        activePreset = null;
        highlightPreset(null);
        labelEl.textContent = "Time's up!";
        displayEl.classList.remove("timer-running");
        displayEl.classList.add("timer-flash");
        beep();
        return;
      }
      updateDisplay();
    }, 1000);
  }

  stopwatchBtn.addEventListener("click", () => {
    if (mode === "stopwatch") stopStopwatch();
    else startStopwatch();
  });

  function handlePreset(from) {
    if (mode === "countdown" && activePreset === from) resetAll();
    else startCountdown(from);
  }

  btn20.addEventListener("click", () => handlePreset(20));
  btn10.addEventListener("click", () => handlePreset(10));
  resetBtn.addEventListener("click", resetAll);

  updateDisplay();
})();
