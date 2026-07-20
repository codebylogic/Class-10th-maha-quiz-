// 🌟 वर्जन बदलकर v4 कर दिया ताकि नया ऑफलाइन पाथ एक्टिवेट हो सके
const CACHE_NAME = 'bseb-quiz-v4'; 
const ASSETS_TO_CACHE = [
  '/Class-10th-maha-quiz-/index.html',
  '/Class-10th-maha-quiz-/manifest.json',
  '/Class-10th-maha-quiz-/offline.html', // 👈 पक्का करें कि यह पाथ बिल्कुल ऐसा ही है
  '/Class-10th-maha-quiz-/icon-192.png',
  '/Class-10th-maha-quiz-/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      // 🌟 force-fetch करके स्टोर करना ताकि फाइल मिस न हो
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🌟 ऑफलाइन होने पर फ़ाइल दिखाने का सबसे सटीक और मजबूत तरीका
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // अगर छात्र इंटरनेट बंद में पेज रिफ्रेश या नेविगेट करता है
        if (event.request.mode === 'navigate') {
          return caches.match('/Class-10th-maha-quiz-/offline.html');
        }
      });
    })
  );
});
