/* service-worker.js — cacher app-skallen ved første besøg, så appen
   kan åbnes og bruges helt uden netforbindelse bagefter. */

const CACHE = 'kassation-v1';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './config.js',
  './queue.js',
  './sync.js',
  './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
