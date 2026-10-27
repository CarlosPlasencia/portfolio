import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadSource } from './helpers/source.mjs';

test('draft article paths are opt-in for development and absent from public discovery', () => {
  const { BLOG_DRAFT, getBlogDraftPaths } = loadSource('lib/blog-preview.ts');
  assert.equal(getBlogDraftPaths().length, 0);
  assert.equal(getBlogDraftPaths(false).length, 0);
  assert.equal(getBlogDraftPaths(true)[0].params.slug, BLOG_DRAFT.slug);
  assert.equal(BLOG_DRAFT.path, `/blog/vista-previa/${BLOG_DRAFT.slug}/`);
  const seo = loadSource('lib/seo.ts');
  assert.equal(seo.getStaticPages().length, 32);
  assert.doesNotMatch(seo.buildSitemap() + seo.buildLlms(true), /vista-previa/);
});

test('blog shows a clearly marked draft link only when explicitly supplied', () => {
  const { BLOG_DRAFT } = loadSource('lib/blog-preview.ts');
  const { default: BlogPage } = loadSource('components/workspace/BlogPage.tsx');
  const publicHtml = renderToStaticMarkup(createElement(BlogPage, { es: true }));
  assert.doesNotMatch(publicHtml, /vista-previa|Borrador/);
  assert.match(publicHtml, /href="\/blog\/corregir-bug-con-ia\/"/);
  for (const es of [true, false]) {
    const preview = renderToStaticMarkup(createElement(BlogPage, { es, draft: BLOG_DRAFT }));
    assert.ok(preview.includes(BLOG_DRAFT.title));
    assert.ok(preview.includes(`href="${BLOG_DRAFT.path}"`));
    assert.match(preview, es ? /Borrador · Solo en local/ : /Spanish draft · Local only/);
  }
});

test('workspace preserves the article slot and a single main heading', () => {
  const { default: Workspace } = loadSource('components/workspace/WorkspacePreview.tsx');
  const html = renderToStaticMarkup(createElement(Workspace, {
    initialEntry: 'blog', initialLanguage: 'es', routed: true,
  }, createElement('article', null,
    createElement('h1', { id: 'ws-main-title' }, 'Article preview'),
    createElement('p', null, 'Original draft content'),
  )));
  assert.match(html, /Original draft content/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1);
  assert.doesNotMatch(html, /No hay artículos publicados todavía/);
});

test('saved article includes runnable failing and corrected versions of the same example', async () => {
  const markdown = await readFile(new URL('../src/content/blog/corregir-bug-con-ia.md', import.meta.url), 'utf8');
  assert.match(markdown, /draft: false/);
  assert.match(markdown, /No es un incidente de producción/);
  assert.doesNotMatch(markdown, /## Instagram|Publicación 1\/4/);
  const { BLOG_DRAFT } = loadSource('lib/blog-preview.ts');
  assert.ok(markdown.includes(`title: "${BLOG_DRAFT.title}"`));
  const example = /```js\n([^]*?)\n```/.exec(markdown)?.[1];
  assert.ok(example);
  const scratch = await mkdtemp(join(tmpdir(), 'caledudev-article-test-'));
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  try {
    const file = join(scratch, 'discount.test.mjs');
    await writeFile(file, example);
    const broken = spawnSync(process.execPath, ['--test', file], { encoding: 'utf8', env });
    assert.equal(broken.status, 1, broken.stdout + broken.stderr);
    const fixed = example.replace('price * (1 - discountPercent) / 100', 'price * (1 - discountPercent / 100)');
    assert.notEqual(fixed, example);
    await writeFile(file, fixed);
    const corrected = spawnSync(process.execPath, ['--test', file], { encoding: 'utf8', env });
    assert.equal(corrected.status, 0, corrected.stdout + corrected.stderr);
    assert.match(corrected.stdout, /pass 4/);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
