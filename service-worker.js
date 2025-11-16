// service-worker.js
const CACHE_NAME = 'orbit-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Yahaan aapke main assets hain
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://unpkg.com/@phosphor-icons/web',
  'https://cdn.tailwindcss.com',
  'https://hammerjs.github.io/dist/hammer.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js',
  'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png',
  'https://i.ibb.co/K0054k7/user-placeholder.png',
  'https://i.ibb.co/m0X5qR5/orbit-icon-192.png',
  'https://i.ibb.co/C07BkTf/orbit-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// === ADDED FOR PUSH NOTIFICATIONS ===
// Yeh code notification ko receive aur display karega
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  let data = {};
  if (event.data) {
    try {
        data = event.data.json(); // Koshish karein JSON data padhne ki
    } catch (e) {
        data = { title: 'New Message', body: event.data.text() }; // Agar JSON fail ho
    }
  } else {
    data = { title: 'New Message', body: 'You have a new message from Orbit.' };
  }

  const title = data.title || 'Orbit App';
  const options = {
    body: data.body || 'New message arrived.',
    icon: 'https://i.ibb.co/m0X5qR5/orbit-icon-192.png', // Aapka app icon
    badge: 'https://i.ibb.co/m0X5qR5/orbit-icon-192.png', // Android par status bar icon
    vibrate: [200, 100, 200] // Vibrate pattern
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
