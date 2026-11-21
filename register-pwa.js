'use strict';

if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
  window.addEventListener('load',async () => {
    try {
      const registration = await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});
      const update = () => {
        if (navigator.onLine) void registration.update().catch(() => {});
      };
      window.addEventListener('online',update);
      document.addEventListener('visibilitychange',() => {
        if (document.visibilityState === 'visible') update();
      });
      window.setInterval(update,30 * 60 * 1000);
    } catch (error) {
      console.warn('MyLedger service worker registration failed',error);
    }
  });
}
