const CACHE = 'munsen-v5';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  // 이전 캐시 전부 삭제 후 새로 설치
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => caches.open(CACHE).then(c => c.addAll(ASSETS)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // JSON 데이터는 항상 네트워크 우선
  if (e.request.url.includes('/data/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // index.html도 네트워크 우선 (최신 버전 보장)
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
