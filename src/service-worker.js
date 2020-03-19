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
    evt.respondWith(
      caches.open(STATIC_CACHE_NAME)
        .then((cache) => cache.match(evt.request)
          .then((response) => response || fetch(evt.request)
        )
      )
    );
  } else {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME)
        .then((cache) => fetch(evt.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => cache.match(evt.request))
      ));
  }
});
