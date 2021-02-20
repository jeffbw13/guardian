const cacheName = "jw-guardian";
const dynamicCacheName = "jw-guardian-dynamic";

const appShellFiles = [
  "/",
  "/index.html",
  "/.env/api_key",
  "/css/style.css",
  "/js/app.js",
  "/images/guardicon-192.png",
  "/images/guardicon-512.png",
  "/images/menu.svg",
  "/manifest.json",
];

limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", (installEvent) => {
  console.log("[Service Worker] Install");
  installEvent.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(appShellFiles))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((matchResp) => {
      console.log("[Service Worker] Fetching resource: " + e.request.url);
      return (
        matchResp ||
        fetch(e.request).then((response) => {
          return caches.open(dynamicCacheName).then((cache) => {
            console.log(
              "[Service Worker] Caching new resource: " + e.request.url
            );
            cache.put(e.request, response.clone());
            limitCacheSize(dynamicCacheName, 50);
            return response;
          });
        })
      );
    })
  );
});

// force register
