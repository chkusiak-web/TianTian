'use strict';
/* 天天 · Today's plan (~15 min): due reviews → a new level (or the pop quiz) → a story OR the next Jinan quest (alternating days;
   a short tones drill if neither is available). Steps tick off however you do them, in the plan or not.
   Weekly goals: plan finished on N days (Settings), 2 stories, 2 map stamps. */

let planRun = false;   // true while you're working through the plan (finish screens offer "Next in plan")
const WEEK_STORIES = 2, WEEK_STAMPS = 2;
function weekState() {
  if (!S.week || S.week.key !== isoWeek()) S.week = { key: isoWeek(), levels: 0, plans: 0, stories: 0, stamps: 0, hit: {} };
  if (S.weeklyGoal > 7) S.weeklyGoal = 5;
  const w = S.week; w.plans = w.plans || 0; w.stories = w.stories || 0; w.stamps = w.stamps || 0; w.hit = w.hit || {};
  return w;
}
function weekBump(kind) {
  const w = weekState(); w[kind]++;
  const goal = { plans: S.weeklyGoal, stories: WEEK_STORIES, stamps: WEEK_STAMPS }[kind];
  if (goal && w[kind] >= goal && !w.hit[kind]) {
    w.hit[kind] = true; const xp = kind === 'plans' ? 100 : 50; addXp(xp);
    if (kind === 'plans') S.stats.goalsHit++;
    setTimeout(() => toast(`Weekly goal reached · ${{ plans: 'plan days', stories: 'stories', stamps: 'stamps' }[kind]} · +${xp} XP`, 3600), 600);
  }
}

// ---------------------------------------------------------------- building today's plan
const dayNumber = () => Math.floor(new Date(today() + 'T12:00').getTime() / DAY);
function nextStoryFor() {
  if (typeof STORY_LIST === 'undefined') return null;
  return STORY_LIST.filter((s) => ['new', 'read'].includes(storyStatus(s))).sort((a, b) => a.hsk - b.hsk || storyKnown(b) - storyKnown(a))[0] || null;
}
function nextQuestFor() {
  if (typeof DISTRICTS === 'undefined') return null;
  for (const d of DISTRICTS) for (const q of d.quests) if (['open', 'in_progress'].includes(questState(d, q)) && JX.quests[q.id]) return { d, q };
  return null;
}
function buildPlan() {
  const steps = [], learned = learnedIds().length, due = dueIds().length;
  if (learned >= 4) steps.push(due ? { k: 'review', due: Math.min(due, 30) } : { k: 'review', min: 2 });
  steps.push(S.quizPending ? { k: 'quiz' } : { k: 'level', n: nextLevel().n, fresh: LEVELS[nextLevel().n - 1].ids.filter((id) => !S.words[id]).length });
  if (learned >= 4) {
    const st = nextStoryFor(), qu = nextQuestFor();
    const storyDay = dayNumber() % 2 === 0;
    const pickStory = () => st && { k: 'story', id: st.id };
    const pickQuest = () => qu && { k: 'quest', did: qu.d.id, qid: qu.q.id };
    steps.push((storyDay ? pickStory() || pickQuest() : pickQuest() || pickStory()) || { k: 'tones' });
  }
  steps.forEach((s) => (s.done = false));
  S.plan = { date: today(), steps, complete: false };
  save();
}
function planToday() { if (!S.plan || S.plan.date !== today()) buildPlan(); return S.plan; }
function stepInfo(s) {
  switch (s.k) {
    case 'review': return { hz: '复', t: 'Review', d: s.due ? `${s.due} word${s.due > 1 ? 's' : ''} due` : '2-minute round', m: s.due ? Math.max(2, Math.min(5, Math.ceil((s.due * 7) / 60))) : 2 };
    case 'level': return { hz: '学', t: `Level ${s.n}`, d: s.fresh ? `${s.fresh} new words` : 'practice', m: 6 };
    case 'quiz': return { hz: '测', t: 'Pop quiz', d: 'about 10 questions', m: 4 };
    case 'story': { const st = (window.STORIES || []).find((x) => x.id === s.id); return { hz: '故', t: 'Story', d: st ? st.title[0] : '', zh: true, m: 5 }; }
    case 'quest': { const f = findQuest(s.qid); return { hz: '城', t: 'Jinan quest', d: f ? `${f.q.title} · ${CHARS[f.q.character].zh}` : '', m: 5 }; }
    default: return { hz: '声', t: 'Tones', d: 'hear it, pick the tones', m: 3 };
  }
}
// a step is done when you do that kind of thing today, in the plan or not
function planMark(kind, id) {
  const p = planToday();
  const s = p.steps.find((x) => !x.done && x.k === kind);
  if (s) s.done = true;
  if (!p.complete && p.steps.every((x) => x.done)) { p.complete = true; weekBump('plans'); setTimeout(() => toast("Today's plan complete · 今天完成了!", 3600), 300); }
  save();
}
function planNextStep() { const p = planToday(); return p.steps.find((x) => !x.done) || null; }
function planGo() {
  const s = planNextStep(); if (!s) { planRun = false; return home(); }
  planRun = true;
  if (s.k === 'review') return startReview(dueIds().length ? 0 : 2);
  if (s.k === 'level' || s.k === 'quiz') return S.quizPending ? startQuiz() : startLevel(nextLevel().n);
  if (s.k === 'story') { const st = (window.STORIES || []).find((x) => x.id === s.id); if (st && storyStatus(st) !== 'done') return stOpen(s.id); s.done = true; save(); return planGo(); }
  if (s.k === 'quest') {
    const f = findQuest(s.qid);
    if (f && ['open', 'in_progress'].includes(questState(f.d, f.q))) return jDistrict(f.d.id, f.q.id);
    s.done = true; save(); return planGo();
  }
  return startTones();
}
// On a finish screen: offer the next step of the plan (if you're working through it).
function planButton() {
  if (!planRun) return;
  const next = planNextStep(), acts = root.querySelector('.reward .actions');
  if (!acts) return;
  if (!next) { planRun = false; acts.insertAdjacentHTML('beforebegin', goldNote("Today's plan complete · 今天完成了!")); return; }
  const inf = stepInfo(next);
  acts.querySelectorAll('.btn-primary').forEach((b) => b.remove());
  acts.insertAdjacentHTML('beforeend', `<button class="btn-primary" id="plannext">Next: ${esc(inf.t)} <kbd>↵</kbd></button>`);
  root.querySelector('#plannext').addEventListener('click', planGo);
  const prev = keyHandler;
  keyHandler = (e) => { if (e.key === 'Enter') return planGo(); if (e.key === 'Escape') { planRun = false; return go('home'); } prev && prev(e); };
}

