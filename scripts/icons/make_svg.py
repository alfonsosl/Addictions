"""Genera el icono de Vigilia: el Buen Pastor con la oveja sobre los hombros (Lc 15,5).

Estilo de ilustración de línea (papel crema, tinta azul marino, tonos tierra).
Salida: SVG en scripts/icons/out/ (full, fg, mono). Después: node scripts/icons/render.js
"""
import math, os, random

OUT = os.path.join(os.path.dirname(__file__), 'out')
os.makedirs(OUT, exist_ok=True)

PAPER, INK, SEA, WOOD, WOOL, WOOL2, WHITE, OCHRE = '#EFEADB', '#1D2758', '#2E6DB4', '#6B4A2B', '#D9CCB2', '#C9B796', '#FBFAF6', '#B08A4E'


def smooth(pts, closed=True):
    p = [pts[-1], *pts, pts[0], pts[1]] if closed else [pts[0], *pts, pts[-1]]
    d = f'M{p[1][0]:.1f} {p[1][1]:.1f}'
    for i in range(1, len(p) - 2):
        x0, y0 = p[i - 1]; x1, y1 = p[i]; x2, y2 = p[i + 1]; x3, y3 = p[i + 2]
        d += f' C{x1 + (x2 - x0) / 6:.1f} {y1 + (y2 - y0) / 6:.1f} {x2 - (x3 - x1) / 6:.1f} {y2 - (y3 - y1) / 6:.1f} {x2:.1f} {y2:.1f}'
    return d + (' Z' if closed else '')


def wool(cx, cy, rx, ry, bumps=14, seed=1):
    """Contorno de lana: elipse con rizos."""
    r = random.Random(seed)
    pts = []
    n = bumps * 4
    for i in range(n):
        a = i / n * 2 * math.pi
        k = 1 + 0.09 * abs(math.sin(a * bumps / 2)) + (r.random() - 0.5) * 0.02
        pts.append((cx + rx * k * math.cos(a), cy + ry * k * math.sin(a)))
    return smooth(pts)


def wave(y, x0, x1, amp, seed):
    r = random.Random(seed)
    f1, p1 = 0.012 + r.random() * 0.006, r.random() * 6.28
    pts = [(x, y + amp * math.sin(x * f1 + p1)) for x in range(x0, x1 + 1, 40)]
    return smooth(pts, closed=False)


def wool_band(pts, thick, seed):
    """Cuerpo de lana a lo largo de una curva (la oveja cruzada sobre los hombros)."""
    r = random.Random(seed)
    top, bot = [], []
    for i, (x, y) in enumerate(pts):
        # normal aproximada
        x2, y2 = pts[min(i + 1, len(pts) - 1)]
        x1, y1 = pts[max(i - 1, 0)]
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        t = 1 - abs((i / (len(pts) - 1)) * 2 - 1) * 0.35  # más grueso en el centro
        bump = 1 + 0.12 * abs(math.sin(i * 1.7)) + (r.random() - 0.5) * 0.04
        top.append((x + nx * thick * t * bump, y + ny * thick * t * bump))
        bot.append((x - nx * thick * t * (2 - bump), y - ny * thick * t * (2 - bump)))
    return smooth(top + bot[::-1])


