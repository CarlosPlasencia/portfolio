import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { loadSource } from './helpers/source.mjs';

const origin = 'https://www.carlosplasencia.dev';
test('every workspace entry has unique localized URLs and reciprocal canonical alternates', () => {
  const seo = loadSource('lib/seo.ts');
  const pages = seo.getStaticPages();
  assert.equal(pages.length, 32);
  assert.equal(new Set(pages.map(page=>page.path)).size, pages.length);
  assert.equal(seo.getWorkspacePath('overview','es'), '/');
  assert.equal(seo.getWorkspacePath('financialia','en'), '/en/projects/financialia/');
  assert.throws(()=>seo.getWorkspacePath('../unknown','es'));
  for (const page of pages) {
    assert.equal(page.canonical, origin+page.path);
    assert.equal(page.alternates[page.language],page.canonical);
    assert.equal(page.alternates.default,page.alternates.es);
    assert.ok(page.title.includes('Carlos Plasencia'));
    assert.ok(page.description.length >= 60 && page.description.length <= 165);
    assert.doesNotMatch(page.path, /#|workspace|\.project/);
    const sibling = seo.getPageData(page.entryId,page.language === 'es' ? 'en':'es');
    assert.deepEqual(JSON.parse(JSON.stringify(page.alternates)),JSON.parse(JSON.stringify(sibling.alternates)));
  }
});

test('localized server output includes project content and real navigable links before hydration', () => {
  const {default:Workspace} = loadSource('components/workspace/WorkspacePreview.tsx');
  const html=renderToStaticMarkup(React.createElement(Workspace,{initialEntry:'skillramp',initialLanguage:'en',routed:true}));
  assert.match(html, /Skillramp/);
  assert.match(html, /Architecture|architecture/);
  assert.match(html, /href="\/en\/projects\/financialia\/"/);
  assert.match(html, /href="\/proyectos\/skillramp\/"/);
  assert.match(html, /href="\/en\/services\/"/);
  assert.doesNotMatch(html, /Lo desarrollé íntegramente|Secuencia ilustrativa/);
  assert.equal((html.match(/<main\b/g)??[]).length,1);
  const prototype=renderToStaticMarkup(React.createElement(Workspace));
  assert.match(prototype, /<button[^>]*class="ws-file/);
});

test('schema and visible service FAQs use the same factual public content', () => {
  const seo=loadSource('lib/seo.ts');
  const {default:Workspace}=loadSource('components/workspace/WorkspacePreview.tsx');
  const data=seo.getPageData('services','en');
  const html=renderToStaticMarkup(React.createElement(Workspace,{initialEntry:'services',initialLanguage:'en',routed:true}));
  for(const faq of seo.getFaqs('en')) assert.ok(html.includes(faq.question));
  const graph=data.structuredData['@graph'];
  const faq=graph.find(item=>item['@type']==='FAQPage');
  assert.equal(faq.mainEntity.length,seo.getFaqs('en').length);
  assert.ok(graph.some(item=>item['@type']==='Service'));
  const project=seo.getPageData('skillramp','en').structuredData['@graph'].find(item=>item['@type']==='CreativeWork');
  assert.ok(project.contributor);
  assert.equal(project.creator,undefined,'team work must not claim sole authorship');
  assert.doesNotMatch(JSON.stringify(graph), /aggregateRating|priceCurrency|datePublished|SearchAction/);
});

test('sitemap and llms documents derive only from valid canonical public pages and existing evidence', () => {
  const seo=loadSource('lib/seo.ts');
  const pages=seo.getStaticPages();
  const sitemap=seo.buildSitemap();
  assert.equal((sitemap.match(/<loc>/g)??[]).length,pages.length+1);
  for(const page of pages) assert.ok(sitemap.includes(`<loc>${page.canonical}</loc>`));
  assert.match(sitemap,/hreflang="x-default"/);
  assert.doesNotMatch(sitemap, /\/workspace|localhost|lastmod/);
  const brief=seo.buildLlms();
  const full=seo.buildLlms(true);
  assert.match(brief,/^# Carlos Plasencia/);
  assert.ok(full.length>brief.length);
  for(const name of ['Financialia','DGF Inmobiliaria','Maki Panda','Skillramp','ReservaYa']) assert.ok(full.includes(name));
  assert.match(full,/team|designers|programmers/);
  for(const match of brief.matchAll(/\]\((https:\/\/www\.carlosplasencia\.dev[^)]*)\)/g)) {
    assert.ok(pages.some(page=>page.canonical===match[1]) || match[1] === origin+'/llms-full.txt' || match[1] === origin+'/blog/corregir-bug-con-ia/',match[1]);
  }
  assert.doesNotMatch(brief+full,/localhost|127\.0\.0\.1|Bitbucket|review-|Co-Authored|guaranteed ranking/);
});
