const CACHE_NAME = 'baac-pos-v6';

const APP_FILES = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // หน้า POS ใช้เวอร์ชันล่าสุดจากอินเทอร์เน็ตก่อน
  // หาก Offline จึงย้อนกลับไปใช้ Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, copy));

          return response;
        })
        .catch(() =>
          caches.match(event.request)
            .then(cached => cached || caches.match('./index.html'))
        )
    );

    return;
  }

  // ไฟล์อื่นใช้ Cache ก่อน
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            if (response && response.status === 200) {
              const copy = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, copy));
            }

            return response;
          });
      })
  );
});
