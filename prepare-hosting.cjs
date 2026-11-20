const { createHash } = require('node:crypto');
const { copyFileSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const output = join(__dirname, '.hosting-build');
mkdirSync(output, { recursive: true });
const assets = ['app.js', 'styles.css', 'firebase.js', 'register-pwa.js'];
let index = readFileSync(join(__dirname, 'index.html'), 'utf8');

for (const file of [...assets, 'manifest.webmanifest', 'service-worker.js', 'icon-192.png', 'icon-512.png']) {
  copyFileSync(join(__dirname, file), join(output, file));
}
const workerSetting = process.env.MYLEDGER_REVOCATION_URL?.trim();
let workerOrigin = '';
if (workerSetting) {
  const url = new URL(workerSetting);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash
      || url.username || url.password || !url.hostname.endsWith('.workers.dev')) {
    throw new Error('MYLEDGER_REVOCATION_URL must be an HTTPS workers.dev origin');
  }
  workerOrigin = url.origin;
}
const firebasePath = join(output, 'firebase.js');
const firebaseScript = readFileSync(firebasePath, 'utf8');
writeFileSync(firebasePath, firebaseScript.replace('"__MYLEDGER_REVOCATION_URL__"', JSON.stringify(workerOrigin)));

for (const file of assets) {
  const revision = createHash('sha256').update(readFileSync(join(output, file))).digest('hex').slice(0, 12);
  index = index.replace(`"${file}"`, `"${file}?v=${revision}"`);
}
writeFileSync(join(output, 'index.html'), index);

