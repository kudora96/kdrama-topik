var CACHE_NAME = 'kdrama-topik-v8';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './shared/style.css',
  './shared/app.js',
  './data/cloy/episodes.json',
  './data/dramas.json',
  './S001/index.html',
  './data/S001/subtitles.json',
  './data/S001/analysis.json',
  './data/S001/explanations.json',
  './data/S001/quiz.json',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sora:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;900&family=Space+Mono:wght@400;700&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).then(function(response) {
        if (response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(function() {
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});
