const CACHE_NAME = 'baac-pos-v2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // เปิดหรือรีเฟรชหน้า POS
  // รองรับ URL ที่มี query เช่น ?utm_source=chatgpt.com
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put('./index.html', copy);
            });
          }

          return response;
        })
        .catch(async () => {
          return (
            (await caches.match('./index.html', {
              ignoreSearch: true
            })) ||
            (await caches.match('./', {
              ignoreSearch: true
            }))
          );
        })
    );

    return;
  }

  // ไฟล์ของ GitHub Pages
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request, {
        ignoreSearch: true
      }).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
            });
          }

          return response;
        });
      })
    );
  }
});
