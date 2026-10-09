// Builds the Learn step for a word set (CONCEPT §2.1): intro cards, then quick drills.
// Pure logic, no DOM, so it can be unit-tested. Words are { id, h, p, m, n } (n = numbered pinyin, e.g. "bei1 zi5").
//
// Drill kinds (skill label in brackets):
//   pick   [Reading]   see the characters, pick the meaning
//   hear   [Listening] hear the word, pick the characters   (silent mode: see the pinyin instead)
//   tone   [Tones]     see and hear the word, pick the right tones
//   trace  [Writing]   trace a character over its outline
export const CHUNK = 4;

const shuffle = (a, rng) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// n-1 distractors from the pool, avoiding duplicates of the shown value
export function distractors(word, pool, n, key, rng) {
  const seen = new Set([word[key]]);
  return shuffle(pool, rng).filter((w) => w.id !== word.id && !seen.has(w[key]) && seen.add(w[key])).slice(0, n);
}

// Same syllables, other tones: "bei1 zi5" → ["bei3 zi5", "bei4 zi5", …]
export function toneVariants(n, count, rng) {
  const syl = String(n).trim().split(/\s+/);
  const out = new Set();
  let guard = 0;
  while (out.size < count && guard++ < 50) {
    const v = syl.map((s, i) => {
      const m = s.match(/^([a-zü:v]+)(\d)$/i); if (!m) return s;
      const change = syl.length === 1 || i === Math.floor(rng() * syl.length) || rng() < 0.3;
      if (!change || m[2] === '5') return s;
      let t; do { t = 1 + Math.floor(rng() * 4); } while (String(t) === m[2]);
      return m[1] + t;
    }).join(' ');
    if (v !== syl.join(' ')) out.add(v);
  }
  return [...out];
}

export function buildLearnQueue(words, { pool = [], rng = Math.random, silent = false, traceable = () => true, maxTrace = 2 } = {}) {
  const items = [];
  const opts = [...words, ...pool];
  let traced = 0;
  for (let c = 0; c < words.length; c += CHUNK) {
    const chunk = words.slice(c, c + CHUNK);
    chunk.forEach((w) => items.push({ t: 'intro', w }));
    const drills = [];
    chunk.forEach((w, i) => {
      drills.push({ t: 'pick', w, options: shuffle([w, ...distractors(w, opts, 2, 'm', rng)], rng) });
      drills.push({ t: 'hear', w, silent, options: shuffle([w, ...distractors(w, opts, 2, 'h', rng)], rng) });
      if (w.n && (i % 2 === 0 || [...w.h].length > 1)) {
        const vs = toneVariants(w.n, 2, rng);
        if (vs.length) drills.push({ t: 'tone', w, options: shuffle([w.n, ...vs], rng) });
      }
      if (traced < maxTrace && [...w.h].length === 1 && traceable(w.h)) { drills.push({ t: 'trace', w }); traced++; }
    });
    items.push(...shuffle(drills, rng));
  }
  return items;
}

// A missed item comes back two items later, until it is answered right (天天's confirm-box flow).
export function requeue(queue, index, item, gap = 2) {
  queue.splice(Math.min(queue.length, index + 1 + gap), 0, { ...item, retry: true });
}
