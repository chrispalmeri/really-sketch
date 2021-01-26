// worker.js

const CACHE_NAME = '0.3.5';
const FILES_TO_CACHE = [
  '/app/',
  '/app/index.html',
  '/css/app.css',
  '/js/bundle.min.js',
  '/app.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
    .then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      return cache.match(event.request, {ignoreVary: true})
      .then(function (response) {
        var fetchPromise = fetch(event.request)
        .then(function (networkResponse) {
          if (response && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(function(error) {
          return new Response(null, {
            'status': 503,
            'statusText': 'Service Unavailable'
          });
        });
        return response || fetchPromise;
      });
    })
  );
});