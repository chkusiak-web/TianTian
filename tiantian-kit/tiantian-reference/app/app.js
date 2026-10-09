'use strict';
/* 天天 Tiāntiān — every day, a little Chinese. Phase 1: Levels, Review, game layer.
   Visual layer follows BRAND.md v1: loud shell (Home, rewards, badges) + quiet drills. */

const W = window.WORDS;            // ordered: curated everyday words, then HSK 1→3 by frequency
const STROKES = window.STROKES;
const bridge = window.api || mockApi();
const root = document.getElementById('root');
const DAY = 86400000;

// ---------------------------------------------------------------- brand colors (for SVG + stroke writer)
const C = { paper: '#F2EEE3', raised: '#FBF9F3', ink: '#151412', red: '#D2321C', redText: '#B02A16', gold: '#E3A23B', spring: '#2E7466', stone: '#D8D0BE', smoke: '#5E584C' };

// ---------------------------------------------------------------- icons (stroke icons, 1.8px)
const ic = (d, extra = '') => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const I = {
  speaker: ic('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>'),
  mic: ic('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  compare: ic('<path d="M7 4v16M17 4v16M3 8h8M13 16h8"/>'),
  pen: ic('<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 7l3 3"/>'),
  bulb: ic('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),
  clear: ic('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  play: ic('<path d="M7 5l12 7-12 7V5z"/>'),
  gear: ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  back: ic('<path d="M15 5l-7 7 7 7"/>'),
  x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  list: ic('<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>')
};

// 田字格: square with dashed vermilion center lines (~40%)
const tzg = `<svg class="tzg" viewBox="0 0 100 100" preserveAspectRatio="none"><g stroke="${C.red}" stroke-opacity=".4" stroke-width=".6" stroke-dasharray="2.4 2.4" vector-effect="non-scaling-stroke"><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg>`;
// Seal logo: vermilion square, paper inset border, 天 over 天
const seal = (cls = 'seal') => `<svg class="${cls}" viewBox="0 0 48 48" aria-label="天天"><rect width="48" height="48" rx="7" fill="${C.red}"/><rect x="3.5" y="3.5" width="41" height="41" rx="4.5" fill="none" stroke="${C.paper}" stroke-width="2"/><g font-family="Noto Sans SC Display" font-weight="900" font-size="17" fill="${C.paper}" text-anchor="middle"><text x="24" y="22.5">天</text><text x="24" y="39.5">天</text></g></svg>`;
// Completed-level stamp: vermilion square + paper check
const stamp = `<svg class="stamp" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="${C.red}"/><path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="${C.paper}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
// Tea cups 茶杯 (streak unit) — brand SVGs used as-is.
const CUP = { studied: ['cup-studied', 'Studied'], frozen: ['cup-frozen', 'Streak freeze'], none: ['cup-not-yet', 'Not yet'] };
const cup = (state, h = 46) => `<img class="cup" src="img/${CUP[state][0]}.svg" alt="${CUP[state][1]}" style="height:${h}px">`;

// Sayings 格言: brush script on loud screens only, always with the Kaiti line + English.
const SAYINGS = [
  ['天天向上', 'tiān tiān xiàng shàng', 'Improve every day.'],
  ['熟能生巧', 'shú néng shēng qiǎo', 'Practice makes perfect.'],
  ['滴水穿石', 'dī shuǐ chuān shí', 'Dripping water wears through stone.'],
  ['循序渐进', 'xún xù jiàn jìn', 'Step by step.'],
  ['勤能补拙', 'qín néng bǔ zhuō', 'Hard work makes up for lack of talent.'],
  ['锲而不舍', 'qiè ér bù shě', 'Keep carving, never give up.'],
  ['学无止境', 'xué wú zhǐ jìng', 'Learning has no end.'],
  ['千里之行，始于足下', 'qiān lǐ zhī xíng, shǐ yú zú xià', 'A journey of a thousand miles begins with a single step.']
];
const REVIEW_SAYING = ['温故知新', 'wēn gù zhī xīn', 'Review the old to learn the new.'];
function sayingOfDay() {
  if (!S.firstDay) { S.firstDay = today(); save(); }
  const n = Math.max(0, daysBetween(S.firstDay, today()));
  return SAYINGS[n % SAYINGS.length];
}
const sayCap = (sy, cls = '') => `<div class="saycap ${cls}"><span class="kai">${esc(sy[0])}</span> · <span class="en">${esc(sy[2])}</span></div>`;
// Big vertical brush saying: decoration only (aria-hidden), behind content, cropped by its parent.
const brush = (text, style) => `<div class="brush" aria-hidden="true" style="${style}">${esc(text).replace('，', '<br>')}</div>`;
const dragon = (file, style) => `<img class="dragon" src="img/${file}.svg" alt="" style="${style}">`;

// ---------------------------------------------------------------- utilities
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickN = (a, n) => shuffle(a).slice(0, n);
const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / DAY);
const hanChars = (s) => [...s].filter((c) => /\p{Script=Han}/u.test(c) && STROKES[c]);
const fmtTime = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const pad2 = (n) => String(n).padStart(2, '0');
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${Math.ceil(((t - y) / DAY + 1) / 7)}`;
}
function toast(msg, ms = 2600) {
  const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), ms);
}

// ---------------------------------------------------------------- levels
const LEVELS = [];
for (const hsk of [1, 2, 3]) {
  const ids = W.filter((w) => w.hsk === hsk).map((w) => w.id);
  for (let i = 0; i < ids.length; i += 5) LEVELS.push({ n: LEVELS.length + 1, hsk, ids: ids.slice(i, i + 5) });
}

// ---------------------------------------------------------------- state
const DEFAULT = () => ({
  v: 2, words: {}, levelsDone: {}, xp: 0,
  streak: { count: 0, last: '', freezes: 3, best: 0 },
  days: [], frozen: [], firstDay: '',
  check: null, quizPending: false, quizzes: [],
  jinan: {}, extraWords: [],
  week: { key: isoWeek(), levels: 0, goalHit: false }, weeklyGoal: 5,
  bests: { review2: 0, review5: 0, combo: 0 },
  badges: {},
  stats: { levels: 0, reviews: 0, drawn: 0, recordings: 0, typed: 0, placementPassed: 0, goalsHit: 0, perfectQuizzes: 0 },
  settings: { voice: '', rate: 'normal', reminderOn: false, reminderTime: '19:00', openAtLogin: false, imeTipSeen: false }
});
let S = DEFAULT();
let saveTimer = null;
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => bridge.save(S), 250); }
function merge(base, d) {
  for (const k of Object.keys(d || {})) {
    if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k]) && base[k] && typeof base[k] === 'object') merge(base[k], d[k]);
    else base[k] = d[k];
  }
  return base;
}

// ---------------------------------------------------------------- spaced repetition (unchanged)
function learnWord(id, ivlDays = 1) {
  if (S.words[id]) return;
  S.words[id] = { reps: 1, ease: 2.5, ivl: ivlDays, due: Date.now() + ivlDays * DAY - 3600000, lapses: 0, ok: 0, bad: 0, at: Date.now() };
}
function grade(id, good) {
  const w = S.words[id]; if (!w) return;
  if (good) {
    w.ok++; w.reps++;
    w.ivl = Math.max(w.ivl, w.ivl < 1 ? 1 : w.reps <= 2 ? 3 : Math.round(w.ivl * w.ease));   // a correct answer never shortens the gap
    w.ease = Math.min(3, w.ease + 0.05);
    w.due = Date.now() + w.ivl * DAY - 3600000;
  } else {
    w.bad++; w.lapses++; w.reps = 0; w.ivl = 0;
    w.ease = Math.max(1.3, w.ease - 0.2);
    w.due = Date.now() + 10 * 60000;
  }
}
const learnedIds = () => Object.keys(S.words).map(Number);
const dueIds = () => learnedIds().filter((id) => S.words[id].due <= Date.now()).sort((a, b) => S.words[a].due - S.words[b].due);
const mastery = (id) => { const w = S.words[id]; if (!w) return 0; const v = w.ivl; return v >= 60 ? 5 : v >= 21 ? 4 : v >= 7 ? 3 : v >= 3 ? 2 : v >= 1 ? 1 : 0; };
const levelMastery = (lv) => lv.ids.reduce((a, id) => a + mastery(id), 0) / (lv.ids.length * 5);

// ---------------------------------------------------------------- game layer (unchanged rules)
// Ranks: Cricket → Dragon across HSK 1–4. Milestone ranks (gate) also need that HSK band finished.
const RANKS = [
  [0, '蟋蟀', 'Cricket'], [11000, '鼠', 'Rat'], [27000, '兔', 'Rabbit'], [46000, '鸡', 'Rooster', 1],
  [68000, '羊', 'Goat'], [90000, '狗', 'Dog'], [113000, '熊猫', 'Panda', 2], [142000, '猪', 'Pig'],
  [171000, '猴', 'Monkey'], [200000, '马', 'Horse', 3], [223000, '蛇', 'Snake'], [245000, '牛', 'Ox'],
  [266000, '虎', 'Tiger'], [287000, '龙', 'Dragon', 4]
];
const bandDone = (h) => LEVELS.filter((l) => l.hsk === h).every((l) => S.levelsDone[l.n]);
const rankOk = (r) => S.xp >= r[0] && (!r[3] || bandDone(r[3]));
function rank() {
  let i = 0; while (i + 1 < RANKS.length && rankOk(RANKS[i + 1])) i++;
  const [lo, hz, en, gate] = RANKS[i]; const next = RANKS[i + 1];
  const blocked = next && S.xp >= next[0] && next[3] && !bandDone(next[3]);
  return { i, hz, en, lo, milestone: !!gate, next: next ? next[0] : null, nextName: next ? next[2] : null,
    nextNote: !next ? 'Top rank' : blocked ? `Finish HSK ${next[3]} to become ${next[2]}` : `${(next[0] - S.xp).toLocaleString()} XP to ${next[2]}`,
    pct: next ? Math.min(1, (S.xp - lo) / (next[0] - lo)) : 1 };
}
function addXp(n) { if (sess && sess.mult) n = Math.round(n * sess.mult); S.xp += n; if (sess) sess.xp += n; }

