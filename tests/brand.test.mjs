import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadSource } from './helpers/source.mjs';

const seo = loadSource('lib/seo.ts');
const { default: Workspace } = loadSource('components/workspace/WorkspacePreview.tsx');
const { CONTACT_CHANNELS } = loadSource('lib/i18n.ts');

test('CaleduDev is visible alongside the professional name on home and about in both languages', () => {
  for (const language of ['es', 'en']) {
    const home = renderToStaticMarkup(React.createElement(Workspace, { initialLanguage: language, routed: true }));
    assert.match(home, /class="ws-brand"[^]*?CaleduDev/);
    assert.match(home, /<h1[^>]*>Carlos[^]*?Plasencia[^]*?<\/h1><p class="ws-alias">CaleduDev<\/p>/);
    assert.equal((home.match(/<h1\b/g) ?? []).length, 1);
    const about = renderToStaticMarkup(React.createElement(Workspace, { initialEntry: 'about', initialLanguage: language, routed: true }));
    assert.match(about, /class="ws-about-copy"[^]*?Carlos Plasencia[^]*?CaleduDev/);
    assert.match(home, new RegExp(`href="/cv/carlos-plasencia-${language}\\.pdf" target="_blank"`));
  }
});

test('localized SEO associates both names without changing canonical routes or profile identity', () => {
  const pages = seo.getStaticPages();
  assert.equal(pages.length, 30);
  for (const page of pages) {
    assert.match(page.title, /Carlos Plasencia.*CaleduDev/);
    assert.equal(page.canonical, `https://www.carlosplasencia.dev${page.path}`);
    assert.equal(page.alternates[page.language], page.canonical);
    assert.ok(page.description.length <= 165);
    assert.doesNotMatch(page.path, /caledu/i);
    const person = page.structuredData['@graph'].find(entry => entry['@type'] === 'Person');
    assert.equal(person.name, 'Carlos Eduardo Plasencia Prado');
    assert.deepEqual(Array.from(person.alternateName), ['Carlos Plasencia', 'CaleduDev']);
    assert.equal(person['@id'], 'https://www.carlosplasencia.dev/#person');
    assert.deepEqual(Array.from(person.sameAs), [CONTACT_CHANNELS.github, CONTACT_CHANNELS.linkedin]);
    const website = page.structuredData['@graph'].find(entry => entry['@type'] === 'WebSite');
    assert.equal(website.name, 'Carlos Plasencia');
    assert.equal(website.alternateName, 'CaleduDev');
    if (['overview', 'about'].includes(page.entryId)) {
      assert.match(page.description, /Carlos Plasencia/);
      assert.match(page.description, /CaleduDev/);
    }
  }
  assert.equal(CONTACT_CHANNELS.github, 'https://github.com/CarlosPlasencia');
  assert.equal(CONTACT_CHANNELS.linkedin, 'https://www.linkedin.com/in/carlos-edu-plasencia-prado/');
});

test('AI-readable summaries identify CaleduDev without inventing profiles or changing project credit', () => {
  for (const full of [false, true]) {
    const document = seo.buildLlms(full);
    assert.match(document, /^# Carlos Plasencia.*CaleduDev/);
    assert.match(document, /https:\/\/github.com\/CarlosPlasencia/);
    assert.doesNotMatch(document, /github.com\/CaleduDev|caledu(?:dev)?\.(?:com|dev)/i);
    if (full) {
      assert.match(document, /Skillramp/);
      assert.match(document, /3 developers/);
      assert.match(document, /QA/);
    }
  }
});
