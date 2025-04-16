self.addEventListener("install", e => {
    e.waitUntil(
      caches.open("anki-offline").then(cache =>
        cache.addAll([
          "./",
          "./index.html",
          "./style.css",
          "./app.js",
          "./anki.xml",
          "./media.json"
          // No podemos cachear dinámicamente todos los audios, pero puedes agregarlos uno a uno si quieres
        ])
      )
    );
  });
  
  self.addEventListener("fetch", e => {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  });
  