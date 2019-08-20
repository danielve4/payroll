const CACHE_NAME = 'payroll-cache-v1';
const urlsToCache = [
  '/',
  '/screen.css',
  '/site.js'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activated');
  event.waitUntil(
    // Get all the cache keys (cacheName)
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(thisCacheName => {
        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== CACHE_NAME) {
          // Delete that cached file
          console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  ); // end event.waitUntil
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});