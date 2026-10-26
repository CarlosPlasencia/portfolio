import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadSource } from './helpers/source.mjs';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url));
const canonical = 'https://www.carlosplasencia.dev/';

test('home metadata uses the canonical domain and server-rendered factual schema', async () => {
  const layout = (await read('src/layouts/Layout.astro')).toString();
  const schema = loadSource('lib/seo.ts').getPageData('overview', 'es').structuredData;
  assert.equal(schema['@context'], 'https://schema.org');
  assert.deepEqual(Array.from(schema['@graph'], entry => entry['@type']), ['Person', 'WebSite', 'WebPage', 'BreadcrumbList']);
  assert.equal(schema['@graph'][0].url, canonical);
  assert.equal(schema['@graph'][1].url, canonical);
  assert.match(layout, /<script type="application\/ld\+json" set:html=/);
  assert.match(layout, /<link rel="canonical" href=\{canonical\}/);
  assert.match(layout, /<html lang=\{page.language\}/);
  assert.doesNotMatch(layout, /fonts\.googleapis|fonts\.gstatic|console\.log|rel="preload"[^>]*cv\.pdf/);
  assert.doesNotMatch(layout, /twitter:(site|creator)|9\+|SearchAction|international clients/);
  const index = (await read('src/pages/index.astro')).toString();
  assert.match(index, /import WorkspacePreview from ['"]\.\.\/components\/workspace\/WorkspacePreview['"]/);
  assert.match(index, /<WorkspacePreview initialLanguage="es" routed=\{true\} client:load\s*\/>/);
  assert.match(index, /styles\/workspace\.css/);
  assert.doesNotMatch(index, /<App\b|noindex/);
  assert.match(layout, /<body class="workspace-page antialiased">/);
  assert.match(layout, /name="theme-color" content="#090d14"/);
  assert.doesNotMatch(index, /CTO @Skillramp/);
});

test('approved portrait, bilingual CVs and Financialia cases are unchanged copies', async () => {
  const pairs = [
    ['public/images/carlos-plasencia.png', 'a0c3e405e49b18ffdd3b7389e7cffb1d565828265b9d3d6008db8514bfd2152f'],
    ['public/cv.pdf', 'fdf5b342cae08f2887ef8c8377a7835f610b64ce76de94eb7de2253882325c30'],
    ['public/cv/carlos-plasencia-es.pdf', 'fdf5b342cae08f2887ef8c8377a7835f610b64ce76de94eb7de2253882325c30'],
    ['public/cv/carlos-plasencia-en.pdf', '7c997049ab9cab2a8215bc20ddca9859604d70ab3a346b78251fe1db8ab1edf3'],
    ['public/cases/financialia-es.pdf', 'ca66deb2fea47025d6382a31fde4de92be9c06af550abdcf3045e597511853ef'],
    ['public/cases/financialia-en.pdf', '4530a2a18e5315dd9f5c98c06224b377165a82bcc2126045750b14ef61de810b'],
  ];
  for (const [destination, approved] of pairs) {
    const bytes = await read(destination);
    // Pin approved file bytes without requiring private source artifacts.
    const hash = (value) => createHash('sha256').update(value).digest('hex');
    assert.equal(hash(bytes), approved, destination);
    if (destination.endsWith('.pdf')) assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
  }
});

test('crawler files list localized canonical pages and allow rendering resources', async () => {
  const seo = loadSource('lib/seo.ts');
  const sitemap = seo.buildSitemap();
  const robots = (await read('public/robots.txt')).toString();
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), Array.from(seo.getStaticPages(), page => page.canonical));
  assert.match(robots, /Sitemap: https:\/\/www\.carlosplasencia\.dev\/sitemap\.xml/);
  assert.doesNotMatch(robots, /Disallow: \/_astro/);
});
