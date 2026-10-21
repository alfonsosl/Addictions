#!/usr/bin/env python3
"""Genera src/content/gospel-text.json con los cuatro Evangelios de la Torres Amat.

Fuente: módulo «TorresAmat» (dominio público; OCR de la edición de 1882) del proyecto
https://github.com/OmarGonD/biblia-elim (archivo modulos/sqlite/TorresAmat.sqlite).
Referencia de numeración: Vulgata Clementina del paquete npm @bible-api/bible-api-version-vulgate (MIT-0).

Uso:
  python3 scripts/gospels/build.py --sqlite RUTA/TorresAmat.sqlite --vulgate RUTA/vulgate.json

1. Lee los versículos de Mateo, Marcos, Lucas y Juan.
2. Aplica las correcciones manuales de corrections.tsv (texto completo o sustituciones "~a=>b").
3. Normaliza: quita restos del OCR (números de nota, signos sueltos), arregla espacios y signos,
   y moderniza solo los acentos de las palabras sueltas «á, é, ó, ú» y «Jesus» → «Jesús».
4. Ordena según la numeración de la Vulgata; los versículos perdidos quedan como "".
"""
import argparse
import json
import re
import sqlite3
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
BOOKS = [('mt', 'Matt', 'Matthew'), ('mc', 'Mark', 'Mark'), ('lc', 'Luke', 'Luke'), ('jn', 'John', 'John')]

GLOBAL_FIXES = [
    (r'\bAlo\b', 'A lo'),
    (r'\bremo de los\b', 'reino de los'),
    (r'\bseles\b', 'se les'),
    (r'\bsynasoga', 'synagoga'),
    (r'\bMestas\b', 'Mesías'),
    # El OCR lee a menudo «is» como «ls» en las desinencias verbales (pagals → pagais).
    (r'(?<=[a-zñ])([aeé])ls\b', r'\1is'),
    (r'\b(deb|quis)l(?=[aeé])', r'\1i'),
    (r'\b([Áá])la\b', r'\1 la'),
    (r'\bAla\b', 'A la'),
    (r'\bAsíel\b', 'Así el'),
]


def load_corrections(path):
    fixes = {}
    for n, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        if not line.strip() or line.startswith('#'):
            continue
        ref, _, text = line.partition('\t')
        m = re.fullmatch(r'(mt|mc|lc|jn) (\d+):(\d+)', ref.strip())
        if not m or not text:
            sys.exit(f'corrections.tsv:{n}: línea mal formada: {line!r}')
        key = (m.group(1), int(m.group(2)), int(m.group(3)))
        if key in fixes:
            sys.exit(f'corrections.tsv:{n}: referencia repetida {ref}')
        fixes[key] = (n, text)
    return fixes


def apply_fix(key, original, fix):
    n, text = fix
    if text == '-':
        return ''
    if not text.startswith('~'):
        return text
    out = original
    for pair in text[1:].split(' || '):
        old, sep, new = pair.partition('=>')
        if not sep or old not in out:
            sys.exit(f'corrections.tsv:{n}: no se encuentra {old!r} en {key}: {original!r}')
        out = out.replace(old, new, 1)
    return out


def normalize(t):
    t = t.replace(' ', ' ').replace('"', '').replace('“', '').replace('”', '')
    # Restos del OCR: números de nota y signos sueltos entre espacios.
    t = re.sub(r'(?<![\w\[])[\d+=/|£]+(?![\w\]])', ' ', t)
    for pat, rep in GLOBAL_FIXES:
        t = re.sub(pat, rep, t)
    t = re.sub(r'^[\s.\-—,;:]+', '', t)
    t = re.sub(r'\s+([,.;:?!])', r'\1', t)
    t = re.sub(r'([¿¡])\s+', r'\1', t)
    t = re.sub(r'([?!])\1+', r'\1', t)
    t = re.sub(r'([,;:])(?=[A-Za-zÀ-ÿ¿¡])', r'\1 ', t)
    # Modernización mínima de la ortografía de 1882.
    for old, new in (('á', 'a'), ('é', 'e'), ('ó', 'o'), ('ú', 'u'), ('Á', 'A'), ('É', 'E'), ('Ó', 'O')):
        t = re.sub(rf'(?<![\wÀ-ÿ]){old}(?![\wÀ-ÿ])', new, t)
    t = re.sub(r'\bJesus\b', 'Jesús', t)
    t = re.sub(r'\bJESUS\b', 'JESÚS', t)
    t = re.sub(r'\s{2,}', ' ', t).strip()
    return t


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sqlite', required=True)
    ap.add_argument('--vulgate', required=True)
    ap.add_argument('--out', default=str(ROOT / 'src/content/gospel-text.json'))
    args = ap.parse_args()

    db = sqlite3.connect(f'file:{args.sqlite}?mode=ro', uri=True)
    vulg = json.loads(Path(args.vulgate).read_text(encoding='utf-8'))['booksData']
    fixes = load_corrections(HERE / 'corrections.tsv')
    used = set()
    out, stats = {}, {}

    for bid, osis, vname in BOOKS:
        book_id = db.execute('select book_id from books where osis=?', (osis,)).fetchone()[0]
        ta = {}
        for ch, v, text in db.execute('select chapter, verse, text from verses where book_id=?', (book_id,)):
            ta[(ch, v)] = text
        chapters = []
        missing = 0
        vch = vulg[vname]['chaptersData']
        for ch in range(1, len(vch)):
            n_verses = len(vch[ch]) - 1
            extra = max([v for (c, v) in ta if c == ch] + [0])
            verses = []
            for v in range(1, max(n_verses, extra) + 1):
                key = (bid, ch, v)
                text = ta.get((ch, v), '')
                if key in fixes:
                    text = apply_fix(key, text, fixes[key])
                    used.add(key)
                text = normalize(text)
                if not text:
                    missing += 1
                verses.append(text)
            chapters.append(verses)
        out[bid] = chapters
        stats[bid] = {'capitulos': len(chapters), 'versiculos': sum(map(len, chapters)), 'perdidos': missing}

    unused = set(fixes) - used
    if unused:
        sys.exit(f'Correcciones sin aplicar: {sorted(unused)}')
    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(json.dumps(stats, ensure_ascii=False))
    print(f'{len(fixes)} correcciones aplicadas → {args.out}')


if __name__ == '__main__':
    main()