const BADGES = [
  ['first', '第一步', 'First step', 'Finish your first level', () => S.stats.levels >= 1],
  ['lv10', '十', 'Ten levels', 'Finish 10 levels', () => S.stats.levels >= 10],
  ['lv25', '廿五', 'Quarter century', 'Finish 25 levels', () => S.stats.levels >= 25],
  ['lv50', '五十', 'Halfway to 100', 'Finish 50 levels', () => S.stats.levels >= 50],
  ['lv100', '百', 'One hundred', 'Finish 100 levels', () => S.stats.levels >= 100],
  ['w50', '词', 'Word collector', 'Learn 50 words', () => learnedIds().length >= 50],
  ['w150', '词汇', 'Vocabulary', 'Learn 150 words', () => learnedIds().length >= 150],
  ['w500', '五百', 'HSK 1 sized', 'Learn 500 words', () => learnedIds().length >= 500],
  ['hsk1', '一级', 'HSK 1 complete', 'Finish every HSK 1 level', () => LEVELS.filter((l) => l.hsk === 1).every((l) => S.levelsDone[l.n])],
  ['draw100', '书法', 'Calligrapher', 'Draw 100 characters', () => S.stats.drawn >= 100],
  ['draw500', '书法家', 'Master hand', 'Draw 500 characters', () => S.stats.drawn >= 500],
  ['rec50', '说话', 'Speaker', 'Record yourself 50 times', () => S.stats.recordings >= 50],
  ['type100', '打字', 'Typist', 'Type 100 words correctly', () => S.stats.typed >= 100],
  ['st7', '七天', 'One week', 'Reach a 7-day streak', () => S.streak.best >= 7],
  ['st30', '一个月', 'One month', 'Reach a 30-day streak', () => S.streak.best >= 30],
  ['combo20', '闪电', 'Lightning', 'Hit a 20 combo', () => S.bests.combo >= 20],
  ['rev500', '复习', 'Reviewer', 'Review 500 cards', () => S.stats.reviews >= 500],
  ['goal', '目标', 'On target', 'Hit your weekly goal', () => S.stats.goalsHit >= 1],
  ['skip', '跳级', 'Skipped ahead', 'Check off a block in the level check', () => S.stats.placementPassed >= 1],
  ['perfect', '满分', 'Full marks', 'Score 100% on a pop quiz', () => S.stats.perfectQuizzes >= 1],
  ['stamp1', '印', 'First stamp', 'Finish a quest in Jinan', () => Object.values((S.jinan && S.jinan.quests) || {}).some((q) => q.complete)],
  ['seal1', '城', 'District seal', 'Finish all 5 quests in a district', () => Object.keys((S.jinan && S.jinan.seals) || {}).length >= 1]
];
function checkBadges() {
  const got = [];
  for (const [id, hz, name, , test] of BADGES) if (!S.badges[id] && test()) { S.badges[id] = Date.now(); got.push({ hz, name }); }
  return got;
}
// Streak: a missed day breaks it unless you choose to spend freezes (asked when the app opens).
const FREEZE_MAX = 3;
function currentStreak() {
  const st = S.streak; if (!st.last || !st.count) return 0;
  return daysBetween(st.last, today()) <= 1 ? st.count : 0;
}
// Days missed since the last study day (not counting today). >0 means a decision is pending.
function missedDays() {
  const st = S.streak; if (!st.last || !st.count) return 0;
  return Math.max(0, daysBetween(st.last, today()) - 1);
}
function useFreezes() {
  const st = S.streak, n = missedDays(); if (!n || n > st.freezes) return false;
  for (let i = 1; i <= n; i++) { const d = new Date(st.last + 'T12:00'); d.setDate(d.getDate() + i); S.frozen.push(today(d)); }
  st.freezes -= n;
  const y = new Date(); y.setDate(y.getDate() - 1); st.last = today(y);   // streak now continues from yesterday
  save(); return true;
}
function endStreak() { S.streak.count = 0; save(); }
function markPractice() {
  const t = today(), st = S.streak;
  if (!S.days.includes(t)) { S.days.push(t); if (S.days.length > 800) S.days = S.days.slice(-800); }
  if (st.last === t) return false;
  st.count = st.last && st.count && daysBetween(st.last, t) === 1 ? st.count + 1 : 1;
  st.last = t;
  st.best = Math.max(st.best, st.count);
  bridge.setReminder({ lastPractice: t });
  return st.count % 7 === 0;   // streak milestone reached today
}
function weekLevels() { return S.week.key === isoWeek() ? S.week.levels : 0; }
function bumpWeek() {
  weekState();
  S.week.levels++;
  return false;   // the weekly goal is now plan days (plan.js)
}
const nextLevel = () => (LEVELS.find((l) => !S.levelsDone[l.n]) || LEVELS[LEVELS.length - 1]);
// Tea cups for this week (Mon–Sun): studied, frozen, or not yet.
function weekCups() {
  const now = new Date(); const dow = (now.getDay() + 6) % 7; const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now); d.setDate(now.getDate() - dow + i); const ds = today(d);
    const state = S.days.includes(ds) ? 'studied' : S.frozen.includes(ds) ? 'frozen' : 'none';
    out.push({ l: 'MTWTFSS'[i], state, today: i === dow });
  }
  return out;
}

// ---------------------------------------------------------------- audio
let nativeVoices = [];
async function initVoices() {
  try { nativeVoices = await bridge.voices(); } catch { nativeVoices = []; }
  if (!S.settings.voice && nativeVoices.length) {
    S.settings.voice = nativeVoices.find((v) => /premium/i.test(v)) || nativeVoices.find((v) => /enhanced/i.test(v)) || nativeVoices.find((v) => /tingting|婷婷/i.test(v)) || nativeVoices[0];
    save();
  }
}
function webVoice() {
  const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
  return vs.find((v) => v.name === S.settings.voice) || vs.find((v) => /zh[-_]CN/i.test(v.lang)) || vs.find((v) => /^zh/i.test(v.lang));
}
// Silent mode: no sound, no speaking/recording. Turns itself off at the start of each day.
function silentOn() { const m = S.settings.silent; return !!(m && m.on && m.date === today()); }
function setSilent(on) { S.settings.silent = { on, date: today() }; document.body.classList.toggle('silent', on); if (on) { try { bridge.stopSpeak(); } catch {} if (window.speechSynthesis) speechSynthesis.cancel(); } save(); }
async function speak(text) {
  if (silentOn()) return false;
  const slow = S.settings.rate === 'slow';
  if (nativeVoices.length) return bridge.speak({ text, voice: S.settings.voice, rate: slow ? 110 : 165 });
  return new Promise((res) => {
    if (!window.speechSynthesis) return res(false);
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; const v = webVoice(); if (v) u.voice = v;
    u.rate = slow ? 0.65 : 0.9;
    u.onend = u.onerror = () => res(true);
    speechSynthesis.speak(u);
  });
}

// ---------------------------------------------------------------- recording
const Rec = { mr: null, chunks: [], url: null, timer: null, on: false };
async function recStart(onUpdate) {
  try {
    await bridge.micAccess();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    Rec.chunks = []; Rec.mr = new MediaRecorder(stream); Rec.on = true;
    Rec.mr.ondataavailable = (e) => Rec.chunks.push(e.data);
    Rec.mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      if (Rec.url) URL.revokeObjectURL(Rec.url);
      Rec.url = URL.createObjectURL(new Blob(Rec.chunks, { type: Rec.mr.mimeType || 'audio/webm' }));
      Rec.on = false; S.stats.recordings++; save(); onUpdate();
      playRec();
    };
    Rec.mr.start(); onUpdate();
    Rec.timer = setTimeout(recStop, 5000);
  } catch (e) {
    Rec.on = false; onUpdate();
    toast('Microphone unavailable. Allow it in System Settings › Privacy & Security › Microphone.', 5000);
  }
}
function recStop() { clearTimeout(Rec.timer); if (Rec.mr && Rec.mr.state === 'recording') Rec.mr.stop(); }
function playRec() { return new Promise((res) => { if (!Rec.url) return res(); const a = new Audio(Rec.url); a.onended = a.onerror = res; a.play().catch(res); }); }
async function compare(text) { await speak(text); await new Promise((r) => setTimeout(r, 250)); await playRec(); }
function recReset() { recStop(); if (Rec.url) URL.revokeObjectURL(Rec.url); Rec.url = null; Rec.on = false; }

// ---------------------------------------------------------------- stroke writers
let writers = [];
function makeWriter(el, ch, opts = {}) {
  const size = el.clientWidth || 320;
  const w = HanziWriter.create(el, ch, Object.assign({
    width: size, height: size, padding: Math.round(size * 0.08),
    showCharacter: false, showOutline: true,
    strokeColor: C.ink, outlineColor: C.stone, drawingColor: C.ink, highlightColor: C.spring,
    radicalColor: null, drawingWidth: Math.max(8, Math.round(size / 15)),
    strokeAnimationSpeed: 1.4, delayBetweenStrokes: 120, strokeFadeDuration: 180,
    charDataLoader: (c, ok, err) => (STROKES[c] ? ok(STROKES[c]) : err('missing'))
  }, opts));
  writers.push(w); return w;
}
function clearWriters() { writers.forEach((w) => { try { w.cancelQuiz(); } catch {} }); writers = []; }

// ---------------------------------------------------------------- router + keys
let keyHandler = null;
let sess = null;
let tick = null;
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT';
  if (inInput && e.key !== 'Enter' && e.key !== 'Escape') return;
  if (e.isComposing || e.keyCode === 229) return;
  if (keyHandler) keyHandler(e);
});
function render(html, keys, after) {
  clearWriters(); clearInterval(tick); tick = null;
  root.innerHTML = html;
  // Chinese inside small labels: display face on loud screens, Kaiti in drills (via CSS).
  root.querySelectorAll('.label').forEach((el) => { el.innerHTML = el.innerHTML.replace(/([\u3400-\u9fff]+)/g, '<span class="zh">$1</span>'); });
  const m = root.querySelector('.main, .reward'); if (m) m.scrollTop = 0;
  keyHandler = keys || null;
  root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  document.body.classList.toggle('silent', silentOn());
  const sb = root.querySelector('#silentbtn');
  if (sb) sb.addEventListener('click', () => { setSilent(!silentOn()); sb.classList.toggle('on', silentOn()); sb.querySelector('.switch').classList.toggle('on', silentOn()); toast(silentOn() ? 'Silent mode on · reading and writing only' : 'Silent mode off'); });
  if (after) after();
}
function on(sel, ev, fn) { root.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, fn)); }
function go(where, arg) {
  if (window.speechSynthesis) speechSynthesis.cancel();
  planRun = false; HZ_LOCK = false;
  recReset();
  ({ home, levels, review: reviewStart, words, badges, settings, wordDetail, jinan: jCity, people: () => jPeople('side'), stories: () => stShelf() })[where](arg);
}

// ================================================================ LOUD SHELL
function shell(active, main, mainExtra = '') {
  const r = rank(), due = dueIds().length, nl = nextLevel();
  const nav = [
    ['home', '学', 'Learn'], ['review', '复', 'Review', due ? `<span class="count">${due}</span>` : ''],
    ['badges', '奖', 'Badges'], ['stories', '故', 'Stories'], ['jinan', '城', 'Jinan'], ['people', '人', 'People']
  ];
  return `<div class="shell">
    <aside class="side">
      <div class="couplet" aria-hidden="true"><span>千里之行</span><span>始于足下</span></div>
      <div class="brand">${seal()}<div><div class="t">Tiāntiān</div><div class="s">HSK 3.0 · Level ${nl.n}</div></div></div>
      <nav class="nav">${nav.map(([g, k, t, x = '']) => `<button ${g ? `data-go="${g}"` : ''} class="${g && g === active ? 'on' : ''} ${g ? '' : 'dim'}"><span class="k">${k}</span><span class="sp">${t}</span>${x}</button>`).join('')}</nav>
      <button class="silentbtn ${silentOn() ? 'on' : ''}" id="silentbtn" title="No sound, no speaking. Listening drills become reading drills. Turns off each new day."><span class="k">静</span><span class="sp">Silent mode</span><span class="switch sm ${silentOn() ? 'on' : ''}"></span></button>
      <div class="rankcard">
        <div class="label">Rank</div>
        <div class="rn">${r.hz}</div><div class="en">${r.en}</div>
        <div class="xp">${S.xp.toLocaleString()} XP</div>
        <div class="bar thin gold" style="margin-top:8px"><i style="width:${Math.round(r.pct * 100)}%"></i></div>
        <div class="nx">${r.nextNote}</div>
      </div>
      <div class="side-foot"><button data-go="words">${I.list} Words</button><button data-go="settings">${I.gear} Settings</button></div>
    </aside>
    <section class="main">${mainExtra}${main}</section>
  </div>`;
}
function tileHtml(lv, current) {
  const w = W[lv.ids[0]], done = !!S.levelsDone[lv.n];
  return `<button class="tile ${current ? 'current' : ''}" data-lv="${lv.n}" title="${esc(lv.ids.map((i) => W[i].h).join(' '))}">
    ${done ? stamp : current ? '<span class="now">NEXT</span>' : ''}
    <span class="w">${esc(w.h)}</span>
    <span class="tl">${pad2(lv.n)} · ${esc(w.m)}</span>
    <span class="bar thin spring"><i style="width:${Math.round(levelMastery(lv) * 100)}%"></i></span>
  </button>`;
}

