import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('supported toolchain replaces the legacy integration without migrating React or Tailwind styles', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.match(pkg.dependencies.astro, /^\^7\./);
  assert.match(pkg.dependencies['@astrojs/react'], /^\^7\./);
  assert.equal(pkg.dependencies['@astrojs/tailwind'], undefined);
  assert.match(pkg.dependencies.react, /^\^18\./);
  assert.match(pkg.dependencies['react-dom'], /^\^18\./);
  assert.match(pkg.dependencies.tailwindcss, /^\^3\./);
  assert.ok(pkg.devDependencies.postcss);
  assert.ok(pkg.devDependencies.autoprefixer);
  assert.equal(pkg.engines.node, '>=22.23.4');
  assert.equal(pkg.packageManager, 'pnpm@9.15.4');
  const config = await read('astro.config.mjs');
  assert.match(config, /plugins:\s*\[tailwindcss\(\), autoprefixer\(\)\]/);
  assert.doesNotMatch(config, /@astrojs\/tailwind|manualChunks|rollupOptions/);
  assert.match(config, /output:\s*"static"/);
  assert.match(config, /minify:\s*"terser"/);
  assert.match(config, /drop_console:\s*true/);
  const css = await read('src/styles/globals.css');
  assert.equal((css.match(/@tailwind base;/g) ?? []).length, 1);
  assert.equal((css.match(/@tailwind components;/g) ?? []).length, 1);
  assert.equal((css.match(/@tailwind utilities;/g) ?? []).length, 1);
});
