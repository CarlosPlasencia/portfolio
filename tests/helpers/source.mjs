import { readFileSync, existsSync } from 'node:fs';
import { posix } from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const modules = new Map();
export function loadSource(path) {
  const url = new URL(`../../src/${path}`, import.meta.url);
  if (modules.has(url.href)) return modules.get(url.href);
  const source = readFileSync(url, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const module = { exports: {} };
  const localRequire = specifier => {
    if (!specifier.startsWith('.')) return require(specifier);
    const base = posix.normalize(posix.join(posix.dirname(path), specifier));
    const target = [base, `${base}.tsx`, `${base}.ts`].find(candidate => existsSync(new URL(`../../src/${candidate}`, import.meta.url)));
    if (!target) throw Error(`Source import not found: ${specifier}`);
    return loadSource(target);
  };
  runInNewContext(outputText, { module, exports: module.exports, require: localRequire, URL, Response });
  modules.set(url.href, module.exports);
  return module.exports;
}
