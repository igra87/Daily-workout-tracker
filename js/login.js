(function () {
  if (!isConfigured) {
    document.getElementById("setup-warning").style.display = "block";
    document.getElementById("auth-form").style.display = "none";
    return;
  }

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "index.html";

  let mode = "login"; // or "signup"
  const form = document.getElementById("auth-form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const submitBtn = document.getElementById("submit-btn");
  const toggleLink = document.getElementById("toggle-mode-link");
  const titleEl = document.getElementById("auth-title");
  const statusEl = document.getElementById("status-msg");

  function updateModeUI() {
    if (mode === "login") {
      titleEl.textContent = "Log in";
      submitBtn.textContent = "Log in";
      toggleLink.textContent = "Need an account? Sign up";
    } else {
      titleEl.textContent = "Sign up";
      submitBtn.textContent = "Sign up";
      toggleLink.textContent = "Already have an account? Log in";
    }
    statusEl.textContent = "";
    statusEl.className = "status-msg";
  }

  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    mode = mode === "login" ? "signup" : "login";
    updateModeUI();
  });

  // Already logged in? Skip straight through.
  (async () => {
    const { data: { session } } = await db.auth.getSession();
    if (session) window.location.href = redirectTo;
  })();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    submitBtn.disabled = true;
    statusEl.textContent = mode === "login" ? "Logging in…" : "Signing up…";
    statusEl.className = "status-msg";

    const { data, error } = mode === "login"
      ? await db.auth.signInWithPassword({ email, password })
      : await db.auth.signUp({ email, password });

    submitBtn.disabled = false;

    if (error) {
      statusEl.textContent = error.message;
      statusEl.className = "status-msg error";
      return;
    }

    if (!data.session) {
      mode = "login";
      updateModeUI();
      statusEl.textContent = "Account created — check your email to confirm it, then log in.";
      statusEl.className = "status-msg success";
      return;
    }

    window.location.href = redirectTo;
  });

  updateModeUI();
})();
