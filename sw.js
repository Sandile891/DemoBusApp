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
/////////////

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  // Code for syncing data when back online
}

self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'periodic-sync-tag') {
    event.waitUntil(fetchLatestData());
  }
});

function fetchLatestData() {
  // Code to fetch new data periodically
}
self.addEventListener('push', function(event) {
  let data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'You have a new message!',
    icon: 'ic.png',
    badge: 'badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Push Notification', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://sandile891.github.io/DemoBusApp/')
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
function myFunction() {
  return "This is correct";
}
