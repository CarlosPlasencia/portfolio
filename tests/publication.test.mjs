import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('publication ignores environment variants and generated files without hiding source', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'portfolio-ignore-test-'));
  try {
    const init = spawnSync('git', ['init', '--quiet', scratch], { encoding: 'utf8' });
    assert.equal(init.status, 0, init.stderr);
    await writeFile(join(scratch, '.gitignore'), await read('.gitignore'));
    const ignored = (path) => {
      const result = spawnSync('git', ['check-ignore', '--no-index', '--quiet', '--', path], {
        cwd: scratch, encoding: 'utf8',
      });
      assert.ok(result.status === 0 || result.status === 1, result.stderr);
      return result.status === 0;
    };
    for (const path of [
      '.env', '.env.production', '.env.local', '.env.development',
      '.env.production.local', 'nested/.env.local', 'dist/index.html',
      '.astro/types.d.ts', 'node_modules/example/index.js',
    ]) assert.equal(ignored(path), true, `${path} must remain private or generated`);
    for (const path of ['README.md', 'src/pages/index.astro', 'public/fonts/OFL.txt']) {
      assert.equal(ignored(path), false, `${path} must remain publishable`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test('bundled Inter fonts include their copyright and complete OFL notice', async () => {
  const license = await read('public/fonts/OFL.txt');
  assert.match(license, /Copyright 2020 The Inter Project Authors/);
  assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
  assert.match(license, /PREAMBLE/);
  assert.match(license, /PERMISSION & CONDITIONS/);
  assert.match(license, /TERMINATION/);
  assert.match(license, /DISCLAIMER/);
  assert.match(license, /INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL/);
});
