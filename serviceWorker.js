const cacheName = "jw-guardian";
const appShellFiles = [
  '/',
  '/index.html',
  '/.env/api_key',
  '/css/style.css',
  '/js/app.js',
  '/images/guardicon-192.png',
  '/images/guardicon-512.png'
]

self.addEventListener('install', installEvent => {
  console.log('[Service Worker] Install');
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(appShellFiles))
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});