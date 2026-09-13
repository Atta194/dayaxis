/* DayAxis service worker: app-shell + static asset caching, offline navigation. */
const CACHE = "dayaxis-v1";
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/brand/logo.svg",
  "/brand/favicon.svg",
  "/brand/diorama.svg",
  "/brand/og-card.svg",
  "/brand/icon-192.png",
  "/brand/icon-512.png",
  "/brand/icon-180.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // cross-origin: network only (fonts, OCR CDN)

  // Navigations: network first, fall back to the cached app shell.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("/", copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match("/")),
    );
    return;
  }

  // Same-origin assets: cache first, update cache in the background.
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) {
        fetch(req)
          .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); })
          .catch(() => {});
        return hit;
      }
      return fetch(req).then((res) => {
        if (res.ok && (url.pathname.startsWith("/brand/") || url.pathname.startsWith("/assets/"))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      });
    }),
  );
});