// ---------------------------------------------------------------- home
function home() {
  sess = null;
  const now = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const zh = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const h = now.getHours(), greet = h < 12 ? '早上好!' : h < 18 ? '下午好!' : '晚上好!';
  const due = dueIds().length, learned = learnedIds().length, nl = nextLevel();
  const st = currentStreak(), wk = weekLevels(), goal = S.weeklyGoal;
  const band = LEVELS.filter((l) => l.hsk === nl.hsk);
  const bi = band.findIndex((l) => l.n === nl.n);
  const start = Math.max(0, Math.min(bi - 2, band.length - 8));
  const shown = band.slice(start, start + 8);
  const mins = Math.max(1, Math.ceil((due * 6) / 60));
  const heroBtn = !learned ? `<button class="btn-primary" id="hero">Start level 1 <kbd>↵</kbd></button>`
    : due ? `<button class="btn-primary" id="hero">Start review · ${mins} min <kbd>R</kbd></button>`
    : `<button class="btn-primary" id="hero">Practice · 2 min <kbd>R</kbd></button>`;
  const sy = sayingOfDay();
  const main = `
    <div class="hhead">
      <div><div class="label">${days[now.getDay()]} · ${zh[now.getDay()]}</div><div class="greet">${greet}</div>${sayCap(sy)}</div>
      <div class="bigstats">
        <button class="bigstat" data-go="words"><div class="num">${learned}</div><div class="label">Words learned</div></button>
        <div class="bigstat"><div class="num">${S.bests.combo}</div><div class="label">Best combo</div></div>
        <button class="bigstat" data-go="levels"><div class="num">${Object.keys(S.levelsDone).length}</div><div class="label">Levels done</div></button>
        <button class="bigstat" data-go="badges"><div class="num">${retention() === null ? '—' : retention() + '%'}</div><div class="label">Retention</div></button>
      </div>
    </div>
    <div class="hero">
      ${planBlock()}
      <div class="card streak">
        <div class="label">Streak · 连胜</div>
        <div class="row1"><span class="num">${st}</span><span class="u">${st === 1 ? 'day' : 'days'}</span></div>
        <div class="meta">Best ${S.streak.best} · ${S.streak.freezes} freeze${S.streak.freezes === 1 ? '' : 's'} left</div>
        <div class="cups">${weekCups().map((d) => `<div class="cupday ${d.today ? 'today' : ''}">${cup(d.state)}<span>${d.l}</span></div>`).join('')}</div>
        ${weekGoalsHtml()}
      </div>
    </div>
    <div class="sechead"><h2>HSK ${nl.hsk} · Levels</h2><div class="links"><button class="link" data-go="levels">All levels →</button><button class="link" id="place">${checkLabel()} →</button></div></div>
    <div class="tiles">${shown.map((l) => tileHtml(l, l.n === nl.n)).join('')}</div>`;
  const pending = missedDays();
  const quizNow = !pending && S.quizPending;
  render(shell('home', main, brush(sy[0], 'font-size:260px;right:-70px;top:30px;color:var(--ink);opacity:.07')) + (pending ? freezeAsk(pending) : quizNow ? quizAsk() : ''), (e) => {
    if (pending) { if (e.key === 'Enter') answerFreeze(true); if (e.key === 'Escape') answerFreeze(false); return; }
    if (quizNow) { if (e.key === 'Enter') startQuiz(); return; }
    if (e.key === 'Enter') planStart();
    if (e.key === 'l') startLevel(nextLevel().n);
    if (e.key === 'r' && learned) heroAction();
  }, () => {
    on('[data-lv]', 'click', (e) => startLevel(+e.currentTarget.dataset.lv));
    on('#place', 'click', () => startCheck());
    on('#plango', 'click', planStart);
    on('#fz-yes', 'click', () => answerFreeze(true));
    on('#fz-no', 'click', () => answerFreeze(false));
    on('#qz-go', 'click', startQuiz);
  });
  function answerFreeze(yes) { if (yes && useFreezes()) toast('Streak kept'); else endStreak(); home(); }
  function heroAction() { if (!learned) startLevel(nextLevel().n); else startReview(due ? 0 : 2); }
}

// Freeze prompt: shown on Home after missed days, until answered.
function freezeAsk(n) {
  const st = S.streak, can = st.freezes >= n;
  return `<div class="scrim"><div class="fzcard" role="dialog" aria-label="Streak freeze">
    <div class="label">Streak · 连胜</div>
    <div class="fzcups">${Array.from({ length: Math.min(n, 3) }, () => cup(can ? 'frozen' : 'none', 92)).join('')}</div>
    <h2>${can ? `Keep your ${st.count}-day streak?` : `Your ${st.count}-day streak ended`}</h2>
    <p>${can ? `You missed ${n} day${n > 1 ? 's' : ''}. Use ${n} freeze${n > 1 ? 's' : ''} to cover ${n > 1 ? 'them' : 'it'}. You have ${st.freezes} of ${FREEZE_MAX}.`
            : `You missed ${n} days and have ${st.freezes} freeze${st.freezes === 1 ? '' : 's'}. Today starts a new streak.`}</p>
    <div class="actions">${can ? `<button class="btn-secondary" id="fz-no">Let it reset <kbd>Esc</kbd></button><button class="btn-primary" id="fz-yes">Use ${n} freeze${n > 1 ? 's' : ''} <kbd>↵</kbd></button>`
            : `<button class="btn-primary" id="fz-no">Start fresh <kbd>↵</kbd></button>`}</div>
  </div></div>`;
}

function quizAsk() {
  return `<div class="scrim"><div class="fzcard" role="dialog" aria-label="Pop quiz">
    <div class="label">Pop quiz · 测验</div>
    <h2>Time for a pop quiz</h2>
    <p>About 10 questions on words you learned a few days ago: hear it, type it, draw it. Misses go straight back to Review.</p>
    <div class="actions"><button class="btn-primary" id="qz-go">Start quiz <kbd>↵</kbd></button></div>
  </div></div>`;
}

// ---------------------------------------------------------------- level list
function levels() {
  const nl = nextLevel().n;
  const main = `<div class="pagehead"><div class="label">HSK 3.0 · ${LEVELS.length} levels</div><h1>Levels</h1><p>Each level teaches 5 words in about 15 minutes. Everything is open.</p></div>
    <div class="sechead" style="margin-top:-8px"><span></span><button class="link" id="place">${checkLabel()} →</button></div>
    ${[1, 2, 3].map((h) => {
      const band = LEVELS.filter((l) => l.hsk === h);
      return `<div class="sechead" style="margin-top:26px"><h2>HSK ${h}</h2><span class="label">${band.filter((l) => S.levelsDone[l.n]).length} / ${band.length} done</span></div>
      <div class="tiles compact">${band.map((l) => tileHtml(l, l.n === nl)).join('')}</div>`;
    }).join('')}`;
  render(shell('home', main), (e) => { if (e.key === 'Escape') go('home'); }, () => {
    on('[data-lv]', 'click', (e) => startLevel(+e.currentTarget.dataset.lv));
    on('#place', 'click', () => startCheck());
  });
}

// ================================================================ QUIET DRILL SHELL
let HZ_LOCK = false;
// Four pinyin spellings of a word: the real tones + three with one or two syllables' tones changed.
function toneOptions(w) {
  const syl = String(w.n || '').trim().split(/\s+/).filter(Boolean).map((x) => { const m = x.match(/^(.*?)(\d)$/); return m ? [m[1], +m[2]] : [x, 5]; });
  const show = (tones) => syl.map(([b], k) => {
    const t = tones[k]; try { return window.pinyinPro.convert(`${b}${t === 5 ? '' : t}`, { format: 'numToSymbol' }).replace(/\d/g, ''); } catch { return b; }
  }).join('').replace(/v/g, 'ü');
  const real = syl.map((x) => x[1]), key = (t) => t.join(','), seen = new Set([key(real)]), out = [{ py: show(real), ok: true }];
  for (let guard = 0; out.length < 4 && guard < 200; guard++) {
    const t = real.slice(), k = Math.floor(Math.random() * t.length);
    t[k] = 1 + Math.floor(Math.random() * 4);
    if (t.length > 1 && Math.random() < 0.35) { const j = Math.floor(Math.random() * t.length); t[j] = 1 + Math.floor(Math.random() * 4); }
    if (!seen.has(key(t))) { seen.add(key(t)); out.push({ py: show(t), ok: false }); }
  }
  return out;
}
// A wrong answer: a box with the right answer that you confirm (Enter) before moving on.
function showWrong(w, onOk, yours) {
  const old = document.getElementById('wrongbox'); if (old) old.remove();
  const box = document.createElement('div');
  box.className = 'scrim wrongscrim'; box.id = 'wrongbox';
  box.innerHTML = `<div class="wrongcard" role="dialog" aria-label="Correct answer">
    <div class="label">Not quite · 正确答案</div>
    ${yours ? `<div class="wyours">You wrote <span class="kai">${esc(yours)}</span></div>` : ''}
    <div class="whz kai">${esc(w.h)}</div><div class="wpy">${esc(w.p)}</div><div class="wm">${esc(w.m)}</div>
    <div class="actions"><button class="btn-outline" id="wplay">${I.speaker} Listen <kbd>Space</kbd></button><button class="btn-primary" id="wok">Got it <kbd>↵</kbd></button></div>
    ${sess && ['level', 'quiz', 'plan'].includes(sess.type) ? `<div class="smoke wnote">It'll come back in a few cards.</div>` : ''}</div>`;
  root.appendChild(box);
  const prev = keyHandler;
  const close = () => { box.remove(); keyHandler = prev; onOk && onOk(); };
  keyHandler = (e) => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === ' ') { e.preventDefault(); speak(w.h); } };
  box.querySelector('#wok').addEventListener('click', close);
  box.querySelector('#wplay').addEventListener('click', () => speak(w.h));
  setTimeout(() => box.querySelector('#wok').focus(), 50);
}
function distractors(id, n, field) {
  const w = W[id];
  const pool = W.filter((x) => x.id !== id && x.m !== w.m && x.h !== w.h && (field !== 'h' || x.h.length === w.h.length));
  const near = pool.filter((x) => Math.abs(x.id - id) < 160);
  return pickN(near.length >= n ? near : pool, n);
}
function comboHtml(n) { return `<span class="combo ${n >= 2 ? '' : 'off'}" id="combo"><i></i>×${n} combo</span>`; }
function topbar() {
  if (sess.type === 'review') {
    const pct = sess.limit ? Math.min(1, (Date.now() - sess.start) / sess.limit) : sess.count / Math.max(1, sess.count + sess.queue.length + 1);
    return `<div class="topbar"><button class="icon-btn sm" id="quit" aria-label="Close">${I.x}</button>
      <div class="bar thin ink"><i id="pbar" style="width:${Math.round(pct * 100)}%"></i></div>
      <span class="pos">${sess.count}${sess.min ? '' : ` / ${sess.count + sess.queue.length + 1}`}</span>${comboHtml(sess.combo)}<span class="time" id="clock"></span></div>`;
  }
  const total = sess.items.length, at = Math.min(sess.i + 1, total);
  return `<div class="topbar"><button class="icon-btn sm" id="quit" aria-label="Close">${I.x}</button>
    <div class="bar thin ink"><i style="width:${Math.round((sess.i / total) * 100)}%"></i></div>
    <span class="pos">${sess.type === 'quiz' ? 'Quiz ' : ''}${at} / ${total}</span>${sess.type === 'level' ? comboHtml(sess.combo) : '<span class="combo off"></span>'}<span class="time" id="clock">${fmtTime(Date.now() - sess.start)}</span></div>`;
}
function drill(stage, foot) {
  return `<div class="drill">${topbar()}<div class="stage">${stage}</div><div class="foot">${foot}</div></div>`;
}
const hints = (list) => `<div class="hints" id="hints">${list.filter(([, t]) => !(silentOn() && /listen|record|compare/.test(t))).map(([k, t]) => `<span><kbd>${k}</kbd> ${t}</span>`).join('')}</div>`;
const pyPill = (id = 'py', text = 'Show pinyin', key = 'P') => `<button class="pypill" id="${id}">${text} <kbd>${key}</kbd></button>`;
function showPinyin(w, id = 'py') { const p = root.querySelector('#' + id); if (!p) return; p.className = 'pypill shown'; p.textContent = w.p; }
function startClock() {
  tick = setInterval(() => { const c = document.getElementById('clock'); if (c && sess) c.textContent = sess.limit ? fmtTime(sess.limit - (Date.now() - sess.start)) : fmtTime(Date.now() - sess.start); }, 500);
  on('#quit', 'click', quitSession);
}
function quitSession() {
  if (sess && sess.type === 'level' && sess.i > 0 && !confirm('Leave this level? Progress in it will be lost.')) return;
  if (sess && sess.type === 'review' && sess.count > 0) return finishReview();
  if (sess && sess.type === 'quiz' && sess.i > 0 && !confirm('The pop quiz is required. If you leave, it starts over next time.')) return;
  save(); go('home');
}
function stageKeys(extra) {
  return (e) => {
    if (e.key === 'Escape') return quitSession();
    if (extra) extra(e);
  };
}
function setFoot(cls, html) { const h = root.querySelector('#hints'); if (h) { h.className = 'fb ' + cls; h.innerHTML = html; } }
const answerLine = (w) => `<span class="kai">${esc(w.h)}</span> · ${esc(w.p)} · ${esc(w.m)}`;

