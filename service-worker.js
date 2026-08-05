// Caches the app's own files (HTML/CSS/JS/icons) so the app opens instantly
// from the home screen, even on a flaky connection. Anything cross-origin
// (the Supabase API calls, the supabase-js CDN script) is left alone and
// always goes straight to the network -- your actual data is never cached
// here, only the app shell itself.

const CACHE_NAME = "workout-tracker-v1";
const PRECACHE_URLS = [
  "index.html", "history.html", "progress.html", "plan.html", "exercises.html", "login.html",
  "css/style.css",
  "js/config.js", "js/supabase-client.js", "js/auth-guard.js", "js/exercise-library.js",
  "js/custom-exercises-store.js", "js/plan.js", "js/schedule-store.js", "js/timer.js",
  "js/app.js", "js/history.js", "js/progress.js", "js/plan-editor.js", "js/exercises-editor.js", "js/login.js",
  "manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {}) // don't fail install if e.g. offline on first visit
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
