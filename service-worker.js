/* service-worker.js — cacher app-skallen, så appen kan åbnes og bruges helt
   uden netforbindelse. Henter altid nyeste version først, når der er net,
   så nye ændringer fra GitHub dukker op uden manuel oprydning. */

const CACHE = 'kassation-v2';
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
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  // Net først (nyeste version), cache som reserve når tabletten er offline.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