// ---------------------------------------------------------------- level session
function startLevel(n) {
  if (S.quizPending) return startQuiz();
  const lv = LEVELS[n - 1];
  const fresh = lv.ids.filter((id) => !S.words[id]);      // words you already know (e.g. from the level check) are skipped
  const ids = fresh.length ? fresh : lv.ids;
  const items = [];
  ids.forEach((id) => items.push({ t: 'intro', id }));
  const practice = [];
  ids.forEach((id, k) => [k % 2 ? 'listen' : 'hearzi', 'read', 'pick', 'trace', 'type', 'tone'].forEach((t) => practice.push({ t, id })));
  items.push(...spread(practice));
  const old = shuffle(dueIds().filter((i) => !ids.includes(i))).slice(0, 5);
  const fill = old.length < 5 ? pickN(learnedIds().filter((i) => !ids.includes(i) && !old.includes(i)), 5 - old.length) : [];
  const quiz = [];
  ids.forEach((id) => quiz.push({ t: hanChars(W[id].h).length <= 2 ? 'draw' : 'type', id, q: 1 }));
  [...old, ...fill].forEach((id) => quiz.push({ t: ['listen', 'read', 'type', 'pick', 'tone', 'hearzi'][Math.floor(Math.random() * 6)], id, q: 1, old: 1 }));
  items.push({ t: 'divider' }, ...shuffle(quiz));
  sess = { type: 'level', mult: S.levelsDone[n] ? 0.25 : 1, n, ids, items, i: 0, start: Date.now(), xp: 0, right: 0, wrong: 0, retried: new Set(), missed: {}, combo: 0, bestCombo: 0 };
  nextItem();
}
function spread(list) {
  for (let tries = 0; tries < 60; tries++) {
    const s = shuffle(list);
    if (s.every((x, i) => i === 0 || x.id !== s[i - 1].id)) return s;
  }
  return shuffle(list);
}
function nextItem() {
  if (sess.i >= sess.items.length) return sess.type === 'level' ? finishLevel() : sess.type === 'placement' ? checkPhaseDone() : sess.type === 'quiz' ? finishQuiz() : sess.type === 'plan' ? finishTones() : null;
  const it = sess.items[sess.i];
  recReset();
  if (silentOn()) it.t = ({ listen: 'read', hearzi: 'pick', tone: 'tonesee' })[it.t] || it.t;   // silent mode: reading versions
  HZ_LOCK = it.t !== 'intro' && it.t !== 'divider';   // no hover pinyin/English on a question until it's answered
  ({ intro, listen: choice, read: choice, pick: choice, tone: choice, tonesee: choice, hearzi: choice, type: typeIt, trace: drawIt, draw: drawIt, divider })[it.t](it);
}
function advance() { sess.i++; nextItem(); }
function scored(it, ok) {
  if (!it.retry) it.firstOk = ok;
  if (ok) { sess.right++; addXp(it.retry ? 4 : 10); } else {
    sess.wrong++; sess.missed[it.id] = (sess.missed[it.id] || 0) + 1;
    // a miss goes back into the stack (a few cards later) until you get it right
    const key = it.t + it.id; const n = (sess.retries = sess.retries || {})[key] = ((sess.retries || {})[key] || 0) + 1;
    if (['level', 'quiz', 'plan'].includes(sess.type) && n <= 4) sess.items.splice(Math.min(sess.items.length, sess.i + 4), 0, { ...it, retry: 1 });
  }
  // Level combo: consecutive correct answers (tracked, no XP change).
  if (sess.type === 'level') {
    sess.combo = ok ? sess.combo + 1 : 0; sess.bestCombo = Math.max(sess.bestCombo, sess.combo);
    const c = root.querySelector('#combo'); if (c) c.outerHTML = comboHtml(sess.combo);
  }
  if (it.retry) { save(); return; }
  if (sess.type === 'quiz' && S.words[it.id]) grade(it.id, ok);   // pop quiz: miss → back to Review, hit → mastery boost
  else if (it.old && S.words[it.id] && (!ok || S.words[it.id].due <= Date.now())) grade(it.id, ok);
  save();
}

function divider() {
  render(drill(`<div class="label">Final check · 测验</div><div class="meaning">Quick quiz on today's words${sess.items.some((x) => x.old) ? ' and a few older ones' : ''}.</div>`,
    `${hints([['Esc', 'leave']])}<div class="right"><button class="btn-primary" id="go">Start <kbd>↵</kbd></button></div>`),
  stageKeys((e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } }), () => { startClock(); on('#go', 'click', advance); });
}

function intro(it) {
  const w = W[it.id];
  const idx = sess.ids.indexOf(it.id) + 1;
  const draw = () => {
    const r = root.querySelector('#recbtn');
    if (r) { r.classList.toggle('rec', Rec.on); r.innerHTML = Rec.on ? '<span class="rec-dot"></span>' : I.mic; }
    const rl = root.querySelector('#reclbl'); if (rl) rl.textContent = Rec.on ? 'Stop' : 'Record';
    const c = root.querySelector('#cmp'); if (c) c.disabled = !Rec.url;
  };
  const rec = () => (Rec.on ? recStop() : recStart(draw));
  render(drill(`
      <div class="label">New word · 新词 · ${idx} / ${sess.ids.length}</div>
      <div class="prompt-k">${esc(w.h)}</div>
      ${pyPill()}
      <div class="meaning" style="margin-top:14px">${esc(w.m)}</div>
      <div class="toolrow">
        <div class="tool"><button class="icon-btn" id="play" aria-label="Listen">${I.speaker}</button>Listen</div>
        <div class="tool"><button class="icon-btn" id="recbtn" aria-label="Record"></button><span id="reclbl">Record</span></div>
        <div class="tool"><button class="icon-btn" id="cmp" aria-label="Compare">${I.compare}</button>Compare</div>
        <div class="tool"><button class="icon-btn" id="strokes" aria-label="Strokes">${I.pen}</button>Strokes</div>
      </div>
      <div class="minigrids" id="anim"></div>`,
    `${hints([['Space', 'listen'], ['P', 'pinyin'], ['R', 'record'], ['C', 'compare'], ['S', 'strokes']])}<div class="right"><button class="btn-primary" id="next">Continue <kbd>↵</kbd></button></div>`),
  stageKeys((e) => {
    if (e.key === ' ') { e.preventDefault(); speak(w.h); }
    else if (e.key === 'p') showPinyin(w);
    else if (e.key === 'r') rec();
    else if (e.key === 'c' && Rec.url) compare(w.h);
    else if (e.key === 's') strokes();
    else if (e.key === 'Enter') { recStop(); advance(); }
  }), () => {
    startClock(); draw();
    on('#play', 'click', () => speak(w.h));
    on('#recbtn', 'click', rec);
    on('#cmp', 'click', () => compare(w.h));
    on('#strokes', 'click', strokes);
    on('#py', 'click', () => showPinyin(w));
    on('#next', 'click', () => { recStop(); advance(); });
    setTimeout(() => speak(w.h), 250);
  });
  function strokes() {
    const box = root.querySelector('#anim'); clearWriters();
    box.innerHTML = hanChars(w.h).map((c, i) => `<div class="grid xs">${tzg}<div id="a${i}"></div></div>`).join('');
    const ws = hanChars(w.h).map((c, i) => makeWriter(root.querySelector('#a' + i), c, { showOutline: true }));
    (async () => { for (const x of ws) await x.animateCharacter(); })();
  }
}

