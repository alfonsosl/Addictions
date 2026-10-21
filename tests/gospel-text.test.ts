import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const text: Record<string, string[][]> = JSON.parse(
  readFileSync(new URL('../src/content/gospel-text.json', import.meta.url), 'utf8'),
);

test('los cuatro Evangelios tienen todos sus capítulos', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(text).map(([b, chs]) => [b, chs.length])),
    { mt: 28, mc: 16, lc: 24, jn: 21 },
  );
  for (const chs of Object.values(text)) for (const vs of chs) assert.ok(vs.length > 0);
});

test('versículos perdidos acotados y sin restos del OCR', () => {
  let missing = 0;
  for (const [b, chs] of Object.entries(text))
    chs.forEach((vs, c) =>
      vs.forEach((v, i) => {
        if (!v) return void missing++;
        assert.doesNotMatch(v, /\d|[|=+£]|\s{2}/, `${b} ${c + 1}:${i + 1}: ${v}`);
      }),
    );
  assert.ok(missing <= 12, `perdidos: ${missing}`);
});

test('pasajes clave presentes', () => {
  assert.match(text.mt[4][7], /puro su corazon: porque ellos verán a Dios/);
  assert.match(text.jn[7][31], /la verdad os hará libres/);
  assert.match(text.lc[14][18], /trátame como a uno de tus jornaleros/);
  assert.match(text.mt[25][40], /Velad, y orad para no caer en la tentacion/);
});
