import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/workspace-content.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { getWorkspaceEntries, PRIMARY_SKILLS, PROJECT_SCENES, getAdjacentEntries, updateLocalDemo, INITIAL_LOCAL_DEMO, ADDITIONAL_SKILLS, copyContactEmail } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const projects = ['financialia', 'dgf', 'maki', 'skillramp', 'reservaya'].map(id => ({ id, title: id }));

test('sequential navigation covers sections, every project and primary skills in both languages', () => {
  for (const language of ['es', 'en']) {
    const entries = getWorkspaceEntries(projects, language);
    const ids = entries.map(entry => entry.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ['overview', 'about', 'services', 'skills', 'skills-more', 'contact', ...projects.map(p => p.id), ...PRIMARY_SKILLS.map(s => s.id)]) assert.ok(ids.includes(id), id);
    for (let i = 0; i < ids.length; i++) {
      const adjacent = getAdjacentEntries(entries, ids[i]);
      assert.equal(adjacent.previous?.id, ids[i - 1]);
      assert.equal(adjacent.next?.id, ids[i + 1]);
    }
    assert.deepEqual(getAdjacentEntries(entries, 'unknown'), {});
  }
});

test('each project uses a unique scene and primary skills do not claim proficiency scores', () => {
  assert.equal(new Set(Object.values(PROJECT_SCENES)).size, projects.length);
  for (const { id } of projects) assert.ok(PROJECT_SCENES[id]);
  assert.equal(PRIMARY_SKILLS.length, 4);
  for (const skill of PRIMARY_SKILLS) {
    assert.ok(skill.title);
    assert.ok(skill.description.es.length > 40);
    assert.ok(skill.description.en.length > 40);
    assert.equal(skill.score, undefined);
  }
});

test('distinct local demo actions preserve unrelated state and reset without storage', () => {
  const initial = { ...INITIAL_LOCAL_DEMO };
  const content = updateLocalDemo(initial, { type: 'content', value: 'New development' });
  assert.equal(content.content, 'New development');
  assert.equal(content.published, false);
  assert.equal(updateLocalDemo(content, { type: 'publish' }).published, true);
  assert.equal(updateLocalDemo(updateLocalDemo(content, { type: 'publish' }), { type: 'content', value: 'Edited' }).published, false);
  const cart = updateLocalDemo(initial, { type: 'add' });
  assert.equal(cart.cart, 1);
  assert.equal(cart.points, 0);
  assert.equal(updateLocalDemo(cart, { type: 'checkout' }).points, 10);
  assert.equal(updateLocalDemo(cart, { type: 'checkout' }).cart, 0);
  assert.equal(updateLocalDemo(initial, { type: 'checkout' }).points, 0);
  assert.equal(updateLocalDemo(initial, { type: 'role' }).student, true);
  assert.equal(updateLocalDemo(initial, { type: 'lesson' }).lessonComplete, true);
  assert.equal(updateLocalDemo(initial, { type: 'reserve' }).reserved, false);
  const selected = updateLocalDemo(initial, { type: 'slot', value: '10:30' });
  assert.equal(updateLocalDemo(selected, { type: 'reserve' }).reserved, true);
  assert.equal(updateLocalDemo(updateLocalDemo(selected, { type: 'reserve' }), { type: 'slot', value: '11:30' }).reserved, false);
  assert.deepEqual(updateLocalDemo(cart, { type: 'reset' }), initial);
  assert.deepEqual(INITIAL_LOCAL_DEMO, initial);
});


test('more tools includes verified supporting technologies and product integrations', () => {
  assert.ok(ADDITIONAL_SKILLS.length >= 10);
  assert.equal(new Set(ADDITIONAL_SKILLS).size, ADDITIONAL_SKILLS.length);
  for (const tool of ['Node.js', 'Astro', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'MercadoPago', 'WhatsApp Business API', 'Google Calendar API']) assert.ok(ADDITIONAL_SKILLS.includes(tool), tool);
});

test('email copy reports success only after the writer succeeds and supports a manual fallback', async () => {
  const writes = [];
  assert.equal(await copyContactEmail('contact@example.test', async value => { writes.push(value); }), true);
  assert.deepEqual(writes, ['contact@example.test']);
  assert.equal(await copyContactEmail('contact@example.test'), false);
  assert.equal(await copyContactEmail('contact@example.test', async () => { throw new Error('Clipboard unavailable'); }), false);
});
