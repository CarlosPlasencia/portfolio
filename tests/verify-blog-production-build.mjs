import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadSource } from './helpers/source.mjs';

const { BLOG_ARTICLE } = loadSource('lib/blog.ts');
const { getBlogArticlePage } = loadSource('lib/blog-seo.ts');
const page = getBlogArticlePage();
const read = path => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const file = `${BLOG_ARTICLE.path.slice(1)}index.html`;
assert.ok(existsSync(new URL(`../dist/${file}`, import.meta.url)));
const html = read(file);
assert.ok(html.includes(`<link rel="canonical" href="${page.canonical}"`));
assert.ok(html.includes('<meta property="og:type" content="article"'));
assert.ok(html.includes('name="description"'));
assert.ok(html.includes('name="twitter:card"'));
assert.match(html, /<html[^>]*lang="es"/);
assert.doesNotMatch(html, /hreflang="en"|name="robots" content="noindex|datePublished|dateModified|Borrador|vista-previa/);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert.equal((html.match(/<main\b/g) ?? []).length, 1);
assert.match(html, /applyDiscount|discountPercent/);
assert.ok(html.includes('href="/blog/"'));
const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
assert.equal(JSON.stringify(schema), JSON.stringify(page.structuredData));
for (const path of ['blog/index.html', 'en/blog/index.html']) {
  const index = read(path);
  assert.ok(index.includes(`href="${BLOG_ARTICLE.path}"`));
  assert.doesNotMatch(index, /Borrador|vista-previa|No articles published yet|No hay artículos publicados/);
}
for (const path of ['sitemap.xml', 'llms.txt', 'llms-full.txt']) assert.ok(read(path).includes(page.canonical));
console.log('Verified the production-ready Spanish article, metadata, index links and discovery without inventing dates or translations.');
