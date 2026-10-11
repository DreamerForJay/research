const CACHE_NAME = "research-profile-v5";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=20261011-9",
  "./main.js?v=20261011-3",
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/Chieh-Lun-Yang-Resume.pdf",
  "./assets/portrait.jpg",
  "./assets/research/gemo3d-preview.jpg",
  "./assets/research/dfds-architecture.png",
  "./assets/logos/104.jpg",
  "./assets/logos/csie-association.webp",
  "./assets/logos/foxconn.jpg",
  "./assets/logos/gdg.png",
  "./assets/logos/glows-ai.jpg",
  "./assets/logos/google-classroom.svg",
  "./assets/logos/google-g.png",
  "./assets/logos/itri.svg",
  "./assets/logos/ncue-it-club.png",
  "./assets/logos/ncue.jpg",
  "./assets/logos/nstc.png",
  "./assets/logos/nvidia.svg",
  "./assets/logos/tmytek.jpg",
  "./assets/logos/tpv.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
