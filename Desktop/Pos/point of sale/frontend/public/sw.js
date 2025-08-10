const CACHE_NAME = 'pos-system-v1';
const STATIC_CACHE = 'pos-static-v1';
const DYNAMIC_CACHE = 'pos-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/login',
  '/add-product',
  '/products',
  '/billing-cart',
  '/invoices',
  '/finance',
  '/order-memo',
  '/sales-history',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static file requests
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            // Cache dynamic content
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
        .catch(() => {
          // Return offline page when fetch fails
          if (request.destination === 'document') {
            return caches.match('/');
          }
        })
    );
  }
});

// Handle API requests with offline support
async function handleApiRequest(request) {
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    
    // If successful, cache the response
    if (response.status === 200) {
      const responseClone = response.clone();
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    // If network fails, try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Network error', 
        offline: true,
        message: 'You are offline. Data will sync when connection is restored.'
      }), 
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get all clients
    const clients = await self.clients.matchAll();
    
    // Notify clients that sync is happening
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_STARTED',
        message: 'Syncing offline data...'
      });
    });

    // Get offline data from IndexedDB
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // Sync each offline record
      for (const record of offlineData) {
        try {
          await syncRecord(record);
          await removeOfflineRecord(record.id);
        } catch (error) {
          console.error('Failed to sync record:', error);
        }
      }
    }

    // Notify clients that sync is complete
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        message: 'Offline data synced successfully'
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
    
    // Notify clients of sync failure
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_ERROR',
        message: 'Failed to sync offline data'
      });
    });
  }
}

// Get offline data from IndexedDB
async function getOfflineData() {
  // This would typically use IndexedDB
  // For now, return empty array
  return [];
}

// Sync a single record
async function syncRecord(record) {
  const response = await fetch(record.url, {
    method: record.method,
    headers: record.headers,
    body: record.body
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }
  
  return response;
}

// Remove synced record from offline storage
async function removeOfflineRecord(id) {
  // This would typically remove from IndexedDB
  console.log('Removing synced record:', id);
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from POS System',
    icon: '/next.svg',
    badge: '/next.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/next.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/next.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('POS System', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle message events from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