function choice(it) {
  const w = W[it.id];
  let prompt, opts, label;
  if (it.t === 'listen') {
    label = it.placement ? checkTag() : 'Hear · 听';
    prompt = `<button class="listen-btn" id="spk" aria-label="Play">${I.speaker}</button>`;
    opts = shuffle([w, ...distractors(it.id, 3)]).map((x) => ({ id: x.id, html: esc(x.m) }));
  } else if (it.t === 'read') {
    label = it.placement ? checkTag() : 'See · 看';
    prompt = `<div class="prompt-k">${esc(w.h)}</div>${it.placement ? '' : pyPill()}`;
    opts = shuffle([w, ...distractors(it.id, 3)]).map((x) => ({ id: x.id, html: esc(x.m) }));
  } else if (it.t === 'hearzi') {
    label = 'Hear · 听字 · pick the characters';
    prompt = `<button class="listen-btn" id="spk" aria-label="Play">${I.speaker}</button>`;
    opts = shuffle([w, ...distractors(it.id, 3, 'h')]).map((x) => ({ id: x.id, html: `<span class="kai">${esc(x.h)}</span>` }));
  } else if (it.t === 'tonesee') {
    label = 'Tones · 声调 · which pinyin is right?';
    prompt = `<div class="prompt-k">${esc(w.h)}</div>`;
    opts = shuffle(toneOptions(w)).map((o) => ({ id: o.ok ? w.id : -9, html: `<span class="tonepy">${esc(o.py)}</span>` }));
  } else if (it.t === 'tone') {
    label = 'Tones · 声调 · which do you hear?';
    prompt = `<button class="listen-btn" id="spk" aria-label="Play">${I.speaker}</button>`;
    opts = shuffle(toneOptions(w)).map((o) => ({ id: o.ok ? w.id : -9, html: `<span class="tonepy">${esc(o.py)}</span>` }));
  } else {
    label = 'Choose · 选';
    prompt = `<div class="meaning">${esc(w.m)}</div>`;
    opts = shuffle([w, ...distractors(it.id, 3, 'h')]).map((x) => ({ id: x.id, html: `<span class="kai">${esc(x.h)}</span>` }));
  }
  if (it.placement) opts.push({ id: -1, html: "I don't know" });
  let answered = false;
  const keyList = [['1–' + opts.length, 'choose']];
  if (it.t !== 'read') keyList.push(['Space', 'listen']); else if (!it.placement) keyList.push(['P', 'pinyin']);
  const audioPrompt = ['listen', 'hearzi', 'tone'].includes(it.t);
  render(drill(`<div class="label">${label}</div>${prompt}
      <div class="options">${opts.map((o, i) => `<button class="opt" data-i="${i}"><span class="n">${i + 1}</span><span>${o.html}</span></button>`).join('')}</div>`,
    `${hints(keyList)}<div class="right"><button class="btn-primary" id="next" style="visibility:hidden">Continue <kbd>↵</kbd></button></div>`),
  stageKeys((e) => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= opts.length && !answered) answer(n - 1);
    else if (e.key === ' ') { e.preventDefault(); if (it.t !== 'read' || answered) speak(w.h); }
    else if (e.key === 'p' && it.t === 'read' && !it.placement) showPinyin(w);
    else if (e.key === 'Enter' && answered) advance();
  }), () => {
    startClock();
    on('.opt', 'click', (e) => !answered && answer(+e.currentTarget.dataset.i));
    on('#spk', 'click', () => speak(w.h));
    on('#py', 'click', () => showPinyin(w));
    on('#next', 'click', advance);
    if (audioPrompt) setTimeout(() => speak(w.h), 250);
  });
  function answer(i) {
    answered = true; HZ_LOCK = false;
    const ok = opts[i].id === it.id;
    root.querySelectorAll('.opt').forEach((b, j) => { if (opts[j].id === it.id) b.classList.add('ok'); else if (j === i) b.classList.add('bad'); else b.classList.add('dim'); });
    if (it.placement) { checkAnswer(it.id, opts[i].id === -1 ? 'dk' : ok ? 'ok' : 'bad'); sess.i++; return setTimeout(nextItem, 350); }
    scored(it, ok);
    speak(w.h);   // you always hear it once you've answered
    setFoot(ok ? 'ok' : 'bad', answerLine(w));
    if (ok) setTimeout(() => { if (sess && sess.items[sess.i] === it) advance(); }, 1100);
    else { root.querySelector('#next').style.visibility = 'visible'; showWrong(w, advance); }
  }
}

function typeIt(it) {
  const w = W[it.id];
  let answered = false;
  const tip = !S.settings.imeTipSeen ? `<div class="tip">Type with the Mac Chinese keyboard: switch input with Ctrl+Space or the Globe key, type the pinyin (like nihao), pick the characters, then press Enter.</div>` : '';
  render(drill(`<div class="label">Type · 打字</div>
      <div class="meaning">${esc(w.m)}</div>
      ${pyPill('py', 'Show pinyin', 'Tab')}
      <div style="margin-top:26px;display:flex;gap:14px;align-items:center"><input class="typein" id="inp" autocomplete="off" spellcheck="false" lang="zh-CN"><button class="icon-btn" id="play" aria-label="Listen">${I.speaker}</button></div>
      ${tip}`,
    `${hints([['↵', 'check'], ['Tab', 'pinyin']])}<div class="right"><button class="btn-primary" id="check">Check <kbd>↵</kbd></button></div>`),
  stageKeys((e) => {
    if (e.key === 'Enter') { e.preventDefault(); answered ? advance() : check(); }
    else if (e.key === 'Tab') { e.preventDefault(); hint(); }
  }), () => {
    startClock();
    const inp = root.querySelector('#inp'); inp.focus();
    inp.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); hint(); } });
    inp.addEventListener('input', () => { if (!answered) setFoot('', `<span><kbd>↵</kbd> check</span><span><kbd>Tab</kbd> pinyin</span>`); });
    on('#check', 'click', () => (answered ? advance() : check())); on('#play', 'click', () => speak(w.h)); on('#py', 'click', hint);
    if (!S.settings.imeTipSeen) { S.settings.imeTipSeen = true; save(); }
  });
  function hint() { showPinyin(w); sess.hinted = true; }
  function check() {
    const inp = root.querySelector('#inp'); const v = inp.value.trim().replace(/\s/g, '');
    if (!v) { setFoot('bad', 'Type an answer first'); return; }
    answered = true; inp.blur(); inp.readOnly = true; HZ_LOCK = false;
    const ok = v === w.h;
    inp.classList.add(ok ? 'ok' : 'bad');
    scored(it, ok); if (ok) { S.stats.typed++; save(); }
    speak(w.h);
    setFoot(ok ? 'ok' : 'bad', ok ? answerLine(w) : `Answer: ${answerLine(w)}`);
    root.querySelector('#check').innerHTML = 'Continue <kbd>↵</kbd>';
    keyHandler = stageKeys((e) => { if (e.key === 'Enter') advance(); });
    if (!ok) showWrong(w, advance, v);
  }
}

function drawIt(it) {
  const w = W[it.id];
  const chars = hanChars(w.h);
  if (!chars.length) return advance();
  const trace = it.t === 'trace';
  const size = chars.length === 1 ? '' : chars.length === 2 ? 'md' : 'sm';
  let ci = 0, mistakes = 0, done = false, stroke = 0, cur = null;
  const done_ws = [];
  render(drill(`<div class="label">${trace ? 'Trace · 描' : 'Draw · 写'}</div>
      <div class="meaning">${esc(w.m)}</div>
      ${trace ? `<div class="pypill shown">${esc(w.p)}</div>` : pyPill()}
      <div class="drawwrap">
        <div class="grids">${chars.map((c, i) => `<div class="grid ${size} ${i ? 'wait' : ''}" id="b${i}">${tzg}<div id="d${i}"></div></div>`).join('')}</div>
        <div class="sidetools">
          <button class="icon-btn" id="play" title="Listen (Space)" aria-label="Listen">${I.speaker}</button>
          <button class="icon-btn" id="hint" title="Hint: show next stroke (H)" aria-label="Hint">${I.bulb}</button>
          <button class="icon-btn" id="watch" title="Watch strokes (W)" aria-label="Watch">${I.play}</button>
          <button class="icon-btn" id="clear" title="Clear character (Backspace)" aria-label="Clear">${I.clear}</button>
        </div>
      </div>
      <div class="caption" id="cap"></div>`,
    `${hints([['Space', 'listen'], ['H', 'hint'], ['W', 'watch'], ['⌫', 'clear']].concat(trace ? [] : [['P', 'pinyin']]))}
     <div class="right">${trace ? '' : '<button class="btn-secondary" id="skip">Skip</button>'}<button class="btn-primary" id="next" style="display:none">Continue <kbd>↵</kbd></button></div>`),
  stageKeys((e) => {
    if (e.key === ' ') { e.preventDefault(); speak(w.h); }
    else if (e.key === 'w') watch();
    else if (e.key === 'h') hint();
    else if (e.key === 'Backspace') clearChar();
    else if (e.key === 'p' && !trace) showPinyin(w);
    else if (e.key === 'Enter' && done) advance();
  }), () => {
    startClock();
    on('#play', 'click', () => speak(w.h)); on('#watch', 'click', watch); on('#hint', 'click', hint); on('#clear', 'click', clearChar);
    on('#next', 'click', advance); on('#py', 'click', () => showPinyin(w));
    on('#skip', 'click', () => { mistakes += 99; watch(); });
    if (trace) speak(w.h);
    startChar();
  });
  function total() { return STROKES[chars[ci]].strokes.length; }
  function caption() {
    const c = root.querySelector('#cap'); if (!c || done) return;
    c.className = 'caption';
    c.textContent = (chars.length > 1 ? `Character ${ci + 1} of ${chars.length} · ` : '') + `Stroke ${Math.min(stroke + 1, total())} of ${total()}`;
  }
  function startChar() {
    root.querySelectorAll('.grid').forEach((b, i) => b.classList.toggle('wait', i > ci));
    const el = root.querySelector('#d' + ci);
    el.innerHTML = ''; stroke = 0; caption();
    cur = makeWriter(el, chars[ci], { showOutline: trace });
    const relaxed = (S.settings.strokes || 'relaxed') === 'relaxed';
    cur.quiz({
      leniency: relaxed ? 1.8 : 1,           // relaxed: roughly-right strokes count (easier on a trackpad)
      showHintAfterMisses: trace ? 2 : 3,
      highlightOnComplete: false,
      onMistake: () => { mistakes++; },
      onCorrectStroke: (d) => { stroke = d.strokeNum + 1; caption(); },
      onComplete: () => {
        done_ws.push(cur);
        S.stats.drawn++; addXp(3);
        ci++;
        if (ci < chars.length) setTimeout(startChar, 200); else finish();
      }
    });
  }
  function hint() { if (done || !cur) return; mistakes++; cur.highlightStroke(stroke); }
  function clearChar() { if (done) return; try { cur.cancelQuiz(); } catch {} startChar(); }
  async function watch() {
    if (done) return;
    const el = root.querySelector('#d' + ci);
    try { cur.cancelQuiz(); } catch {}
    el.innerHTML = '';
    const wr = makeWriter(el, chars[ci], { showOutline: true });
    await wr.animateCharacter();
    setTimeout(() => { if (!done && root.contains(el)) startChar(); }, 400);
  }
  function finish() {
    done = true;
    const ok = mistakes <= ((S.settings.strokes || 'relaxed') === 'relaxed' ? 4 : 3) * chars.length;
    scored(it, ok);
    root.querySelectorAll('.grid').forEach((b) => { b.classList.remove('wait'); b.classList.add(ok ? 'ok' : 'bad'); });
    if (ok) done_ws.forEach((x) => { try { x.updateColor('strokeColor', C.spring); } catch {} });
    const c = root.querySelector('#cap');
    c.className = 'caption ' + (ok ? 'ok' : 'bad');
    c.textContent = mistakes >= 99 ? `Shown · ${w.p}` : `${w.p} · ${mistakes === 0 ? 'no misses' : mistakes + (mistakes === 1 ? ' miss' : ' misses')}`;
    const sk = root.querySelector('#skip'); if (sk) sk.style.display = 'none';
    root.querySelector('#next').style.display = 'inline-flex';
    setFoot(ok ? 'ok' : 'bad', answerLine(w));
    HZ_LOCK = false;
    if (!trace) speak(w.h);
    if (!ok && !trace) showWrong(w, advance);
  }
}

// ================================================================ REWARDS (loud)
function rankArt(r) {
  return r.milestone ? dragon('pose-loop-gold-on-red', 'height:330px;right:-40px;top:-40px') : dragon('pose-coil-ink-on-red', 'height:300px;right:-70px;top:-30px');
}
function rewardHero({ label, head, sub, art, say }) {
  return `<div class="block">${art}<div class="label">${label}</div><div class="rh">${head}</div><div class="re">${sub}</div>${say ? `<div style="margin-top:auto">${sayCap(say, 'on-red')}</div>` : ''}</div>`;
}
const heroSaying = (sy) => brush(sy[0], `font-size:${sy[0].length > 4 ? 104 : 130}px;right:-8px;top:-30px;color:var(--paper);opacity:.32`);
const milestoneCups = () => `<div class="herocups" aria-hidden="true">${cup('studied', 210)}</div>`;
const statCard = (k, v) => `<div class="card"><div class="label">${k}</div><div class="num">${v}</div></div>`;
const badgeNote = (b) => `<div class="note"><span class="bs">${esc(b.hz)}</span>New badge · ${esc(b.name)}</div>`;
const goldNote = (t) => `<div class="note"><span class="dot"></span>${esc(t)}</div>`;