def art(mono=False):
    c = (lambda col: '#FFFFFF') if mono else (lambda col: col)
    sw = 9
    DARK = '#3A2A1E'
    g = []
    # Suelo: líneas de colina como en las ilustraciones
    for i, y in enumerate([812, 842, 872]):
        g.append(f'<path d="{wave(y, 220 + i * 50, 804 - i * 50, 6, i + 3)}" stroke="{c(SEA if i % 2 else INK)}" stroke-width="{sw - 1}" fill="none" stroke-linecap="round"/>')
    # Aureola
    g.append(f'<circle cx="512" cy="318" r="92" fill="none" stroke="{c(OCHRE)}" stroke-width="6"/>')
    # Túnica
    robe = 'M432 420 Q512 400 592 420 C626 560 650 700 668 806 L356 806 C374 700 398 560 432 420 Z'
    g.append(f'<path d="{robe}" fill="{c(WHITE)}" stroke="{c(INK)}" stroke-width="{sw}" stroke-linejoin="round"/>')
    if not mono:
        g.append(f'<path d="M500 560 C496 660 492 740 488 800 M540 600 C546 680 552 740 556 800" stroke="#D8CFBA" stroke-width="5" fill="none" stroke-linecap="round"/>')
        g.append(f'<path d="M440 560 Q512 578 584 560" stroke="{SEA}" stroke-width="10" fill="none" stroke-linecap="round"/>')
    # Oveja cruzada sobre los hombros, detrás de la cabeza
    band = [(372, 470), (400, 430), (450, 402), (512, 392), (574, 398), (622, 420), (652, 452)]
    g.append(f'<path d="{wool_band(band, 50, 7)}" fill="{c(WOOL)}" stroke="{c(INK)}" stroke-width="{sw - 1}" stroke-linejoin="round"/>')
    if not mono:
        for x, y in [(410, 440), (446, 412), (590, 410), (622, 438), (470, 432), (560, 426)]:
            g.append(f'<path d="M{x - 12} {y} q6 -10 12 0 q6 10 12 0" stroke="{WOOL2}" stroke-width="5" fill="none" stroke-linecap="round"/>')
        g.append(f'<path d="M370 472 q-22 6 -26 26" stroke="{WOOL2}" stroke-width="9" fill="none" stroke-linecap="round"/>')
    # Cabeza de la oveja, a la derecha, mirando hacia abajo
    g.append(f'<ellipse cx="682" cy="470" rx="34" ry="46" transform="rotate(-28 682 470)" fill="{c(DARK)}"/>')
    g.append(f'<path d="M662 436 C690 414 714 418 724 426" stroke="{c(DARK)}" stroke-width="16" stroke-linecap="round" fill="none"/>')
    if not mono:
        g.append(f'<circle cx="694" cy="466" r="5" fill="{WHITE}"/>')
    # Brazos (mangas) que sujetan las patas
    for arm in ['M444 452 C396 520 392 590 414 574', 'M580 452 C626 520 634 580 614 566']:
        g.append(f'<path d="{arm}" stroke="{c(INK)}" stroke-width="46" fill="none" stroke-linecap="round"/>')
        g.append(f'<path d="{arm}" stroke="{c(WHITE)}" stroke-width="30" fill="none" stroke-linecap="round"/>')
    # Patas de la oveja colgando por delante, sujetas por las manos
    for (x0, y0, x1, y1) in [(392, 470, 404, 612), (420, 476, 430, 606), (610, 462, 606, 600), (636, 458, 634, 594)]:
        g.append(f'<path d="M{x0} {y0} L{x1} {y1}" stroke="{c(DARK)}" stroke-width="13" stroke-linecap="round"/>')
    for hx, hy in [(416, 566), (614, 558)]:
        g.append(f'<circle cx="{hx}" cy="{hy}" r="17" fill="{c("#EBD9C2")}" stroke="{c(INK)}" stroke-width="{sw - 3}"/>')
    # Cabello largo y barba; rostro sin rasgos
    hair = 'M462 330 C456 262 488 250 512 250 C538 250 570 262 562 330 C566 372 560 400 548 416 L476 416 C464 400 458 372 462 330 Z'
    g.append(f'<path d="{hair}" fill="{c(WOOD)}"/>')
    g.append(f'<ellipse cx="512" cy="322" rx="32" ry="40" fill="{c("#EBD9C2")}" stroke="{c(INK)}" stroke-width="{sw - 3}"/>')
    if not mono:
        g.append(f'<path d="M482 334 C486 372 498 386 512 388 C526 386 538 372 542 334 C530 352 520 356 512 356 C504 356 494 352 482 334 Z" fill="{WOOD}"/>')
    return '\n'.join(g)


def svg(content, bg=None, scale=1.0):
    t = f'translate({512 - 512 * scale} {512 - 540 * scale + 28 * scale}) scale({scale})'
    back = f'<rect width="1024" height="1024" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">{back}<g transform="{t}">{content}</g></svg>'


open(os.path.join(OUT, 'icon.svg'), 'w').write(svg(art(), PAPER, 1.08))
open(os.path.join(OUT, 'fg.svg'), 'w').write(svg(art(), None, 0.86))
open(os.path.join(OUT, 'mono.svg'), 'w').write(svg(art(True), None, 0.86))
open(os.path.join(OUT, 'splash.svg'), 'w').write(svg(art(), None, 0.9))
print('ok')
