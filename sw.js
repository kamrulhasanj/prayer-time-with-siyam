// >>>>> IMPORTANT: গিটহাবে পুশ করার আগে এই ভার্সনটি পরিবর্তন করবেন <<<<<
const CURRENT_VERSION = 'v7'; 
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const CACHE_NAME = `prayer-app-${CURRENT_VERSION}`;
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './script.js',
  './style.css',
  './adhan.umd.min.js',
  './icon-192x192.png',
  './icon-512x512.png',
  './lib/tailwind.min.js',
  './lib/html2pdf.bundle.min.js',
  './lib/font-awesome/css/all.min.css',
  './lib/font-awesome/webfonts/fa-solid-900.woff2',
  './lib/font-awesome/webfonts/fa-solid-900.ttf',
  './lib/font-awesome/webfonts/fa-regular-400.woff2',
  './lib/font-awesome/webfonts/fa-regular-400.ttf',
  './lib/font-awesome/webfonts/fa-brands-400.woff2',
  './lib/font-awesome/webfonts/fa-brands-400.ttf',
  './fonts/noto-sans-bengali.woff2',
  './fonts/hind-siliguri/hind-siliguri-300.woff2',
  './fonts/hind-siliguri/hind-siliguri-400.woff2',
  './fonts/hind-siliguri/hind-siliguri-500.woff2',
  './fonts/hind-siliguri/hind-siliguri-600.woff2',
  './fonts/hind-siliguri/hind-siliguri-700.woff2',
  './fonts/hind-siliguri/hind-siliguri-latin-300.woff2',
  './fonts/hind-siliguri/hind-siliguri-latin-400.woff2',
  './fonts/hind-siliguri/hind-siliguri-latin-500.woff2',
  './fonts/hind-siliguri/hind-siliguri-latin-600.woff2',
  './fonts/hind-siliguri/hind-siliguri-latin-700.woff2',
  './images/night-day-bn-ramadan.jpg',
  './images/ramadan-rahmat-vs-lanat-meaning.png',
  './images/mahe-ramadan-siyam-sadhona.png',
  './images/twilight.webp',
  './images/fasting-till-night-3.jpg',
  './images/fasting-till-night-4.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }
        return fetch(event.request);
      })
  );
});
