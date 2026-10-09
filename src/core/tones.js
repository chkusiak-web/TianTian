// Tone options for the tone drill: the right pinyin plus up to three with other tones (as 天天's toneOptions),
// worked out from the tone-marked pinyin so it also works for taught words that have no numbered pinyin.
const MARKS = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', ü: 'ǖǘǚǜ' };
const UNMARK = {};
for (const [v, m] of Object.entries(MARKS)) [...m].forEach((c, i) => (UNMARK[c] = [v, i + 1]));

export function parseSyllable(s) {
  let tone = 5, base = '';
  for (const c of s) { if (UNMARK[c]) { base += UNMARK[c][0]; tone = UNMARK[c][1]; } else base += c; }
  return [base, tone];
}
export function markSyllable(base, tone) {
  if (tone === 5) return base;
  const at = base.includes('a') ? base.indexOf('a') : base.includes('e') ? base.indexOf('e') : base.includes('ou') ? base.indexOf('o')
    : Math.max(...['i', 'o', 'u', 'ü'].map((v) => base.lastIndexOf(v)));
  if (at < 0) return base;
  return base.slice(0, at) + MARKS[base[at]][tone - 1] + base.slice(at + 1);
}

// syllables as [base, tone]: from numbered pinyin ("bei1 zi5", as in 天天's word list) or tone-marked pinyin with spaces
export function syllables(py) {
  return String(py).trim().split(/\s+/).map((x) => {
    const m = x.match(/^([a-zü:v]+)([1-5])$/i);
    return m ? [m[1].replace(/v|u:/g, 'ü'), +m[2]] : parseSyllable(x);
  });
}

export function toneOptions(py, rnd = Math.random) {
  const syl = syllables(py);
  const show = (tones) => syl.map(([b], k) => markSyllable(b, tones[k])).join('');
  const real = syl.map((x) => x[1]), seen = new Set([real.join()]), out = [{ py: show(real), ok: true }];
  for (let guard = 0; out.length < 4 && guard < 200; guard++) {
    const t = real.slice(), k = Math.floor(rnd() * t.length);
    t[k] = 1 + Math.floor(rnd() * 4);
    if (t.length > 1 && rnd() < 0.35) { const j = Math.floor(rnd() * t.length); t[j] = 1 + Math.floor(rnd() * 4); }
    if (!seen.has(t.join())) { seen.add(t.join()); out.push({ py: show(t), ok: false }); }
  }
  return out;
}
