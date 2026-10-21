import assert from 'node:assert/strict';
import test from 'node:test';
import { sceneForChapter, sceneForReference } from '../src/content/gospelScenes.ts';

test('cada capítulo tiene ilustración; las escenas clave son las esperadas', () => {
  assert.equal(sceneForChapter('mt', 14), 'sea');
  assert.equal(sceneForChapter('lc', 15), 'flock');
  assert.equal(sceneForChapter('jn', 15), 'vine');
  assert.equal(sceneForChapter('jn', 19), 'cross');
  assert.equal(sceneForChapter('mc', 7), 'sea'); // por defecto, el de Marcos
});

test('la cita del Evangelio del día se traduce a su ilustración', () => {
  assert.equal(sceneForReference('Lc 15,1-10'), 'flock');
  assert.equal(sceneForReference('San Juan 4, 5-42'), 'well');
  assert.equal(sceneForReference('Evangelio según san Mateo 14:22-33'), 'sea');
  assert.equal(sceneForReference('Mc 16,15'), 'tomb');
  assert.equal(sceneForReference('Hch 2,1-11', 'dove'), 'dove');
  assert.equal(sceneForReference(undefined, 'night'), 'night');
});
