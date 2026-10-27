import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/workspace-demo.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { DEMO_STAGE, DEMO_EVENT, nextDemoStage } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('demo reaches review but never confirms without the user', () => {
  let stage = nextDemoStage(DEMO_STAGE.IDLE, DEMO_EVENT.START);
  assert.equal(stage, DEMO_STAGE.INPUT);
  stage = nextDemoStage(stage, DEMO_EVENT.ADVANCE);
  assert.equal(stage, DEMO_STAGE.EXTRACT);
  stage = nextDemoStage(stage, DEMO_EVENT.ADVANCE);
  assert.equal(stage, DEMO_STAGE.VALIDATE);
  stage = nextDemoStage(stage, DEMO_EVENT.ADVANCE);
  assert.equal(stage, DEMO_STAGE.REVIEW);
  assert.equal(nextDemoStage(stage, DEMO_EVENT.ADVANCE), DEMO_STAGE.REVIEW);
  assert.equal(nextDemoStage(stage, DEMO_EVENT.CONFIRM), DEMO_STAGE.CONFIRMED);
});

test('premature confirmation and repeated starts cannot skip validation', () => {
  for (const stage of [DEMO_STAGE.IDLE, DEMO_STAGE.INPUT, DEMO_STAGE.EXTRACT, DEMO_STAGE.VALIDATE]) {
    assert.equal(nextDemoStage(stage, DEMO_EVENT.CONFIRM), stage);
  }
  assert.equal(nextDemoStage(DEMO_STAGE.EXTRACT, DEMO_EVENT.START), DEMO_STAGE.EXTRACT);
  assert.equal(nextDemoStage(DEMO_STAGE.CONFIRMED, DEMO_EVENT.ADVANCE), DEMO_STAGE.CONFIRMED);
});

test('reset works at every stage and a finished demo can replay', () => {
  for (const stage of Object.values(DEMO_STAGE)) {
    assert.equal(nextDemoStage(stage, DEMO_EVENT.RESET), DEMO_STAGE.IDLE);
  }
  assert.equal(nextDemoStage(DEMO_STAGE.CONFIRMED, DEMO_EVENT.START), DEMO_STAGE.INPUT);
});

