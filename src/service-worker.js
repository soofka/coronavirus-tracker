const STATIC_CACHE_NAME = 'static-cache-%VERSION%';
const DATA_CACHE_NAME = 'data-cache-%VERSION%';

const DEFAULT_ASSETS = '%DEFAULT_ASSETS%';
const STATIC_ASSETS = '%STATIC_ASSETS%';

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Installing');
  evt.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(DEFAULT_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Pre-caching completed');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activating');
  evt.waitUntil(
    caches.keys()
      .then((keyList) =>
        Promise.all(keyList.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }))
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming');
        self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetching', evt.request.url);

  let resourceInStaticCache = false;
  for (let file of [...DEFAULT_ASSETS, ...STATIC_ASSETS]) {
    if (new RegExp(`${file}$`).test(evt.request.url)) {
      resourceInStaticCache = true;
      break;
    }
  }

  if (resourceInStaticCache) {
    evt.respondWith(fromCacheOrInternet(STATIC_CACHE_NAME, evt.request));
  } else {
    evt.respondWith(fromCache(DATA_CACHE_NAME, evt.request));
    evt.waitUntil(update(DATA_CACHE_NAME, evt.request).then(refresh));
  }
});

const fromCache = (cacheName, request) => caches
  .open(cacheName)
  .then((cache) => cache.match(request));

const fromCacheOrInternet = (cacheName, request) => fromCache(cacheName, request)
  .then((response) => response || fetch(request));

const update = (cacheName, request) => caches.open(cacheName).then((cache) =>
  fetch(request).then((response) =>
    cache.put(request, response.clone()).then(() => response)
  ));

const refresh = (response) => self.clients.matchAll().then((clients) =>
  clients.forEach((client) =>
    client.postMessage(JSON.stringify({ type: 'refresh', url: response.url }))
  ));
