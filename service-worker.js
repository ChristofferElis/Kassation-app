/* service-worker.js — cacher app-skallen, så appen kan åbnes og bruges helt
   uden netforbindelse. Henter altid nyeste version først, når der er net,
   så nye ændringer fra GitHub dukker op uden manuel oprydning.
   Eksempelbillederne (mappen ref/) hentes kun én gang pr. cache-version og gemmes lokalt. */

const CACHE = 'kassation-v4';
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
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' })))));
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
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // Eksempelbilleder: cache først (spar data), hent kun hvis de ikke er gemt endnu.
  // Udskifter du et billede på GitHub, så hæv CACHE-navnet ovenfor (fx kassation-v5), så tabletterne henter det nye.
  if (url.pathname.includes('/ref/')) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      }))
    );
    return;
  }

  // Resten: net først (nyeste version), cache som reserve når tabletten er offline.
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }) // spring browserens 10-min. HTTP-cache over (GitHub Pages)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
