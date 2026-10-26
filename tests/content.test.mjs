import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/i18n.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const content = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('both languages expose matching real projects and their own CV and case study', () => {
  for (const language of ['es', 'en']) {
    const copy = content.getSiteContent(language);
    assert.equal(copy, content.translations[language]);
    assert.equal(copy.cv.url, `/cv/carlos-plasencia-${language}.pdf`);
    assert.deepEqual(copy.projects.featured.map(project => project.id), ['financialia', 'dgf', 'maki', 'skillramp', 'reservaya']);
    assert.equal(copy.projects.featured[0].caseStudy, `/cases/financialia-${language}.pdf`);
    assert.equal(copy.services.offerings.length, 3);
    assert.match(copy.services.offerings[1].title, /IA|AI/);
    assert.match(copy.services.offerings[2].title, /SaaS/);
    for (const project of copy.projects.featured) {
      assert.ok(project.summary && project.contribution && project.details.length);
      assert.equal(new URL(project.url).protocol, 'https:');
    }
  }
});

test('copy preserves ownership, practical product details and team attribution', () => {
  for (const language of ['es', 'en']) {
    const copy = content.getSiteContent(language);
    const find = id => copy.projects.featured.find(project => project.id === id);
    const skillramp = JSON.stringify(find('skillramp'));
    assert.match(skillramp, /Aptura/);
    assert.match(skillramp, /3/);
    assert.match(skillramp, /QA/);
    assert.match(skillramp, /PM/);
    assert.doesNotMatch(skillramp, /solo|entirely by me|por m[ií] solo/i);
    assert.match(JSON.stringify(find('financialia')), /Claude/);
    assert.match(JSON.stringify(find('dgf')), /CMS/);
    assert.match(JSON.stringify(find('maki')), /fidelizaci[oó]n|loyalty/i);
    assert.match(JSON.stringify(copy.experience), /Wayfrontier/);
    assert.doesNotMatch(JSON.stringify(copy), /9\+|fluent|fluido|Bachelor|international clients|clientes internacionales|wayfrontier\.(com|io)/i);
    assert.doesNotMatch(JSON.stringify(find('reservaya')), /MongoDB|PostgreSQL/);
    assert.match(copy.contact.employment, /tiempo completo.*parcial|full-time.*part-time/);
  }
});

test('translation lookup handles actual values, arrays and missing paths', () => {
  assert.equal(content.getTranslation('es', 'nav.projects'), content.getSiteContent('es').nav.projects);
  assert.deepEqual(content.getTranslation('en', 'projects.featured'), content.getSiteContent('en').projects.featured);
  assert.equal(content.getTranslation('es', 'not.a.key'), 'not.a.key');
  assert.equal(content.getTranslation('es', 'nav.projects.toString'), 'nav.projects.toString');
});

test('language selection validates storage and safely falls back without browser APIs', () => {
  assert.equal(content.getLanguageFromBrowser(), 'es');
  assert.equal(content.resolveLanguage('en', 'es-PE'), 'en');
  assert.equal(content.resolveLanguage('es', 'en-US'), 'es');
  assert.equal(content.resolveLanguage('invalid', 'en-GB'), 'en');
  assert.equal(content.resolveLanguage(null, 'es-PE'), 'es');
  assert.equal(content.resolveLanguage(null, 'fr-FR'), 'es');
  assert.equal(content.resolveLanguage(null), 'es');
  assert.equal(content.isLanguage('en'), true);
  assert.equal(content.isLanguage('EN'), false);
});
