const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'CSS Bus.css',  // Ensure the path is correct 
  'JS bus.js',    // Ensure the path is correct 
  // Add any other assets like images or icons here, and ensure their paths are correct
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      // Add all URLs to the cache
      return cache.addAll(urlsToCache).catch(function(error) {
        console.error('Failed to cache resources:', error);
      });
    })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Return cached response if available, otherwise fetch from network
      return response || fetch(event.request);
    }).catch(function(error) {
      console.error('Fetch failed:', error);
      // Optionally return fallback page or asset if needed
    })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
