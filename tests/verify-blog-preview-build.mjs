import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSource } from './helpers/source.mjs';

const { BLOG_DRAFT } = loadSource('lib/blog-preview.ts');
const dist = new URL('../dist/', import.meta.url);
assert.equal(existsSync(new URL(`.${BLOG_DRAFT.path}index.html`, dist)), false, 'Local preview route must not be exported');

function checkPreviewExclusion(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) checkPreviewExclusion(path);
    else if (/\.(html|js)$/.test(entry.name)) {
      const text = readFileSync(path, 'utf8');
      assert.ok(!text.includes(BLOG_DRAFT.path), `Local preview link leaked into ${path}`);
      if (entry.name.endsWith('.js')) assert.ok(!text.includes('discountPercent'), `Static article body leaked into client JavaScript: ${path}`);
    }
  }
}
checkPreviewExclusion(fileURLToPath(dist));
for (const name of ['sitemap.xml', 'llms.txt', 'llms-full.txt']) {
  assert.ok(!readFileSync(new URL(name, dist), 'utf8').includes(BLOG_DRAFT.path));
}
console.log('Verified the local preview route stays excluded from production HTML, JavaScript and discovery files.');
