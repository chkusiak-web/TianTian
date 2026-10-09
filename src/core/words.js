// Word states (CONCEPT §6.5): unseen → seen → caught → mastered, and lapsed when a caught word is missed in review.
import { learnWord, overdueDays } from './srs.js';

export const MASTER_IVL = 21;      // days
export const MASTER_GRACE = 7;     // overdue by more than this and it stops counting as mastered

export function stateOf(S, id) {
  const w = S.words[id];
  if (!w) return S.seen[id] ? 'seen' : 'unseen';
  if (w.lapses > 0 && w.ivl === 0) return 'lapsed';
  if (w.ivl >= MASTER_IVL && overdueDays(S, id) <= MASTER_GRACE) return 'mastered';
  return 'caught';
}
export const isCaught = (S, id) => !!S.words[id];

// First right answer anywhere: the word is caught and enters spaced review. Returns true if it was new.
export function catchWord(S, id) {
  S.seen[id] = true;
  return learnWord(S, id, 1);
}
export function markSeen(S, ids) { for (const id of ids) if (!S.words[id]) S.seen[id] = true; }

// Sentences a word was met in (feeds the context cards in Refresh). Keeps the 3 most recent, no duplicates.
export function addCtx(S, id, zh, src) {
  const list = (S.ctx[id] ||= []);
  if (list.some((c) => c.zh === zh)) return;
  list.unshift({ zh, src }); list.length = Math.min(list.length, 3);
}
