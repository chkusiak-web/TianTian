// "Close enough" for built answers (Moondog, Oct 9): an answer that says the same thing counts as right,
// even if it isn't word for word the model answer. Pure, so it can be unit-tested.
//   exact  the words match the model answer or one of its `accept` answers
//   close  they match once small differences are ignored:
//            - a word said twice in a row (不，不 ≈ 不)
//            - softening particles (吧 啊 呀 呢) and the step's own `optional` words
//          Word order and every other word still count, so the words the prompt is about must be there.
//   wrong  anything else
export const SOFT = ['吧', '啊', '呀', '呢'];

const norm = (words, optional) => words.filter((w, i) => w !== words[i - 1]).filter((w) => !optional.includes(w));

export function judgeBuild(got, answers, { optional = [] } = {}) {
  const key = (ws) => ws.join('|');
  if (answers.some((a) => key(a) === key(got))) return 'exact';
  const opt = [...SOFT, ...optional];
  const g = key(norm(got, opt));
  if (g && answers.some((a) => key(norm(a, opt)) === g)) return 'close';
  return 'wrong';
}
