const CACHE_NAME = 'anki-webapp-cache-v1';
const urlsToCache = [
  '/', // La página principal
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/style.css',
  '/media.json',
  '/audio/', // Asegúrate de que todos los archivos de audio estén en la carpeta /audio
  // Aquí puedes agregar otros archivos o rutas que desees almacenar en cache
];

// Instalar el service worker y agregar archivos al cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cacheados para offline');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar el service worker y eliminar caches viejos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Eliminando caché obsoleto: ', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch para servir los archivos del cache cuando no haya conexión
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Servir desde cache si se encuentra
      }
      return fetch(event.request); // Si no está en el cache, traerlo de internet
    })
  );
});
