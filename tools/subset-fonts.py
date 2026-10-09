"""Subsets Noto Sans SC to the characters the game uses (test run, Oct 9: the build had 618 font files, 23 MB).

    python3 -m pip install fonttools brotli     (once)
    python3 tools/subset-fonts.py               (again whenever new Chinese text is added; `npm run check` says when)

Reads the @fontsource slices in node_modules, keeps only the game's characters, and merges them into one
woff2 per weight in src/fonts/, plus src/fonts/zh-chars.txt (the characters covered).
"""
import glob, os, re, sys
from fontTools import subset
from fontTools.merge import Merger
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'node_modules/@fontsource/noto-sans-sc')
OUT = os.path.join(ROOT, 'src/fonts')
WEIGHTS = [400, 500, 700]
SKIP = ('strokes', 'hanzi-writer')

def game_chars():
    files = glob.glob(os.path.join(ROOT, 'src/**/*.js'), recursive=True) + glob.glob(os.path.join(ROOT, 'content/**/*.*'), recursive=True) + [os.path.join(ROOT, 'index.html')]
    chars = set()
    for f in files:
        if any(s in f for s in SKIP): continue
        chars |= {ord(c) for c in open(f, encoding='utf8').read() if ord(c) > 0x7f}
    chars |= set(range(0x3000, 0x3040)) | set(range(0xff01, 0xff5f))   # CJK punctuation and full-width forms
    return chars

def slices(weight):
    css = open(os.path.join(SRC, f'{weight}.css'), encoding='utf8').read()
    for block in re.findall(r'@font-face\s*{(.*?)}', css, re.S):
        url = re.search(r'url\(\./files/([^)]+\.woff2)\)', block).group(1)
        ranges = []
        for part in re.search(r'unicode-range:\s*([^;]+);', block).group(1).split(','):
            a, _, z = part.strip()[2:].partition('-')
            ranges.append((int(a, 16), int(z or a, 16)))
        yield os.path.join(SRC, 'files', url), ranges

def build(weight, chars):
    parts, covered = [], set()
    for path, ranges in slices(weight):
        hit = sorted(c for c in chars if any(a <= c <= z for a, z in ranges))
        if not hit: continue
        font = TTFont(path)
        cmap = font.getBestCmap()
        hit = [c for c in hit if c in cmap]
        if not hit: continue
        opts = subset.Options(); opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
        sub = subset.Subsetter(opts); sub.populate(unicodes=hit); sub.subset(font)
        tmp = os.path.join(OUT, f'.part-{weight}-{len(parts)}.ttf'); font.flavor = None; font.save(tmp)
        parts.append(tmp); covered |= set(hit)
    merged = Merger().merge(parts)
    merged.flavor = 'woff2'
    out = os.path.join(OUT, f'noto-sans-sc-{weight}.woff2'); merged.save(out)
    for p in parts: os.remove(p)
    return out, covered

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    chars = game_chars()
    covered_all = None
    for w in WEIGHTS:
        out, covered = build(w, chars)
        covered_all = covered if covered_all is None else covered_all & covered
        print(f'{os.path.relpath(out, ROOT)}: {len(covered)} characters, {os.path.getsize(out) // 1024} KB')
    zh = ''.join(chr(c) for c in sorted(covered_all) if c >= 0x2e80)
    open(os.path.join(OUT, 'zh-chars.txt'), 'w', encoding='utf8').write(zh + '\n')
    missing = [chr(c) for c in chars if 0x3400 < c < 0x9fff and c not in covered_all]   # the ends are regex bounds in code
    if missing: print('Not in Noto Sans SC:', ''.join(missing)); sys.exit(1)
