const { copyFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const output = join(__dirname, '.hosting-build');
mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'app.js', 'styles.css', 'firebase.js',
  'manifest.webmanifest', 'service-worker.js', 'register-pwa.js', 'icon-192.png', 'icon-512.png']) {
  copyFileSync(join(__dirname, file), join(output, file));
}
