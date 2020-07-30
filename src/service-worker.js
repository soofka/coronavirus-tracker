const STATIC_CACHE_NAME = 'static-cache-%VERSION%';
const DATA_CACHE_NAME = 'data-cache-%VERSION%';

const STATIC_FILES_TO_CACHE = '%ASSETS%';

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Installing');
  evt.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(STATIC_FILES_TO_CACHE);
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
  for (let file in STATIC_FILES_TO_CACHE) {
    if (new RegExp(`${file}$`).test(evt.request.url)) {
      resourceInStaticCache = true;
      break;
    }
  }

  if (resourceInStaticCache) {
    evt.respondWith(fromCacheOrInternet(STATIC_CACHE_NAME, evt.request));
  } else {
    evt.respondWith(fromCache(DATA_CACHE_NAME, evt.request));
    evt.waitUntil(update(evt.request, DATA_CACHE_NAME).then(refresh));
  }
});

const fromCache = (cacheName, request) => caches
  .open(cacheName)
  .then((cache) => cache.match(request));

const fromCacheOrInternet = (cacheName, request) => fromCache(cacheName, request)
  .then((response) => response || fetch(request));

const update = (request, cacheName) => caches.open(cacheName).then((cache) =>
  fetch(request).then((response) =>
    cache.put(request, response.clone()).then(() => response)
  ));

const refresh = (response) => self.clients.matchAll().then((clients) => {
    clients.forEach(function (client) {
      const message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag')
      };
      
      client.postMessage(JSON.stringify(message));
    });
  });
  