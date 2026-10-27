import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadSource } from './helpers/source.mjs';

const seo = loadSource('lib/seo.ts');
const { getWorkspaceEntries } = loadSource('lib/workspace-content.ts');
const { getSiteContent } = loadSource('lib/i18n.ts');
const { default: Workspace } = loadSource('components/workspace/WorkspacePreview.tsx');

test('blog adds reciprocal Spanish and English pages to the existing workspace', () => {
  for (const language of ['es', 'en']) {
    const path = language === 'es' ? '/blog/' : '/en/blog/';
    const page = seo.getPageData('blog', language);
    assert.equal(page.path, path);
    assert.equal(page.canonical, `https://www.carlosplasencia.dev${path}`);
    assert.equal(page.alternates.es, 'https://www.carlosplasencia.dev/blog/');
    assert.equal(page.alternates.en, 'https://www.carlosplasencia.dev/en/blog/');
    assert.match(page.title, /Blog.*Carlos Plasencia.*CaleduDev/);
    assert.ok(page.description.length >= 60 && page.description.length <= 165);
    const entries = getWorkspaceEntries(getSiteContent(language).projects.featured, language);
    assert.equal(entries.filter(entry => entry.id === 'blog').length, 1);
    assert.equal(entries.find(entry => entry.id === 'blog').file, 'blog.md');
    assert.ok(seo.buildSitemap().includes(`<loc>${page.canonical}</loc>`));
    assert.ok(seo.buildLlms().includes(page.canonical));
  }
});

test('blog renders the production-ready article card inside the localized shell', () => {
  for (const language of ['es', 'en']) {
    const html = renderToStaticMarkup(createElement(Workspace, {
      initialEntry: 'blog', initialLanguage: language, routed: true,
    }));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1);
    assert.match(html, /class="ws-document ws-blog"/);
    assert.match(html, /blog\.md/);
    assert.match(html, new RegExp(`href="${language === 'es' ? '/en/blog/' : '/blog/'}"`));
    assert.match(html, new RegExp(`aria-current="page" href="${language === 'es' ? '/blog/' : '/en/blog/'}"`));
    assert.match(html, /<span>Blog<small>src \/ blog\.md<\/small><\/span>/);
    assert.match(html, /href="\/blog\/corregir-bug-con-ia\/"/);
    assert.match(html, language === 'es' ? /Leer el artículo/ : /Read the Spanish article/);
    assert.match(html, language === 'es' ? /principiantes e intermedios/ : /beginner and intermediate/);
    assert.doesNotMatch(html, /Borrador|vista-previa|applyDiscount|discountPercent|datePublished|<article\b|href="#"/);
  }
});

test('all thirty existing localized routes and their workspace order remain intact', () => {
  const routes = [
    ['overview', '/', '/en/'],
    ['about', '/sobre-mi/', '/en/about/'],
    ['financialia', '/proyectos/financialia/', '/en/projects/financialia/'],
    ['dgf', '/proyectos/dgf-inmobiliaria/', '/en/projects/dgf-inmobiliaria/'],
    ['maki', '/proyectos/maki-panda/', '/en/projects/maki-panda/'],
    ['skillramp', '/proyectos/skillramp/', '/en/projects/skillramp/'],
    ['reservaya', '/proyectos/reservaya/', '/en/projects/reservaya/'],
    ['skills', '/tecnologias/', '/en/skills/'],
    ['skill-typescript', '/tecnologias/typescript/', '/en/skills/typescript/'],
    ['skill-frontend', '/tecnologias/react-nextjs/', '/en/skills/react-nextjs/'],
    ['skill-backend', '/tecnologias/nestjs-graphql/', '/en/skills/nestjs-graphql/'],
    ['skill-ai', '/tecnologias/ia-aplicada/', '/en/skills/applied-ai/'],
    ['skills-more', '/tecnologias/mas/', '/en/skills/more/'],
    ['services', '/servicios/', '/en/services/'],
    ['contact', '/contacto/', '/en/contact/'],
  ];
  for (const [index, language] of ['es', 'en'].entries()) {
    for (const route of routes) assert.equal(seo.getWorkspacePath(route[0], language), route[index + 1]);
    const entries = getWorkspaceEntries(getSiteContent(language).projects.featured, language);
    assert.deepEqual(Array.from(entries.filter(entry => entry.id !== 'blog'), entry => entry.id), routes.map(route => route[0]));
    const html = renderToStaticMarkup(createElement(Workspace, { initialLanguage: language, routed: true }));
    assert.match(html, /<h1[^>]*>Carlos/);
    assert.match(html, /CaleduDev/);
    assert.match(html, /contact\.ts/);
  }
});
