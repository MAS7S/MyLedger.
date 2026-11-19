'use strict';

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.mode !== 'navigate' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;

  event.respondWith(fetch(request).catch(() => new Response(
    '<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MyLedger</title><h1>MyLedger</h1><p>اتصل بالإنترنت ثم أعد فتح التطبيق.</p><p lang="en" dir="ltr">Connect to the internet and reopen MyLedger.</p></html>',
    {headers:{'Content-Type':'text/html; charset=utf-8'}}
  )));
});
