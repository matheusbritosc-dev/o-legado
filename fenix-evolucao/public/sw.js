const CACHE_NAME = 'legado-pwa-cache-v1';
const OFFLINE_URL = '/sos'; // Página de fallback se a internet cair e não estiver no cache (SOS sempre abre)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pré-cacheia a página inicial, SOS furtivo e dashboard
      return cache.addAll([
        '/',
        '/sos',
        '/furtivo',
        '/icon.svg',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignora chamadas de API do backend e do webhook Stripe, apenas cacheia o Frontend
  if (event.request.url.includes('/api/v1/') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Se a internet cair, retorna o modo SOS ou a página inicial
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