function finishLevel() {
  const lv = LEVELS[sess.n - 1];
  const first = !S.levelsDone[lv.n];
  const before = rank().i;
  lv.ids.forEach((id) => { if (!S.words[id]) learnWord(id, sess.missed[id] >= 2 ? 0.2 : 1); });
  S.levelsDone[lv.n] = Date.now();
  planMark('level');
  S.stats.levels++;
  addXp(50);
  const freezeEarned = S.stats.levels % 5 === 0 && S.streak.freezes < FREEZE_MAX;
  if (freezeEarned) S.streak.freezes++;
  const lsay = SAYINGS[(S.stats.levels - 1) % SAYINGS.length];   // rotates per level
  if (S.stats.levels % 3 === 0 && learnedIds().length >= 4) S.quizPending = true;
  const milestone = markPractice();
  const goalHit = bumpWeek();
  const newCombo = sess.bestCombo > S.bests.combo; if (newCombo) S.bests.combo = sess.bestCombo;
  const got = checkBadges();
  save();
  const r = rank(), rankUp = r.i > before;
  const acc = sess.right + sess.wrong ? Math.round((sess.right / (sess.right + sess.wrong)) * 100) : 100;
  const nl = nextLevel();
  const art = rankUp ? rankArt(r)
    : milestone ? milestoneCups()
    : heroSaying(lsay);
  const head = rankUp ? `${r.hz}!` : milestone ? `连胜 ${S.streak.count}!` : acc >= 90 ? '很好!' : acc >= 70 ? '不错!' : '加油!';
  const sub = rankUp ? `New rank · ${r.en}` : milestone ? `${S.streak.count}-day streak` : acc >= 90 ? 'Very good' : acc >= 70 ? 'Not bad' : 'Keep going';
  const say = rankUp || milestone ? null : lsay;
  const s = sess; sess = null;
  render(`<div class="reward"><div class="col">
    ${rewardHero({ label: `Level ${pad2(lv.n)} complete`, head, sub, art, say })}
    <div class="stats4">${statCard('Accuracy', acc + '%')}${statCard('XP earned', '+' + s.xp)}${statCard('Time', fmtTime(Date.now() - s.start))}${statCard('Best combo', s.bestCombo)}</div>
    <div class="chips">${lv.ids.map((id) => `<span class="chip"><span class="kai">${esc(W[id].h)}</span>${esc(W[id].m)}</span>`).join('')}</div>
    <div class="card"><div class="goalrow"><span class="label">Rank · ${r.hz} ${r.en}</span><b>${r.nextNote}</b></div><div class="bar gold"><i style="width:${Math.round(r.pct * 100)}%"></i></div></div>
    ${freezeEarned ? goldNote(`Streak freeze earned · ${S.streak.freezes} of ${FREEZE_MAX}`) : ''}
    ${goalHit ? goldNote('Weekly goal reached · +100 XP') : ''}
    ${newCombo ? goldNote(`New best combo · ${s.bestCombo}`) : ''}
    ${got.map(badgeNote).join('')}
    ${S.quizPending ? goldNote('Pop quiz unlocked · 测验 · do it next') : ''}
    <div class="actions"><button class="btn-secondary" data-go="home">Home <kbd>Esc</kbd></button><button class="btn-primary" id="again">${S.quizPending ? 'Start pop quiz' : 'Next level'} <kbd>↵</kbd></button></div>
  </div></div>`, (e) => { if (e.key === 'Enter') startLevel(nl.n); if (e.key === 'Escape') go('home'); },
  () => on('#again', 'click', () => startLevel(nl.n)));
  planButton();
}

// ---------------------------------------------------------------- level check (HSK 1, adaptive, resumable)
// Blocks of 10 levels. Each block opens with a 6-word sample: 5+ right → block checked off;
// 2–4 right → every word in the block is tested; 0–1 right → weak block. Two weak blocks in a row ends the check.
const HSK1 = LEVELS.filter((l) => l.hsk === 1);
const CHECK_BLOCKS = Math.ceil(HSK1.length / 10);
const blockIds = (b) => HSK1.slice(b * 10, b * 10 + 10).flatMap((l) => l.ids);
const checkTag = () => `Level check · 测 · Block ${Math.min(S.check.blk + 1, CHECK_BLOCKS)} / ${CHECK_BLOCKS}`;
const checkLabel = () => (S.check && !S.check.done ? 'Resume level check' : 'Level check');
function startCheck() {
  if (!S.check || S.check.done) S.check = { blk: 0, mode: 'sample', res: {}, bad: 0, queue: [], phase: [], known: 0, done: false };
  if (!S.check.queue.length) checkPhase();
  checkRun();
}
function checkPhase() {
  const c = S.check, ids = blockIds(c.blk);
  const untested = ids.filter((id) => !c.res[id]);
  c.phase = c.mode === 'sample' ? pickN(untested, Math.min(6, untested.length)) : untested;
  c.queue = c.phase.slice(); save();
}
function checkRun() {
  if (!S.check.queue.length) return checkPhaseDone();
  sess = { type: 'placement', items: S.check.queue.map((id) => ({ t: Math.random() < 0.5 || silentOn() ? 'read' : 'listen', id, placement: 1 })), i: 0, start: Date.now(), xp: 0 };
  nextItem();
}
function checkAnswer(id, r) {
  const c = S.check; c.res[id] = r; c.queue = c.queue.filter((x) => x !== id); save();
}
function checkKnow(ids) {
  ids.forEach((id) => { if (!S.words[id]) { learnWord(id, 5); S.check.known++; addXp(3); } });
  HSK1.forEach((l) => { if (!S.levelsDone[l.n] && l.ids.every((id) => S.words[id])) S.levelsDone[l.n] = Date.now(); });
}
function checkPhaseDone() {
  const c = S.check, ids = blockIds(c.blk);
  const okIn = (list) => list.filter((id) => c.res[id] === 'ok');
  let next = true;
  if (c.mode === 'sample') {
    const ok = okIn(c.phase).length;
    if (ok >= 5) { checkKnow(ids.filter((id) => !c.res[id] || c.res[id] === 'ok')); S.stats.placementPassed++; c.bad = 0; }
    else if (ok >= 2) { c.mode = 'full'; next = false; }
    else { checkKnow(okIn(ids)); c.bad++; }
  } else {
    const ok = okIn(ids); checkKnow(ok);
    if (ok.length / ids.length < 0.4) c.bad++; else c.bad = 0;
  }
  if (next) { c.blk++; c.mode = 'sample'; }
  if (c.bad >= 2 || c.blk >= CHECK_BLOCKS) { c.done = true; save(); return checkDone(); }
  save(); checkPhase(); checkRun();
}
function checkDone() {
  const c = S.check;
  const known = HSK1.flatMap((l) => l.ids).filter((id) => S.words[id]).length;
  const total = HSK1.reduce((a, l) => a + l.ids.length, 0);
  const lvls = HSK1.filter((l) => S.levelsDone[l.n]).length;
  const dk = Object.values(c.res).filter((r) => r === 'dk').length;
  const got = checkBadges(); save();
  const nl = nextLevel(); const xp = sess ? sess.xp : 0;
  sess = null;
  render(`<div class="reward"><div class="col">
    ${rewardHero({ label: 'Level check · 测 · done', head: `${known} / ${total}`, sub: 'HSK 1 words you know', art: heroSaying(SAYINGS[3]), say: SAYINGS[3] })}
    <div class="stats4">${statCard('Words checked off', c.known)}${statCard('Levels done', lvls + ' / ' + HSK1.length)}${statCard("Didn't know", dk)}${statCard('XP earned', '+' + c.known * 3)}</div>
    <p class="smoke">Checked-off words come back in Review within a week to confirm them. Levels where you knew some words now teach only the ones you didn't.</p>
    ${got.map(badgeNote).join('')}
    <div class="actions"><button class="btn-secondary" data-go="home">Home <kbd>Esc</kbd></button><button class="btn-primary" id="go">Start level ${nl.n} <kbd>↵</kbd></button></div>
  </div></div>`, (e) => { if (e.key === 'Enter') startLevel(nl.n); if (e.key === 'Escape') go('home'); }, () => on('#go', 'click', () => startLevel(nl.n)));
  planButton();
}

// ---------------------------------------------------------------- pop quiz (every 3rd level, required)
function retention() {
  const q = S.quizzes.slice(-5); if (!q.length) return null;
  return Math.round((q.reduce((a, x) => a + x.ok, 0) / q.reduce((a, x) => a + x.n, 0)) * 100);
}
function startQuiz() {
  const now = Date.now(), learned = learnedIds();
  let pool = learned.filter((id) => now - (S.words[id].at || 0) >= 3 * DAY);
  if (pool.length < 10) pool = learned;
  const weight = (id) => 1 + (now - (S.words[id].at || now)) / (7 * DAY) + (5 - mastery(id)) * 0.6;   // older + weaker = likelier
  const picked = [];
  const bag = pool.slice();
  while (picked.length < Math.min(10, pool.length)) {
    const tot = bag.reduce((a, id) => a + weight(id), 0); let r = Math.random() * tot;
    const k = bag.findIndex((id) => (r -= weight(id)) <= 0); picked.push(bag.splice(k < 0 ? 0 : k, 1)[0]);
  }
  let draws = 0;
  const items = picked.map((id) => {
    const canDraw = hanChars(W[id].h).length && hanChars(W[id].h).length <= 2 && draws < 3;
    const r = Math.random();
    const t = canDraw && r < 0.3 ? (draws++, 'draw') : ['listen', 'type', 'tone', 'hearzi'][Math.floor(Math.random() * 4)];
    return { t, id, q: 1 };
  });
  sess = { type: 'quiz', items, i: 0, start: Date.now(), xp: 0, right: 0, wrong: 0, retried: new Set(), missed: {}, combo: 0, bestCombo: 0 };
  nextItem();
}
function finishQuiz() {
  const s = sess, firsts = s.items.filter((x) => !x.retry), n = firsts.length, ok = firsts.filter((x) => x.firstOk).length, pct = Math.round((ok / Math.max(1, n)) * 100);
  const before = rank().i;
  S.quizzes.push({ t: Date.now(), n, ok }); if (S.quizzes.length > 100) S.quizzes = S.quizzes.slice(-100);
  S.quizPending = false;
  planMark('quiz');
  addXp(30);
  if (ok === n) S.stats.perfectQuizzes++;
  markPractice();
  const got = checkBadges(); save();
  const r = rank(), rankUp = r.i > before;
  const missed = Object.keys(s.missed).map(Number);
  const sy = ok === n ? SAYINGS[1] : SAYINGS[2];
  sess = null;
  const nl = nextLevel();
  render(`<div class="reward"><div class="col">
    ${rewardHero({ label: 'Pop quiz · 测验', head: rankUp ? `${r.hz}!` : `${ok} / ${n}`, sub: rankUp ? `New rank · ${r.en}` : `${pct}% retained`, art: rankUp ? rankArt(r) : heroSaying(sy), say: rankUp ? null : sy })}
    <div class="stats4">${statCard('Score', pct + '%')}${statCard('Retention', retention() + '%')}${statCard('XP earned', '+' + s.xp)}${statCard('Time', fmtTime(Date.now() - s.start))}</div>
    ${missed.length ? `<div class="card"><div class="label" style="margin-bottom:12px">Back in Review now</div><div class="chips">${missed.map((id) => `<span class="chip"><span class="kai">${esc(W[id].h)}</span>${esc(W[id].p)} · ${esc(W[id].m)}</span>`).join('')}</div></div>` : ''}
    ${got.map(badgeNote).join('')}
    <div class="actions"><button class="btn-secondary" data-go="home">Home <kbd>Esc</kbd></button><button class="btn-primary" id="go">Next level <kbd>↵</kbd></button></div>
  </div></div>`, (e) => { if (e.key === 'Enter') startLevel(nl.n); if (e.key === 'Escape') go('home'); }, () => on('#go', 'click', () => startLevel(nl.n)));
}

