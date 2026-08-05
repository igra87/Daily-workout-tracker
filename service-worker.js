// Caches the app's own files (HTML/CSS/JS/icons) purely as an offline
// fallback, so the app can still open if you're briefly offline. Anything
// cross-origin (Supabase API calls, the supabase-js CDN script) is left
// alone and always goes straight to the network -- your actual data is
// never cached here, only the app shell itself.
//
// Network-first: whenever you're online, you always get the current code
// straight from the server (important since this app is still actively
// being updated) -- the cache is only ever used as a fallback if a fetch
// fails outright.

const CACHE_NAME = "workout-tracker-v2";
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
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        // { cache: "reload" } bypasses the browser's own HTTP cache, so this
        // always pulls genuinely fresh files rather than a stale local copy.
        PRECACHE_URLS.map((url) =>
          fetch(url, { cache: "reload" })
            .then((res) => { if (res.ok) return cache.put(url, res); })
            .catch(() => {})
        )
      )
    )
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
    fetch(req)
      .then((res) => {
        if (res.ok) caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
