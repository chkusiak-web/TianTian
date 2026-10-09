// "Close enough" for built answers (Moondog, Oct 9): an answer that says the same thing counts as right,
// even if it isn't word for word the model answer. Pure, so it can be unit-tested.
//   exact  the words match the model answer or one of its `accept` answers
//   close  they match once small differences are ignored:
//            - a word said twice in a row (不，不 ≈ 不)
//            - softening particles (吧 啊 呀 呢) and the step's own `optional` words
//          Word order and every other word still count, so the words the prompt is about must be there.
//   near   not quite: one word missing or extra, or the right words in the wrong order (CONCEPT §6.11 rule 4).
//          Outside a challenge the NPC recasts it (says it back correctly) instead of marking it wrong.
//          A missing or extra negation (不 没 没有) is never near: it flips the meaning.
//   wrong  anything else
export const SOFT = ['吧', '啊', '呀', '呢'];

const norm = (words, optional) => words.filter((w, i) => w !== words[i - 1]).filter((w) => !optional.includes(w));

export function judgeBuild(got, answers, { optional = [] } = {}) {
  const key = (ws) => ws.join('|');
  if (answers.some((a) => key(a) === key(got))) return 'exact';
  const opt = [...SOFT, ...optional];
  const g = key(norm(got, opt));
  if (g && answers.some((a) => key(norm(a, opt)) === g)) return 'close';
  const gn = norm(got, opt);
  if (gn.length && answers.some((a) => isNear(gn, norm(a, opt)))) return 'near';
  return 'wrong';
}

const NEG = ['不', '没', '没有'];
const sorted = (ws) => [...ws].sort().join('|');
// b with one word taken out gives a?
const oneOut = (long, short) => long.length === short.length + 1 && long.some((w, i) => !NEG.includes(w) && [...long.slice(0, i), ...long.slice(i + 1)].join('|') === short.join('|'));
function isNear(got, ans) {
  if (got.length === ans.length && got.length > 1) return sorted(got) === sorted(ans);
  return oneOut(ans, got) || oneOut(got, ans);
}
