// Include after js/supabase-client.js on every page that requires a signed-in
// user. Call `await requireAuth()` first thing in that page's own script;
// it returns the session, or null (and redirects to the login page) if
// there isn't one.

function renderUserBar(user) {
  const el = document.getElementById("user-bar");
  if (!el) return;
  el.innerHTML = `<span class="user-email"></span><button type="button" id="logout-btn" class="logout-btn">Log out</button>`;
  el.querySelector(".user-email").textContent = user.email;
  el.querySelector("#logout-btn").addEventListener("click", async () => {
    await db.auth.signOut();
    window.location.href = "login.html";
  });
}

async function requireAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    window.location.href = `login.html?redirect=${redirectTo}`;
    return null;
  }
  renderUserBar(session.user);
  return session;
}