// ================================================================ REVIEW
function reviewStart() {
  const due = dueIds().length, learned = learnedIds().length;
  if (!learned) {
    return render(shell('review', `<div class="pagehead"><div class="label">Lightning review · 复习</div><h1>Review</h1><p>Finish your first level and its words will show up here.</p></div>
      <button class="btn-primary" id="go">Start level 1 <kbd>↵</kbd></button>`), (e) => { if (e.key === 'Escape') go('home'); if (e.key === 'Enter') startLevel(1); }, () => on('#go', 'click', () => startLevel(1)));
  }
  render(shell('review', `<div class="pagehead"><div class="label">Lightning review · 复习</div><h1>Review</h1>${sayCap(REVIEW_SAYING)}<p>${due ? `${due} word${due > 1 ? 's are' : ' is'} due.` : 'Nothing due. Timed rounds use random learned words.'} Flip each card, then mark it.</p></div>
    <div class="revtiles">
      <button class="revtile" data-r="2"><span class="label">2 minutes · <kbd>1</kbd></span><span class="num">${S.bests.review2}</span><span class="s">Best cards in 2 minutes</span></button>
      <button class="revtile" data-r="5"><span class="label">5 minutes · <kbd>2</kbd></span><span class="num">${S.bests.review5}</span><span class="s">Best cards in 5 minutes</span></button>
      <button class="revtile" data-r="0" ${due ? '' : 'disabled'}><span class="label">All due · <kbd>3</kbd></span><span class="num">${due}</span><span class="s">${due ? 'Cards due now' : 'All caught up'}</span></button>
    </div>
    <div class="card" style="margin-top:20px"><div class="goalrow"><span class="label">Best combo</span><b>${S.bests.combo}</b></div><p class="smoke" style="font-size:13px">Combos multiply review XP: ×2 at 5 in a row, ×3 at 10.</p></div>`, brush(REVIEW_SAYING[0], 'font-size:260px;right:-70px;top:30px;color:var(--ink);opacity:.07')),
  (e) => {
    if (e.key === 'Escape') go('home');
    if (e.key === '1') startReview(2); if (e.key === '2') startReview(5); if (e.key === '3' && due) startReview(0);
  }, () => on('[data-r]', 'click', (e) => { if (!e.currentTarget.disabled) startReview(+e.currentTarget.dataset.r); }));
}
function startReview(min) {
  sess = { type: 'review', min, limit: min ? min * 60000 : 0, start: Date.now(), queue: dueIds(), used: new Set(), count: 0, knew: 0, combo: 0, bestCombo: 0, xp: 0, items: [1], i: 0 };
  reviewCard();
}
function reviewNextId() {
  while (sess.queue.length) { const id = sess.queue.shift(); if (!sess.used.has(id)) return { id, due: true }; }
  if (!sess.min) return null;
  const pool = learnedIds().filter((id) => !sess.used.has(id));
  const src = pool.length ? pool : learnedIds();
  if (!pool.length) sess.used.clear();
  return { id: src[Math.floor(Math.random() * src.length)], due: false };
}
function reviewCard() {
  if (sess.limit && Date.now() - sess.start >= sess.limit) return finishReview();
  const nx = reviewNextId();
  if (!nx) return finishReview();
  sess.used.add(nx.id);
  const w = W[nx.id];
  // words met in a story sometimes come back as their sentence with the word missing (recall it in context)
  const ctxs = ((S.ctx || {})[nx.id] || []).filter((c) => c.zh.includes(w.h));
  const ctx = ctxs.length && Math.random() < 0.5 ? ctxs[Math.floor(Math.random() * ctxs.length)] : null;
  const audioFirst = !ctx && !silentOn() && Math.random() < 0.3;
  let flipped = false;
  const ctxFront = ctx ? `<div class="label ctxlab">In context · 语境</div><div class="ctxzh kai">${esc(ctx.zh).split(esc(w.h)).join(`<span class="ctxgap" id="ctxgap">${'＿'.repeat(Math.max(2, [...w.h].length))}</span>`)}</div><div class="ctxen">${esc(ctx.en)}</div>` : '';
  render(drill(`<div class="label">Lightning review · 复习</div>
      <div class="flash ${ctx ? 'ctx' : ''}" id="card">
        ${ctx ? ctxFront + `<div class="prompt-k mid" id="hz" style="visibility:hidden;margin-top:10px">${esc(w.h)}</div>`
          : audioFirst ? `<button class="listen-btn" id="spk" aria-label="Play">${I.speaker}</button><div class="prompt-k mid" id="hz" style="visibility:hidden;margin-top:12px">${esc(w.h)}</div>` : `<div class="prompt-k">${esc(w.h)}</div>`}
        <div id="back" style="visibility:hidden"><div class="py">${esc(w.p)}</div><div class="meaning sm">${esc(w.m)}</div></div>
      </div>`,
    `${hints([['Space', 'flip'], ['1', 'missed'], ['2', 'knew']])}<div class="right" id="r1"><button class="btn-primary" id="flip">Flip <kbd>Space</kbd></button></div>
     <div class="right" id="r2" style="display:none"><button class="btn-secondary" id="miss">Missed it <kbd>1</kbd></button><button class="btn-primary" id="knew">Knew it <kbd>2</kbd></button></div>`),
  (e) => {
    if (e.key === 'Escape') return finishReview();
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!flipped) flip(); else mark(true); }
    else if (flipped && e.key === '1') mark(false);
    else if (flipped && e.key === '2') mark(true);
    else if (e.key === 'p') speak(w.h);
  }, () => {
    const upd = () => {
      const c = document.getElementById('clock'); if (!c || !sess) return;
      c.textContent = sess.limit ? fmtTime(sess.limit - (Date.now() - sess.start)) : fmtTime(Date.now() - sess.start);
      const b = document.getElementById('pbar'); if (b && sess.limit) b.style.width = Math.min(100, ((Date.now() - sess.start) / sess.limit) * 100) + '%';
      if (sess.limit && Date.now() - sess.start >= sess.limit && !flipped) finishReview();
    };
    upd(); tick = setInterval(upd, 300);
    on('#quit', 'click', finishReview); on('#flip', 'click', flip); on('#miss', 'click', () => mark(false)); on('#knew', 'click', () => mark(true));
    on('#spk', 'click', () => speak(w.h));
    if (audioFirst) setTimeout(() => speak(w.h), 200);
  });
  HZ_LOCK = true;
  function flip() {
    flipped = true; HZ_LOCK = false;
    root.querySelector('#back').style.visibility = 'visible';
    const hz = root.querySelector('#hz'); if (hz) hz.style.visibility = 'visible';
    const gap = root.querySelector('#ctxgap'); if (gap) { gap.textContent = w.h; gap.classList.add('on'); }
    root.querySelector('#r1').style.display = 'none'; root.querySelector('#r2').style.display = 'flex';
    if (!audioFirst) speak(ctx ? ctx.zh : w.h);
  }
  function mark(good) {
    if (!flipped) return;
    if (nx.due || !good) grade(nx.id, good);
    sess.count++; S.stats.reviews++;
    root.querySelector('#card').classList.add(good ? 'ok' : 'bad');
    if (good) {
      sess.knew++; sess.combo++; sess.bestCombo = Math.max(sess.bestCombo, sess.combo);
      addXp(5 * (sess.combo >= 10 ? 3 : sess.combo >= 5 ? 2 : 1));
    } else { sess.combo = 0; if (sess.min) sess.queue.push(nx.id); }
    save();
    keyHandler = null;
    setTimeout(() => sess && reviewCard(), 260);
  }
}
function finishReview() {
  if (!sess) return go('home');
  const s = sess; sess = null;
  const notes = [];
  const before = rank().i;
  if (s.min === 2 && s.knew > S.bests.review2) { S.bests.review2 = s.knew; notes.push('New personal best for 2 minutes'); }
  if (s.min === 5 && s.knew > S.bests.review5) { S.bests.review5 = s.knew; notes.push('New personal best for 5 minutes'); }
  if (s.bestCombo > S.bests.combo) { S.bests.combo = s.bestCombo; notes.push(`New best combo · ${s.bestCombo}`); }
  const milestone = s.count >= 5 ? markPractice() : false;
  if (s.count >= 5 || (s.count && !dueIds().length)) planMark('review');
  const got = checkBadges(); save();
  const r = rank(), rankUp = r.i > before;
  const art = rankUp ? rankArt(r)
    : milestone ? milestoneCups()
    : heroSaying(REVIEW_SAYING);
  render(`<div class="reward"><div class="col">
    ${rewardHero({ label: 'Lightning review · done', head: rankUp ? `${r.hz}!` : milestone ? `连胜 ${S.streak.count}!` : `${s.knew} / ${s.count}`, sub: rankUp ? `New rank · ${r.en}` : milestone ? `${S.streak.count}-day streak` : 'cards known', art, say: rankUp || milestone ? null : REVIEW_SAYING })}
    <div class="stats4">${statCard('Known', s.knew)}${statCard('XP earned', '+' + s.xp)}${statCard('Best combo', s.bestCombo)}${statCard('Still due', dueIds().length)}</div>
    ${notes.map(goldNote).join('')}
    ${got.map(badgeNote).join('')}
    <div class="actions"><button class="btn-secondary" data-go="home">Home <kbd>Esc</kbd></button><button class="btn-primary" id="again">Another round <kbd>↵</kbd></button></div>
  </div></div>`, (e) => { if (e.key === 'Enter') startReview(s.min || 2); if (e.key === 'Escape') go('home'); },
  () => on('#again', 'click', () => startReview(s.min || 2)));
  planButton();
}

