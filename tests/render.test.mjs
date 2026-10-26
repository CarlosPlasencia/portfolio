import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { posix } from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const modules = new Map();

function loadSource(path) {
  const url = new URL(`../src/${path}`, import.meta.url);
  if (modules.has(url.href)) return modules.get(url.href);
  const source = readFileSync(url, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const module = { exports: {} };
  const localRequire = specifier => {
    if (specifier.startsWith('.')) {
      const base = posix.normalize(posix.join(posix.dirname(path), specifier));
      const target = [base, `${base}.tsx`, `${base}.ts`].find(candidate => existsSync(new URL(`../src/${candidate}`, import.meta.url)));
      if (!target) throw new Error(`Source import not found: ${specifier}`);
      return loadSource(target);
    }
    return require(specifier);
  };
  runInNewContext(outputText, { module, exports: module.exports, require: localRequire });
  modules.set(url.href, module.exports);
  return module.exports;
}

test('main workspace server render is Spanish with one main heading and accessible navigation', () => {
  const { default: App } = loadSource('components/workspace/WorkspacePreview.tsx');
  const html = renderToStaticMarkup(React.createElement(App));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1);
  assert.match(html, /Carlos/);
  assert.match(html, /Plasencia/);
  assert.match(html, /Buscar secciones y proyectos/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /id="workspace-content"/);
  assert.match(html, /overview\.tsx/);
  assert.doesNotMatch(html, /Tu próxima idea,/);
});

test('render exposes all projects, approved portrait and language-specific documents', () => {
  const { default: App } = loadSource('components/workspace/WorkspacePreview.tsx');
  const html = renderToStaticMarkup(React.createElement(App));
  for (const id of ['financialia', 'dgf', 'maki', 'skillramp', 'reservaya']) {
    assert.ok(html.includes(`${id}.project`));
  }
  assert.match(html, /src="\/images\/carlos-plasencia-avatar\.webp"/);
  assert.match(html, /href="\/cv\/carlos-plasencia-es\.pdf" target="_blank"/);
  const project = renderToStaticMarkup(React.createElement(App, { initialEntry: 'financialia' }));
  assert.match(project, /href="\/cases\/financialia-es\.pdf"/);
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(match[0], /rel="noopener noreferrer"/);
  }
  assert.match(html, /contact\.ts/);
  assert.match(html, /more\.json/);
});

test('workspace keeps a main landmark and only tabs inside its tablist', () => {
  const { default: App } = loadSource('components/workspace/WorkspacePreview.tsx');
  const html = renderToStaticMarkup(React.createElement(App));
  const main = html.match(/<main\b([^>]*)>([\s\S]*?)<\/main>/);
  assert.ok(main);
  assert.doesNotMatch(main[1], /role="tabpanel"/);
  assert.match(main[2], /<section[^>]*id="workspace-content"[^>]*role="tabpanel"/);
  const tabs = html.match(/<div class="ws-tab-items"[^>]*role="tablist"[^>]*>([\s\S]*?)<\/div>/);
  assert.ok(tabs, 'the tablist must be separate from the CV link');
  assert.match(tabs[1], /role="tab"/);
  assert.doesNotMatch(tabs[1], /<a\b/);
  assert.match(main[2], /class="ws-tab-cv"/);
});

test('workspace accessible names include visible language and search labels', () => {
  const { default: App } = loadSource('components/workspace/WorkspacePreview.tsx');
  const html = renderToStaticMarkup(React.createElement(App));
  const language = html.match(/<button class="ws-language"[^>]*aria-label="([^"]+)"/);
  const search = html.match(/<button class="ws-command"[^>]*aria-label="([^"]+)"/);
  assert.match(language?.[1] ?? '', /ES → EN/);
  assert.match(search?.[1] ?? '', /Explora el workspace/);
  assert.match(html, /aria-label="resume\.pdf — Abrir CV en nueva pestaña"/);
  assert.match(readFileSync(new URL('../src/styles/workspace.css', import.meta.url), 'utf8'), /\.workspace \.ws-canvas:focus-visible/);
});

test('initial avatar uses a small high-density WebP without replacing the approved portrait', () => {
  const { default: App } = loadSource('components/workspace/WorkspacePreview.tsx');
  const html = renderToStaticMarkup(React.createElement(App));
  assert.match(html, /src="\/images\/carlos-plasencia-avatar\.webp"[^>]*width="28"[^>]*height="28"/);
  const bytes = readFileSync(new URL('../public/images/carlos-plasencia-avatar.webp', import.meta.url));
  assert.equal(bytes.subarray(0,4).toString(), 'RIFF');
  assert.equal(bytes.subarray(8,12).toString(), 'WEBP');
  assert.ok(bytes.length < 10_000, `avatar must be under 10 KB, got ${bytes.length}`);
});

test('audited decorative text still meets small-text contrast requirements', () => {
  const css = readFileSync(new URL('../src/styles/workspace.css', import.meta.url), 'utf8');
  const luminance = hex => {
    const channels = hex.match(/\w\w/g).map(value => parseInt(value,16)/255)
      .map(value => value <= 0.04045 ? value/12.92 : ((value+0.055)/1.055)**2.4);
    return channels[0]*0.2126 + channels[1]*0.7152 + channels[2]*0.0722;
  };
  for (const [selector,background] of [['.ws-line-numbers','090d14'],['.ws-scene-label','090d14'],['.ws-layer-title>span:last-child','132747'],['.ws-count','0e141e'],['.ws-section-caption','090d14'],['.ws-scene-axis','0b1626'],['.ws-agent-bar>span:last-child','152032']]) {
    const rule = css.split(`${selector} {`)[1]?.split('}')[0];
    const foreground = rule?.match(/\bcolor: #([a-f0-9]{6})\b/)?.[1];
    assert.ok(foreground, selector);
    const values = [luminance(foreground),luminance(background)].sort((a,b)=>b-a);
    assert.ok((values[0]+0.05)/(values[1]+0.05) >= 4.5, `${selector} needs 4.5:1 contrast`);
  }
});

test('about portrait is a bounded WebP aligned with the title column in both languages', () => {
  const { default: App } = loadSource('components/workspace/WorkspacePreview.tsx');
  for (const language of ['es', 'en']) {
    const html = renderToStaticMarkup(React.createElement(App, { initialEntry: 'about', initialLanguage: language, routed: true }));
    assert.match(html, /class="ws-about-grid"><div class="ws-about-copy"><div class="ws-doc-heading"><h1/);
    assert.match(html, /<img src="\/images\/carlos-plasencia-about\.webp" width="640" height="640" decoding="async"/);
    assert.doesNotMatch(html, /src="\/images\/carlos-plasencia\.png"/);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, new RegExp(`href="/cv/carlos-plasencia-${language}\\.pdf" target="_blank"`));
  }
  const bytes = readFileSync(new URL('../public/images/carlos-plasencia-about.webp', import.meta.url));
  assert.equal(bytes.subarray(0,4).toString(), 'RIFF');
  assert.equal(bytes.subarray(8,12).toString(), 'WEBP');
  assert.ok(bytes.length < 100_000, `about portrait must stay under 100 KB, got ${bytes.length}`);
  const css = readFileSync(new URL('../src/styles/workspace.css', import.meta.url), 'utf8');
  assert.match(css, /\.ws-about-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+280px/);
  assert.match(css, /\.workspace \.ws-about \.ws-doc-heading h1\s*\{[^}]*margin-top:\s*0/);
});
