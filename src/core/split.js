// Greedy longest-match split into words, as 天天 does for hover. Shared by the browser (lexicon.js) and the
// Node validator, so the notebook and the checks see the same words.
export const HAN = /[㐀-鿿]/;
export function makeSplitter(has) {
  return function splitWords(text) {
    const s = [...text], out = []; let i = 0;
    while (i < s.length) {
      if (!HAN.test(s[i])) { let j = i; while (j < s.length && !HAN.test(s[j])) j++; out.push({ t: s.slice(i, j).join('') }); i = j; continue; }
      let len = Math.min(6, s.length - i);
      while (len > 1 && !has(s.slice(i, i + len).join(''))) len--;
      out.push({ t: s.slice(i, i + len).join(''), w: true }); i += len;
    }
    return out;
  };
}
// Han-only word list of a sentence (punctuation dropped)
export const wordsOf = (split, text) => split(text).filter((p) => p.w).map((p) => p.t);
