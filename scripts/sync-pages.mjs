import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
// Only remove the previous generated bundle files, never arbitrary assets.
const previous = await readFile('index.html', 'utf8');
const owned = [...previous.matchAll(/(?:src|href)="\/assets\/([^"/]+\.(?:js|css))"/g)].map(match => match[1]);
await cp('dist/assets', 'assets', { recursive: true });
await cp('dist/index.html', 'index.html');
const current = new Set(await readdir('dist/assets'));
for (const name of owned) if (!current.has(name)) await rm(`assets/${name}`, { force: true });
console.log('GitHub Pages root updated from dist.');
