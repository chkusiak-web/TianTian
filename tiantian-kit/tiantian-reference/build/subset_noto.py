# Subset Noto Sans SC Black to the CJK characters the app's UI uses (display font is for fixed labels only).
import re, glob
from fontTools.ttLib import TTFont
from fontTools import subset
txt = ''.join(open(p, encoding='utf8').read() for p in ['/home/claude/mandarin/app/app.js', '/home/claude/mandarin/app/index.html', '/home/claude/mandarin/app/jinan.js', '/home/claude/mandarin/app/data/jinan.js'])
chars = set(c for c in txt if ord(c) > 0x2E80) | set('天早上好中午下晚星期一二三四五六日学复奖故城连胜')
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
f = TTFont('/home/claude/fontsrc/NotoSansSC-900-full.ttf')
s = subset.Subsetter(opts); s.populate(text=''.join(sorted(chars)) + '0123456789!·'); s.subset(f)
f.flavor = 'woff2'; f.save('/home/claude/mandarin/app/fonts/NotoSansSC-900.woff2')
print(len(chars), 'glyphs')