// ---------------------------------------------------------------- the fallback step: a short tones + hear-the-character drill
function startTones() {
  const pool = shuffle(learnedIds().filter((id) => W[id] && W[id].n && W[id].hsk)).slice(0, 10);
  if (!pool.length) { planMark('tones'); return planGo(); }
  const items = pool.map((id, k) => ({ t: k % 3 === 2 ? 'hearzi' : 'tone', id }));
  sess = { type: 'plan', items, i: 0, start: Date.now(), xp: 0, right: 0, wrong: 0, retried: new Set(), missed: {}, combo: 0, bestCombo: 0 };
  nextItem();
}
function finishTones() {
  const s = sess; sess = null;
  const firsts = s.items.filter((x) => !x.retry), ok = firsts.filter((x) => x.firstOk).length;
  planMark('tones'); markPractice(); const got = checkBadges(); save();
  render(`<div class="reward"><div class="col">
    ${rewardHero({ label: 'Tones · 声调', head: `${ok} / ${firsts.length}`, sub: 'heard right the first time', art: heroSaying(SAYINGS[0]), say: SAYINGS[0] })}
    <div class="stats4">${statCard('First try', `${ok} / ${firsts.length}`)}${statCard('XP earned', '+' + s.xp)}${statCard('Time', fmtTime(Date.now() - s.start))}${statCard('Missed', Object.keys(s.missed).length)}</div>
    ${got.map(badgeNote).join('')}
    <div class="actions"><button class="btn-secondary" data-go="home">Home <kbd>Esc</kbd></button><button class="btn-primary" id="again">Again <kbd>↵</kbd></button></div>
  </div></div>`, (e) => { if (e.key === 'Enter') startTones(); if (e.key === 'Escape') go('home'); }, () => on('#again', 'click', startTones));
  planButton();
}

// ---------------------------------------------------------------- the home block
function planBlock() {
  const p = planToday(), n = p.steps.filter((s) => s.done).length, next = planNextStep();
  const mins = p.steps.reduce((a, s) => a + stepInfo(s).m, 0);
  const rows = p.steps.map((s, i) => {
    const inf = stepInfo(s);
    return `<div class="prow2 ${s.done ? 'done' : s === next ? 'next' : ''}"><span class="pk">${s.done ? '✓' : esc(inf.hz)}</span>
      <span class="pt"><b>${esc(inf.t)}</b> · <span class="${inf.zh ? 'kai' : ''}">${esc(inf.d)}</span></span><span class="pm">${inf.m} min</span></div>`;
  }).join('');
  const btn = !next ? `<button class="btn-primary" id="plango">Extra review <kbd>↵</kbd></button>`
    : `<button class="btn-primary" id="plango">${n ? `Continue · ${esc(stepInfo(next).t)}` : 'Begin learning'} <kbd>↵</kbd></button>`;
  return `<div class="block planblock">
      ${brush('今日', 'font-size:150px;right:-10px;bottom:-56px;top:auto;color:var(--paper);opacity:.2')}
      <div class="label">Today's plan · 今日 · about ${mins} min</div>
      <div class="planrows">${rows}</div>
      <div class="sub">${next ? `${n} of ${p.steps.length} done` : 'All done today · 今天完成了!'}</div>
      ${btn}
    </div>`;
}
function planStart() { const next = planNextStep(); if (next) planGo(); else { planRun = false; startReview(dueIds().length ? 0 : 2); } }
function weekGoalsHtml() {
  const w = weekState();
  const row = (label, v, goal) => `<div class="wgoal"><span>${label}</span><b>${Math.min(v, goal)} / ${goal}</b><div class="bar thin gold"><i style="width:${Math.min(100, Math.round((v / goal) * 100))}%"></i></div></div>`;
  return `<div class="label wglabel">This week</div>${row('Plan days', w.plans, S.weeklyGoal)}${row('Stories', w.stories, WEEK_STORIES)}${row('Map stamps', w.stamps, WEEK_STAMPS)}`;
}
