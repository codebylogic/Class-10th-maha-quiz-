const CACHE_NAME = 'bseb-quiz-v1';
const ASSETS_TO_CACHE = [
  '/Class-10th-maha-quiz-/index.html',
  '/Class-10th-maha-quiz-/manifest.json',
  '/Class-10th-maha-quiz-/offline.html',
  '/Class-10th-maha-quiz-/icon-192.png',
  '/Class-10th-maha-quiz-/icon-512.png'
];



// इंस्टॉल होने पर फाइलों को कैश में सेव करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// पुराने कैश को डिलीट करना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// नेटवर्क न होने पर कैश से फाइलें दिखाना
self.addEventListener('fetch', (event) => {
  event.respondWith(
    chats.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // अगर इंटरनेट नहीं है और कोई पेज नहीं मिल रहा, तो ऑफलाइन पेज दिखाएं
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
      });
    })
  );
});
