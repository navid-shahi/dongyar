/* Dongyar service worker — © Navid Shahi
   هر بار نسخه‌ی جدید منتشر می‌کنی، عدد VERSION رو عوض کن تا گوشی‌ها به‌روز بشن. */
const VERSION = 'dongyar-v55';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// اول شبکه (برای گرفتن آخرین نسخه)، اگه آفلاین بود از حافظه
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(r, cp)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