// ================================================================ WORDS, BADGES, SETTINGS (loud shell)
function words() {
  const ids = learnedIds().sort((a, b) => a - b);
  render(shell('', `<div class="pagehead"><div class="label">${ids.length} learned</div><h1>Your words</h1></div>
    <div class="wordlist">${ids.length ? ids.map((id) => `<div class="wrow" data-w="${id}"><span class="kai">${esc(W[id].h)}</span><span class="py">${esc(W[id].p)}</span><span>${esc(W[id].m)}</span><span class="bar thin spring"><i style="width:${mastery(id) * 20}%"></i></span></div>`).join('') : '<div class="empty">Words appear here after your first level.</div>'}</div>`),
  (e) => e.key === 'Escape' && go('home'), () => on('[data-w]', 'click', (e) => go('wordDetail', +e.currentTarget.dataset.w)));
}
function wordDetail(id) {
  const w = W[id], chars = hanChars(w.h), sw = S.words[id];
  render(shell('', `<button class="btn-secondary" data-go="words" style="margin:-8px 0 16px -14px">${I.back} Your words</button>
    <div class="detail">
      <div>
        <div class="bigk">${esc(w.h)}</div><div class="py">${esc(w.p)}</div><div class="mn">${esc(w.m)}</div>
        ${w.all && w.all !== w.m ? `<p class="smoke" style="margin-top:10px">${esc(w.all)}</p>` : ''}
        <div class="card" style="margin-top:20px"><div class="goalrow"><span class="label">Mastery · HSK ${w.hsk}</span><b>${sw ? `Next review ${sw.due <= Date.now() ? 'now' : 'in ' + Math.ceil((sw.due - Date.now()) / DAY) + ' d'}` : 'Not learned yet'}</b></div><div class="bar spring"><i style="width:${mastery(id) * 20}%"></i></div></div>
        <div style="display:flex;gap:12px;margin-top:18px"><button class="btn-primary" id="play">${I.speaker} Listen <kbd>Space</kbd></button><button class="btn-outline" id="anim">${I.play} Strokes</button></div>
      </div>
      <div class="grids" style="flex-wrap:wrap">${chars.map((c, i) => `<div class="grid ${chars.length > 1 ? 'sm' : 'md'}">${tzg}<div id="a${i}"></div></div>`).join('')}</div>
    </div>`), (e) => { if (e.key === ' ') { e.preventDefault(); speak(w.h); } if (e.key === 'Escape') go('words'); }, () => {
    const ws = chars.map((c, i) => makeWriter(root.querySelector('#a' + i), c, { showCharacter: true, showOutline: true }));
    const anim = async () => { for (const x of ws) await x.animateCharacter(); };
    on('#play', 'click', () => speak(w.h)); on('#anim', 'click', anim);
    speak(w.h);
  });
}
function badges() {
  const n = Object.keys(S.badges).length;
  render(shell('badges', `<div class="pagehead"><div class="label">${n} of ${BADGES.length} earned</div><h1>Badges</h1></div>
    <div class="bests">${statCard('2 min best', S.bests.review2)}${statCard('5 min best', S.bests.review5)}${statCard('Best combo', S.bests.combo)}${statCard('Longest streak', S.streak.best)}</div>
    <div class="card" style="margin-bottom:24px"><div class="goalrow"><span class="label">Pop quiz history · 测验</span><b>${S.quizzes.length ? `Retention ${retention()}% · last 5` : 'First quiz after level 3'}</b></div>
      <div class="qhist">${S.quizzes.slice(-20).map((q) => `<span title="${q.ok} / ${q.n}"><i style="height:${Math.max(4, Math.round((q.ok / q.n) * 100))}%"></i></span>`).join('') || '<em class="smoke">No quizzes yet.</em>'}</div></div>
    <div class="badges">${BADGES.map(([id, hz, name, desc]) => `<div class="badge ${S.badges[id] ? '' : 'locked'}"><span class="bs">${hz}</span><div><div class="bn">${esc(name)}</div><div class="bd">${esc(desc)}</div></div></div>`).join('')}</div>`, brush(sayingOfDay()[0], 'font-size:260px;right:-70px;top:30px;color:var(--ink);opacity:.07')),
  (e) => e.key === 'Escape' && go('home'));
}
function settings() {
  const st = S.settings;
  const webVoices = !nativeVoices.length && window.speechSynthesis ? speechSynthesis.getVoices().filter((v) => /^zh/i.test(v.lang)).map((v) => v.name) : [];
  const voices = nativeVoices.length ? nativeVoices : webVoices;
  render(shell('', `<div class="pagehead"><div class="label">天天 · Tiāntiān</div><h1>Settings</h1></div>
    <div class="label formhead">Voice</div><div class="form">
      <div class="frow"><div><div class="lbl">Mandarin voice</div><div class="hint">${voices.length ? 'Premium voices sound most natural.' : 'No Mandarin voice found. Add one in System Settings › Accessibility › Spoken Content › System voice › Manage Voices › Chinese (China mainland).'}</div></div>
        ${voices.length ? `<select id="voice">${voices.map((v) => `<option ${v === st.voice ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>` : ''}</div>
      <div class="frow"><div class="lbl">Speed</div><select id="rate"><option value="normal" ${st.rate === 'normal' ? 'selected' : ''}>Normal</option><option value="slow" ${st.rate === 'slow' ? 'selected' : ''}>Slow</option></select></div>
      <div class="frow"><div class="lbl">Test</div><button class="btn-outline" id="test">${I.speaker} 你好，我们开始吧</button></div>
    </div>
    <div class="label formhead">Characters</div><div class="form">
      <div class="frow"><div><div class="lbl">Study font · <span class="kai" style="font-size:20px">楷体 天天</span></div><div class="hint">Characters use Kaiti SC. If they don't look brush-written, open Font Book, search “Kaiti SC”, and click Download.</div></div></div>
    </div>
    <div class="label formhead">Writing</div><div class="form">
      <div class="frow"><div><div class="lbl">Stroke checking</div><div class="hint">Relaxed accepts strokes that are roughly right in shape and direction (easier on a trackpad). Normal is stricter.</div></div>
        <select id="strokes"><option value="relaxed" ${(st.strokes || 'relaxed') === 'relaxed' ? 'selected' : ''}>Relaxed</option><option value="normal" ${st.strokes === 'normal' ? 'selected' : ''}>Normal</option></select></div>
    </div>
    <div class="label formhead">Goals and reminders</div><div class="form">
      <div class="frow"><div><div class="lbl">Weekly goal</div><div class="hint">Days per week you finish today's plan. Hitting it earns 100 XP.</div></div>
        <select id="goal">${[3, 4, 5, 6, 7].map((n) => `<option ${n === S.weeklyGoal ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="frow"><div><div class="lbl">Daily reminder</div><div class="hint">Skipped if you've already practiced that day.</div></div>
        <div style="display:flex;gap:12px;align-items:center"><input type="time" id="rtime" value="${st.reminderTime}"><button class="switch ${st.reminderOn ? 'on' : ''}" id="ron" aria-label="Daily reminder"></button></div></div>
      <div class="frow"><div><div class="lbl">Open at login</div><div class="hint">Runs quietly in the background so reminders arrive. Closing the window keeps it running; ⌘Q quits.</div></div>
        <button class="switch ${st.openAtLogin ? 'on' : ''}" id="login" aria-label="Open at login"></button></div>
    </div>
    <div class="label formhead">Jinan conversations · local AI</div><div class="form">
      <div class="frow"><div><div class="lbl">Improvise with local AI</div><div class="hint">Characters follow hand-written scripts. When they don't understand you, a model running on this Mac (Ollama) improvises a reply and double-checks your grammar. Nothing goes online. Chats work without it.</div></div>
        <button class="switch ${AI.cfg().on ? 'on' : ''}" id="aion" aria-label="Local AI"></button></div>
      <div class="frow"><div><div class="lbl">Status</div><div class="hint" id="aihint">Checking…</div></div><button class="btn-outline" id="aichk">Check again</button></div>
      <div class="frow"><div><div class="lbl">Model</div><div class="hint">Any Ollama chat model. Default: ${AI.DEF.model}</div></div><input id="aimodel" value="${esc(AI.cfg().model)}" spellcheck="false" style="width:200px"></div>
    </div>
    <div class="label formhead">Progress</div><div class="form">
      <div class="frow"><div><div class="lbl">Back up</div><div class="hint">Saves a file you can restore later. Daily backups are also kept automatically.</div></div><div style="display:flex;gap:10px"><button class="btn-outline" id="exp">Export</button><button class="btn-outline" id="imp">Import</button></div></div>
      <div class="frow"><div class="lbl">Reset everything</div><button class="btn-outline btn-danger" id="reset">Reset</button></div>
    </div>
    <p class="credits">Every day, a little Chinese. Vocabulary: Complete HSK Vocabulary (MIT), CC-CEDICT definitions. Stroke data: Hanzi Writer / Make Me a Hanzi (Arphic Public License). Fonts: Archivo, Noto Sans SC and Liu Jian Mao Cao (SIL Open Font License).</p>`),
  (e) => e.key === 'Escape' && go('home'), () => {
    on('#voice', 'change', (e) => { st.voice = e.target.value; save(); speak('你好'); });
    on('#rate', 'change', (e) => { st.rate = e.target.value; save(); });
    on('#test', 'click', () => speak('你好，我们开始吧'));
    on('#goal', 'change', (e) => { S.weeklyGoal = +e.target.value; save(); });
    on('#strokes', 'change', (e) => { st.strokes = e.target.value; save(); });
    on('#rtime', 'change', (e) => { st.reminderTime = e.target.value; syncReminder(); save(); });
    on('#ron', 'click', (e) => { st.reminderOn = !st.reminderOn; e.currentTarget.classList.toggle('on', st.reminderOn); syncReminder(); save(); });
    on('#login', 'click', (e) => { st.openAtLogin = !st.openAtLogin; e.currentTarget.classList.toggle('on', st.openAtLogin); bridge.setLogin(st.openAtLogin); save(); });
    const aiShow = async (force) => {
      const h = root.querySelector('#aihint'); if (!h) return;
      h.textContent = 'Checking…';
      const r = await AI.check(force); const m = AI.cfg().model;
      if (!root.querySelector('#aihint')) return;
      h.innerHTML = r.unsupported ? 'Available in the Mac app.'
        : !r.running ? 'Ollama isn\'t running. To set it up: install Ollama from ollama.com, open it, then in Terminal run <code>ollama pull ' + esc(m) + '</code>. Plug in and turn off Low Power Mode for the best speed.'
        : !r.hasModel ? 'Ollama is running, but ' + esc(m) + ' isn\'t downloaded. In Terminal run <code>ollama pull ' + esc(m) + '</code>.'
        : '<b style="color:var(--spring)">Ready</b> · ' + esc(m) + ' on this Mac';
    };
    aiShow(true);
    on('#aichk', 'click', () => aiShow(true));
    on('#aion', 'click', (e) => { AI.cfg().on = !AI.cfg().on; e.currentTarget.classList.toggle('on', AI.cfg().on); save(); });
    on('#aimodel', 'change', (e) => { AI.cfg().model = e.target.value.trim() || AI.DEF.model; save(); aiShow(true); });
    on('#exp', 'click', async () => { if (await bridge.exportData(S)) toast('Progress exported'); });
    on('#imp', 'click', async () => {
      const d = await bridge.importData();
      if (!d || !d.words) { if (d !== null) toast("That file doesn't look like 天天 progress"); return; }
      S = merge(DEFAULT(), d); save(); toast('Progress imported'); go('home');
    });
    on('#reset', 'click', () => { if (confirm('Erase all progress? This cannot be undone (daily backups remain).')) { const s = S.settings; S = DEFAULT(); S.settings = s; save(); go('home'); } });
  });
}
function syncReminder() { bridge.setReminder({ on: S.settings.reminderOn, time: S.settings.reminderTime, lastPractice: S.streak.last }); }

// ---------------------------------------------------------------- browser fallback (for previewing outside the Mac app)
function mockApi() {
  return {
    load: async () => { try { return JSON.parse(localStorage.getItem('tiantian')); } catch { return null; } },
    save: async (d) => { try { localStorage.setItem('tiantian', JSON.stringify(d)); } catch {} },
    exportData: async (d) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(d)])); a.download = 'tiantian-progress.json'; a.click(); return true; },
    importData: async () => null,
    voices: async () => [], speak: async () => false, stopSpeak: async () => true,
    micAccess: async () => true, setReminder: async () => true, setLogin: async () => true, platform: 'web'
  };
}

window.__item = () => sess && sess.items && sess.items[sess.i];

// ---------------------------------------------------------------- boot
(async function boot() {
  const d = await bridge.load();
  if (d) S = merge(DEFAULT(), d);
  (S.extraWords || []).forEach((w) => { W[w.id] = w; });   // words picked up in Jinan conversations
  if (!d || (d.v || 1) < 2) {
    // v2: freezes start at 3; backfill study dates from the current streak run.
    S.streak.freezes = FREEZE_MAX;
    if (S.streak.last && S.streak.count) for (let i = 0; i < S.streak.count; i++) { const x = new Date(S.streak.last + 'T12:00'); x.setDate(x.getDate() - i); if (!S.days.includes(today(x))) S.days.push(today(x)); }
    S.v = 2; save();
  }
  sayingOfDay();
  await initVoices();
  syncReminder();
  try { await document.fonts.ready; } catch {}
  home();
})();
