import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadSource } from './helpers/source.mjs';

const seo = loadSource('lib/seo.ts');
const pages = seo.getStaticPages();
const read = path => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pathFile = path => `${path.replace(/^\//, '')}index.html`;
for (const page of pages) {
  const html = read(pathFile(page.path));
  assert.match(html, new RegExp(`<html[^>]*lang="${page.language}"`), page.path);
  assert.ok(html.includes(`<title>${escape(page.title)}</title>`), page.path);
  assert.ok(html.includes(`name="description" content="${escape(page.description)}"`), page.path);
  assert.ok(html.includes(`rel="canonical" href="${page.canonical}"`), page.path);
  assert.doesNotMatch(html, /name="robots" content="noindex/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, page.path);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, page.path);
  for (const [lang, url] of Object.entries(page.alternates)) {
    assert.ok(html.includes(`hreflang="${lang === 'default' ? 'x-default' : lang}" href="${url}"`), page.path);
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.ok(schema['@graph'].some(item => item.url === page.canonical), page.path);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    const url = new URL(match[1], seo.SITE_ORIGIN);
    const file = url.pathname.endsWith('/') ? pathFile(url.pathname) : url.pathname.slice(1);
    assert.ok(existsSync(new URL(`../dist/${file}`, import.meta.url)), `${page.path} links to missing ${file}`);
  }
  if (page.entryId === 'services') {
    for (const faq of seo.getFaqs(page.language)) {
      assert.ok(html.includes(escape(faq.question)), page.path);
      assert.ok(html.includes(escape(faq.answer)), page.path);
    }
  }
}
assert.equal(read('sitemap.xml'), seo.buildSitemap());
assert.equal(read('llms.txt'), seo.buildLlms());
assert.equal(read('llms-full.txt'), seo.buildLlms(true));
assert.match(read('workspace/index.html'), /content="noindex,nofollow"/);
assert.doesNotMatch(read('sitemap.xml'), /workspace|localhost|lastmod/);
console.log(`Verified ${pages.length} static localized pages, metadata, schema, internal links, FAQs and crawler/context files.`);
