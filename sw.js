// >>>>> IMPORTANT: গিটহাবে পুশ করার আগে এই ভার্সনটি পরিবর্তন করবেন <<<<<
const CURRENT_VERSION = 'v4'; 
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const CACHE_NAME = `prayer-app-${CURRENT_VERSION}`;
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './script.js',
  './style.css',
  './adhan.umd.min.js',
  './noto-sans-bengali.woff2',
  './icon-192x192.png',
  './icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  // নতুন ভার্সন আসলে সাথে সাথেই ইন্সটল হয়ে যাবে, ওয়েট করবে না
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // পুরনো সব ক্যাশ ডিলিট করে শুধু নতুন ভার্সনের ক্যাশ রাখবে
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
    }).then(() => self.clients.claim()) // নতুন সার্ভিস ওয়ার্কার সাথে সাথে কন্ট্রোল নিয়ে নেবে
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