test('workspace renders overview agents, isolated project demos and browsable content', async () => {
  const { createRequire } = await import('node:module');
  const { runInNewContext } = await import('node:vm');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const React = await import('react');
  const require = createRequire(import.meta.url);
  const modules = new Map();
  const mapping = {
    '../../contexts/LanguageContext': 'contexts/LanguageContext.tsx',
    '../lib/i18n': 'lib/i18n.ts',
    '../../lib/i18n': 'lib/i18n.ts',
    '../../lib/workspace-demo': 'lib/workspace-demo.ts',
    '../../lib/seo': 'lib/seo.ts',
    './i18n': 'lib/i18n.ts',
    './workspace-content': 'lib/workspace-content.ts',
    './blog': 'lib/blog.ts',
    '../../lib/blog': 'lib/blog.ts',
    '../../lib/workspace-content': 'lib/workspace-content.ts',
    './ProjectDemos': 'components/workspace/ProjectDemos.tsx',
    './ProjectVisual': 'components/workspace/ProjectVisual.tsx',
    './AgentTerminals': 'components/workspace/AgentTerminals.tsx',
    './ContactPage': 'components/workspace/ContactPage.tsx',
    './BlogPage': 'components/workspace/BlogPage.tsx',
  };
  async function load(path) {
    if (modules.has(path)) return modules.get(path);
    const text = await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');
    const imports = {};
    for (const [specifier, target] of Object.entries(mapping)) {
      if (text.includes(`from '${specifier}'`) || text.includes(`from "${specifier}"`)) imports[specifier] = await load(target);
    }
    const { outputText } = ts.transpileModule(text, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    });
    const module = { exports: {} };
    runInNewContext(outputText, { module, exports: module.exports, require: name => imports[name] ?? require(name) });
    modules.set(path, module.exports);
    return module.exports;
  }
  const { default: App } = await load('components/workspace/WorkspacePreview.tsx');
  const html = renderToStaticMarkup(React.createElement(App));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /Carlos/);
  assert.match(html, /Plasencia/);
  assert.match(html, /Secuencia ilustrativa/);
  assert.match(html, /sin agentes reales/);
  assert.match(html, /codex/);
  assert.match(html, /claude/);
  assert.doesNotMatch(html, /financialia\.pipeline/);
  assert.doesNotMatch(html, /ws-motion/);
  assert.match(html, /ES → EN/);
  assert.doesNotMatch(html, /mailto:/);
  assert.match(html, /contact\.ts/);
  assert.match(html, /Siguiente/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /aria-controls="workspace-content"/);
  const projectIds = ['financialia', 'dgf', 'maki', 'skillramp', 'reservaya'];
  for (const id of projectIds) {
    const page = renderToStaticMarkup(React.createElement(App, { initialEntry: id }));
    assert.equal((page.match(/<h1\b/g) ?? []).length, 1);
    assert.match(page, new RegExp(`visual-${id}`));
    assert.match(page, /Ilustración conceptual, no captura/);
    assert.match(page, /Anterior/);
    assert.match(page, /Siguiente/);
    if (id === 'financialia') {
      assert.match(page, /financialia\.pipeline/);
      assert.match(page, /sin llamadas a IA/);
      assert.match(page, /Esperando ejecución/);
      assert.doesNotMatch(page, /Confirmado · solo demo/);
    } else {
      assert.doesNotMatch(page, /financialia\.pipeline/);
      assert.match(page, /datos ficticios/);
      assert.match(page, /no modifica el producto real/);
    }
    if (id === 'skillramp') assert.match(page, /3 programadores, QA y PM/);
  }
  for (const id of ['about', 'services', 'skills', 'skill-typescript', 'skill-frontend', 'skill-backend', 'skill-ai', 'skills-more', 'contact']) {
    const page = renderToStaticMarkup(React.createElement(App, { initialEntry: id }));
    assert.equal((page.match(/<h1\b/g) ?? []).length, 1);
    assert.match(page, /Anterior/);
    assert.doesNotMatch(page, /financialia\.pipeline/);
  }
  const about = renderToStaticMarkup(React.createElement(App, { initialEntry: 'about' }));
  assert.match(about, /Digenio/); assert.match(about, /carlos-plasencia-about.webp/);
  const services = renderToStaticMarkup(React.createElement(App, { initialEntry: 'services' }));
  assert.match(services, /IA aplicada a tu producto/);
  assert.match(services, /Ver opciones de contacto/);
  const contact = renderToStaticMarkup(React.createElement(App, { initialEntry: 'contact' }));
  assert.match(contact, /linkedin.com\/in\/carlos-edu-plasencia-prado/);
  assert.match(contact, /wa.me\/51942254876/);
  assert.match(contact, /Copiar correo/);
  assert.match(contact, /plasenciacarlos7@gmail.com/);
  assert.match(contact, /github.com\/CarlosPlasencia/);
  assert.match(contact, /totora.studio/);
  assert.doesNotMatch(contact, /mailto:/);
  for (const page of [html, about, contact]) {
    const cvAnchors = page.match(/<a\b[^>]*href="\/cv\/[^"]+"[^>]*>/g) ?? [];
    assert.ok(cvAnchors.length >= 2);
    for (const anchor of cvAnchors) {
      assert.match(anchor, /target="_blank"/);
      assert.match(anchor, /rel="noopener noreferrer"/);
      assert.doesNotMatch(anchor, /\bdownload(?:=|\s|>)/);
      assert.match(anchor, /aria-label="(?:resume\.pdf — )?Abrir CV en nueva pestaña"/);
    }
  }
  assert.match(about, /Ver CV/);
  assert.match(contact, /Ver CV/);

  const more = renderToStaticMarkup(React.createElement(App, { initialEntry: 'skills-more' }));
  for (const technology of ['MongoDB', 'PostgreSQL', 'Redis', 'Astro', 'WhatsApp Business API']) assert.ok(more.includes(technology), technology);
  assert.doesNotMatch(html, /Confirmado · solo demo/);
  assert.match(html, /financialia\.project/);
  assert.match(html, /skillramp\.project/);
  const route = await readFile(new URL('../src/pages/workspace.astro', import.meta.url), 'utf8');
  assert.match(route, /noindex,nofollow/);
});

test('search focus uses the header edge without drawing through input text', async () => {
  const css = await readFile(new URL('../src/styles/workspace.css', import.meta.url), 'utf8');
  assert.match(css, /\.ws-command-input input\s*\{[^}]*min-height:\s*32px/);
  assert.match(css, /\.ws-command-input:focus-within\s*\{[^}]*box-shadow:\s*inset 0 -2px 0 #83aaff/);
  assert.match(css, /\.workspace \.ws-command-input input:focus-visible\s*\{[^}]*outline:\s*none/);
  assert.match(css, /\.workspace button:focus-visible[^}]*outline:\s*2px solid #83aaff/);
});
