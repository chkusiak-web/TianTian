// Word states for the collection (CONCEPT §6.5): unseen → seen → caught → mastered, and lapsed.
// A word is caught once it has an SRS record. A word you missed before catching it waits in `pending`:
// it comes back in the next Refresh, and the first right answer there catches it.
import { learnWord, grade, mastery, overdueDays } from './srs.js';

export function stateOf(S, id) {
  const w = S.words[id];
  if (!w) return S.seen[id] ? 'seen' : 'unseen';
  if (w.lapses && w.reps === 0) return 'lapsed';
  if (mastery(S, id) >= 4 && overdueDays(S, id) <= 7) return 'mastered';
  return 'caught';
}
export const isCaught = (S, id) => !!S.words[id];

export function markSeen(S, id) { if (!S.words[id]) S.seen[id] = true; }

// a right answer anywhere: catches a new word, or counts as a review if it is due
export function answeredRight(S, id) {
  if (!S.words[id]) { learnWord(S, id, 1); S.seen[id] = true; delete S.pending[id]; return 'caught'; }
  return null;
}
export function answeredWrong(S, id) {
  if (!S.words[id]) { S.seen[id] = true; S.pending[id] = true; return 'pending'; }
  return null;
}

// a Refresh card: due words are graded; pending words are caught on a right answer
export function refreshMark(S, id, good) {
  if (!S.words[id]) return good ? answeredRight(S, id) : answeredWrong(S, id);
  grade(S, id, good); return good ? 'graded' : 'lapsed';
}
export const pendingIds = (S) => Object.keys(S.pending || {}).filter((id) => !S.words[id]);

// sentences a word was met in, for the context cards in Refresh (newest first, three at most)
export function addCtx(S, id, zh, en) {
  const list = (S.ctx[id] ||= []);
  if (list.some((c) => c.zh === zh)) return;
  list.unshift({ zh, en }); list.length = Math.min(list.length, 3);
}
