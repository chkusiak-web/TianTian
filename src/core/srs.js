// 天天's spaced repetition, unchanged in its rules (learnWord, grade, mastery),
// but working on a state object and the shared clock instead of globals and Date.now().
import { now, DAY } from './clock.js';

export function learnWord(S, id, ivlDays = 1) {
  if (S.words[id]) return false;
  S.words[id] = { reps: 1, ease: 2.5, ivl: ivlDays, due: now() + ivlDays * DAY - 3600000, lapses: 0, ok: 0, bad: 0, at: now() };
  return true;
}

export function grade(S, id, good) {
  const w = S.words[id]; if (!w) return;
  if (good) {
    w.ok++; w.reps++;
    w.ivl = Math.max(w.ivl, w.ivl < 1 ? 1 : w.reps <= 2 ? 3 : Math.round(w.ivl * w.ease));   // a correct answer never shortens the gap
    w.ease = Math.min(3, w.ease + 0.05);
    w.due = now() + w.ivl * DAY - 3600000;
  } else {
    w.bad++; w.lapses++; w.reps = 0; w.ivl = 0;
    w.ease = Math.max(1.3, w.ease - 0.2);
    w.due = now() + 10 * 60000;
  }
}

export const learnedIds = (S) => Object.keys(S.words);
export const dueIds = (S) => learnedIds(S).filter((id) => S.words[id].due <= now()).sort((a, b) => S.words[a].due - S.words[b].due);
export const mastery = (S, id) => { const w = S.words[id]; if (!w) return 0; const v = w.ivl; return v >= 60 ? 5 : v >= 21 ? 4 : v >= 7 ? 3 : v >= 3 ? 2 : v >= 1 ? 1 : 0; };
export const overdueDays = (S, id) => Math.max(0, (now() - S.words[id].due) / DAY);
