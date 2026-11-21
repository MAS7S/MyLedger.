'use strict';

const {revision,assets} = /* hosting-build */ {
  revision:'local',
  assets:['app.js','firebase.js','register-pwa.js','styles.css','manifest.webmanifest','icon-192.png','icon-512.png']
};
const PREFIX = 'myledger-shell-';
const CACHE = PREFIX + "v1";
const cacheName = revision === 'local' ? CACHE : `${CACHE}-${revision}`;
const scope = new URL(self.registration.scope);
const shellUrl = new URL('index.html',scope);
const shell = shellUrl.href;
const coreAssets = new Set(assets.map(file => new URL(file,scope).href));

self.addEventListener('install',event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll([shell,...coreAssets].map(url => new Request(url,{cache:'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    // An in-flight page from the previous release may still request its fingerprinted files.
    const previous = names.filter(name => name.startsWith(PREFIX) && name !== cacheName);
    await Promise.all(previous.slice(0,-1).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function cached(fallback) {
  if (fallback === shell) return (await caches.open(cacheName)).match(shell);
  const names = await caches.keys();
  for (const name of names.filter(name => name.startsWith(PREFIX)).reverse()) {
    const response = await (await caches.open(name)).match(fallback);
    if (response) return response;
  }
}

async function networkFirst(request,fallback) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(),4000);
  try {
    const response = await fetch(request,{signal:controller.signal,cache:'no-store'});
    if (response.ok) return response;
    return await cached(fallback) || response;
  } catch {
    return await cached(fallback) || Response.error();
  } finally {
    clearTimeout(timer);
  }
}

self.addEventListener('fetch',event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin) return;
  if (request.mode === 'navigate' && (url.pathname === scope.pathname || url.pathname === shellUrl.pathname)) {
    event.respondWith(networkFirst(request,shell));
  } else if (coreAssets.has(request.url)
      || (url.pathname.startsWith(scope.pathname) && /^[\w-]+\.[a-f0-9]{12}\.(js|css)$/.test(url.pathname.slice(scope.pathname.length)))) {
    event.respondWith(networkFirst(request,request.url));
  }
});
