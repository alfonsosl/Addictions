"""Reduce las tipografías a los caracteres que usa la app (latín completo y puntuación).

Mantiene el diseño, el interletrado (kern) y las ligaduras; quita alfabetos que no se usan
(griego, cirílico, vietnamita…). Uso: python3 scripts/fonts/subset.py  (requiere fonttools)
"""
import os
from fontTools import subset

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
SRC = os.path.join(ROOT, 'node_modules', '@expo-google-fonts')
OUT = os.path.join(ROOT, 'assets', 'fonts')
FONTS = [
    ('jost', 'Jost_300Light'), ('jost', 'Jost_400Regular'), ('jost', 'Jost_500Medium'), ('jost', 'Jost_600SemiBold'),
    ('eb-garamond', 'EBGaramond_400Regular'), ('eb-garamond', 'EBGaramond_400Regular_Italic'),
    ('eb-garamond', 'EBGaramond_500Medium'), ('eb-garamond', 'EBGaramond_500Medium_Italic'),
    ('eb-garamond', 'EBGaramond_600SemiBold'),
]
UNICODES = 'U+0020-007E,U+00A0-017F,U+2010-2027,U+2030-203A,U+2044,U+20AC,U+2190-2199,U+2212,U+2713,U+2715'

os.makedirs(OUT, exist_ok=True)
for pkg, name in FONTS:
    weight = name.split('_', 1)[1]
    src = os.path.join(SRC, pkg, weight, f'{name}.ttf')
    dst = os.path.join(OUT, f'{name}.ttf')
    opts = subset.Options()
    opts.layout_features = ['kern', 'liga', 'clig', 'calt', 'onum', 'lnum', 'pnum', 'tnum', 'ccmp', 'locl', 'mark', 'mkmk']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    opts.hinting = False  # las pantallas de móvil no lo necesitan
    font = subset.load_font(src, opts)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    subset.save_font(font, dst, opts)
    print(f'{name}: {os.path.getsize(src) // 1024} KB → {os.path.getsize(dst) // 1024} KB')
