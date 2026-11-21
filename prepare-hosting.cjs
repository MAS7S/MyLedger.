const { createHash } = require('node:crypto');
const { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const output = join(__dirname, '.hosting-build');
mkdirSync(output, { recursive: true });
const digest = contents => createHash('sha256').update(contents).digest('hex').slice(0, 12);
const assets = ['app.js', 'styles.css', 'firebase.js', 'register-pwa.js'];
const staticAssets = ['manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const revisions = [];
let index = readFileSync(join(__dirname, 'index.html'), 'utf8');

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

for (const file of readdirSync(output)) {
  if (/^(app|firebase|register-pwa|styles)\.[a-f0-9]{12}\.(js|css)$/.test(file)) unlinkSync(join(output,file));
}
const files = [];
for (const file of [...assets, ...staticAssets]) {
  let contents = readFileSync(join(__dirname,file));
  if (file === 'firebase.js') {
    contents = contents.toString('utf8').replace('"__MYLEDGER_REVOCATION_URL__"',JSON.stringify(workerOrigin));
  }
  const revision = digest(contents);
  const name = assets.includes(file) ? file.replace('.', '.' + revision + '.') : file;
  writeFileSync(join(output,name),contents);
  // Keep stable URLs usable for pages loaded before this release.
  if (name !== file) writeFileSync(join(output,file),contents);
  files.push(name);
  revisions.push(revision);
  index = index.replace(`"${file}"`, `"${name}"`);
}
writeFileSync(join(output,'index.html'),index);
const workerSource = readFileSync(join(__dirname,'service-worker.js'),'utf8');
const revision = digest(JSON.stringify([index,...revisions,workerSource]));
const worker = workerSource.replace(
  /\/\* hosting-build \*\/ \{[\s\S]*?\n\}/, JSON.stringify({revision,assets:files})
);
writeFileSync(join(output,'service-worker.js'),worker);
