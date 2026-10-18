// 更新したら VERSION の数字を上げると、スマホ側にも新しい版が届く
const VERSION = "neko-pomo-v3";
const CORE = ["./", "index.html", "manifest.json", "img/sunny_night.webp", "img/sunny_night21.webp", "img/sunny_midnight.webp", "img/icon-192.png", "img/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// まずキャッシュ、なければネット(フォントや追加画像も一度読めば次からオフラインでOK)
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
