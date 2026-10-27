import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadSource } from './helpers/source.mjs';

const articlePath = '/blog/corregir-bug-con-ia/';
const canonical = `https://www.carlosplasencia.dev${articlePath}`;

test('production article has its own Spanish canonical and factual metadata', () => {
  const { getBlogArticlePage } = loadSource('lib/blog-seo.ts');
  const page = getBlogArticlePage();
  assert.equal(page.path, articlePath);
  assert.equal(page.canonical, canonical);
  assert.equal(page.language, 'es');
  assert.equal(page.alternates.es, canonical);
  assert.equal(page.alternates.default, canonical);
  assert.equal(page.alternates.en, undefined);
  const article = page.structuredData['@graph'].find(item => item['@type'] === 'BlogPosting');
  assert.equal(article.headline, 'Cómo corregir un bug con IA sin aceptar la respuesta a ciegas');
  assert.equal(article.url, canonical);
  assert.ok(article.author['@id'].endsWith('/#person'));
  assert.doesNotMatch(JSON.stringify(page), /datePublished|dateModified|vista-previa|Borrador/);
});

test('both blog indexes link to the final article and preserve explicit local previews', () => {
  const { default: BlogPage } = loadSource('components/workspace/BlogPage.tsx');
  for (const es of [true, false]) {
    const html = renderToStaticMarkup(createElement(BlogPage, { es }));
    assert.ok(html.includes(`href="${articlePath}"`));
    assert.match(html, /Cómo corregir un bug/);
    assert.doesNotMatch(html, /vista-previa|Borrador|No articles published yet|No hay artículos publicados/);
    if (!es) assert.match(html, /Spanish article/);
  }
  const { BLOG_DRAFT } = loadSource('lib/blog-preview.ts');
  const preview = renderToStaticMarkup(createElement(BlogPage, { es: true, draft: BLOG_DRAFT }));
  assert.ok(preview.includes(`href="${BLOG_DRAFT.path}"`));
  assert.match(preview, /Borrador · Solo en local/);
});

test('public discovery includes the article without changing the workspace page registry', () => {
  const seo = loadSource('lib/seo.ts');
  assert.equal(seo.getStaticPages().length, 32);
  assert.equal((seo.buildSitemap().match(/<loc>/g) ?? []).length, 33);
  assert.equal(seo.buildSitemap().split(`<loc>${canonical}</loc>`).length - 1, 1);
  for (const full of [false, true]) assert.ok(seo.buildLlms(full).includes(canonical));
  assert.doesNotMatch(seo.buildSitemap() + seo.buildLlms(true), /vista-previa|datePublished|lastmod/);
});

test('production article route is buildable and content is marked export-ready', () => {
  const route = readFileSync(new URL('../src/pages/blog/[slug].astro', import.meta.url), 'utf8');
  const markdown = readFileSync(new URL('../src/content/blog/corregir-bug-con-ia.md', import.meta.url), 'utf8');
  assert.match(route, /getStaticPaths/);
  assert.doesNotMatch(route, /import\.meta\.env\.DEV|noindex|Borrador/);
  assert.match(markdown, /draft: false/);
});
