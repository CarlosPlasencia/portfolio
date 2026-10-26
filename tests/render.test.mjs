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
  assert.match(html, /src="\/images\/carlos-plasencia\.png"/);
  assert.match(html, /href="\/cv\/carlos-plasencia-es\.pdf" target="_blank"/);
  const project = renderToStaticMarkup(React.createElement(App, { initialEntry: 'financialia' }));
  assert.match(project, /href="\/cases\/financialia-es\.pdf"/);
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(match[0], /rel="noopener noreferrer"/);
  }
  assert.match(html, /contact\.ts/);
  assert.match(html, /more\.json/);
});
