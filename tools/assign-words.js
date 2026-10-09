// Assigns Baotu's words to its six beats (CONCEPT §2.2, §5.1) and prints the list for review.
//   node tools/assign-words.js            print the plan
//   node tools/assign-words.js --write    also write content/baotu-words.json (superseded: the content is the source now, see tools/write-baotu-words.js)
//
// Method:
//  1. Collect every word in the §5.1 key lines, the opening and notebook page 1 (segmented against HSK 1 + lexicon).
//  2. Each word goes to the first beat whose lines use it (the opening's words go to the Hook: they are taught there).
//  3. Words first met only in the notebook page or the Resolution move forward to earlier beats with room,
//     so the page can be read at Payoff and the last beats stay small (3-5 words).
//  4. Beats below their minimum are topped up from the district theme (greetings, people, countries, numbers 1-10).
import fs from 'node:fs';
import { segment } from './lib/hsk.js';
import { allowedFor } from './lib/zhcheck.js';

const allowed = allowedFor('baotu');
const SKIP_KINDS = new Set(['name', 'particle', 'fixed']);
const NUMS = new Set(['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '两']);

// §5.1 lines, by beat (the source text, copied from CONCEPT.md)
const SOURCE = {
  // the opening taxi ride and handover: answers are 是 / 不是; the notebook shows 「七十三」 on day one
  opening: ['你好！', '你是游客吗？是。不是。', '谢谢！', '这是你的本子。', '七十三'],
  hook: ['不是', '是', '孩子，你好！我是王奶奶。', '我的杯子没有了！', '是一个白杯子。'],
  inv1: ['你好！你叫什么名字？', '你是哪国人？', '我看见了。一个孩子，拿了一个白杯子。'],
  inv2: ['你是游客吗？门票四十块。', '白杯子 · 上午九点 · 四号门', '书 · 下午三点 · 东门', '手机 · 上午十点 · 北门'],
  inv3: ['四号门！他去了四号门！', '这儿没有十号门。', '东门', '西门', '南门', '北门', '四号门 → 左边', '前边，左边！'],
  challenge: ['你想要杯子吗？先回答我！', '三和四，是几？', '我有，你也有。我不能给你。是什么？', '五和三，是几？', '我是谁的孩子？', '名字', '对不起，我先走了。', '面子'],
  payoff: ['谢谢你，孩子！这是老周的杯子。', '老周天天早上都来这儿。他喝泉水，他说：七十三！',
    '孩子：你好！我是老周。你看到这个本子，我很高兴。', '济南有七十二名泉。你知道吗？还有一个泉。七十三。', '我找了很多年。现在，你来找吧。', '先去认识王奶奶。她做的饭很好吃。']
};
// Baotu teaches the basics, so its sets are bigger than §2.2's 5-10 (user choice A, DECISIONS.md #24).
const BEATS = [
  { id: 'opening', title: 'Opening · Old Pan\'s taxi, the key and the notebook', min: 10, max: 13 },
  { id: 'hook', title: 'Hook · Grandma Wang\'s thermos', min: 10, max: 12 },
  { id: 'inv1', title: 'Investigate 1 · tai chi group', min: 10, max: 13 },
  { id: 'inv2', title: 'Investigate 2 · ticket window', min: 10, max: 13 },
  { id: 'inv3', title: 'Investigate 3 · fish pool and Gate 4', min: 8, max: 14 },   // two clues in one beat
  { id: 'challenge', title: 'Challenge · Lele\'s riddle duel', min: 6, max: 12 },
  { id: 'payoff', title: 'Resolution + notebook page 1', min: 6, max: 12 }
];
// Theme words to top up a beat that is short, in order of preference (HSK 1, all fit "greetings, people, countries, numbers")
const THEME = {
  opening: [],
  hook: ['您', '谢谢', '再见', '奶奶', '老师'],
  inv1: ['中国', '美国', '英国', '人', '认识', '高兴', '朋友'],
  inv2: ['多少', '钱', '一', '二', '两', '张', '票'],
  inv3: ['六', '八', '右边', '在', '哪儿'],
  challenge: ['五', '对'],
  payoff: ['爸爸', '妈妈']
};

const words = new Map();   // word → { first: beatId, kind, hits: Set(beatId) }
for (const b of BEATS) for (const line of SOURCE[b.id]) for (const t of segment(line, 1, allowed)) {
  if (SKIP_KINDS.has(t.kind)) continue;
  if (t.kind === 'over' || t.kind === 'unknown') { console.error('Not allowed in Baotu:', t.w, 'in', line); process.exitCode = 1; continue; }
  const e = words.get(t.w) || { w: t.w, kind: t.kind, first: b.id, hits: new Set() };
  e.hits.add(b.id); words.set(t.w, e);
}

// taught words are introduced where the story needs them: 游客 at the ticket window, 泉 at the spring (Hook), 面子 before the duel.
// 十 is in the opening so 「七十三」 is readable on day one; 四 waits for the ticket window (四十块), just before the 四 / 十 tone test.
const PIN = { 泉: 'hook', 游客: 'inv2', 面子: 'challenge', 十: 'opening', 四: 'inv2',
  我: 'opening', 九: 'inv2', 块: 'inv2', 东: 'inv3', 北: 'inv3', 想: 'hook', 要: 'hook', 先: 'hook', 说: 'inv1', 很: 'inv1', 找: 'inv1', 多: 'inv1', 年: 'inv1',
  天: 'inv3', 都: 'inv3', 来: 'inv3', 喝: 'inv3', 水: 'inv3' };   // the plan approved on Oct 9   // keep each word where its line is: 九点 and 四十块 at the window, the four directions together
// 白 is also a surname in the name list, so segmentation files it as a name; the Hook teaches it as "white"
const EXTRA = { 白: 'hook' };
const plan = Object.fromEntries(BEATS.map((b) => [b.id, []]));
for (const e of words.values()) plan[PIN[e.w] || e.first].push(e.w);
if (!plan.hook.includes('泉')) plan.hook.push('泉');
for (const [w, b] of Object.entries(EXTRA)) if (!Object.values(plan).flat().includes(w)) plan[b].push(w);

// 3. overfull late beats push words forward to the latest earlier beat with room
const order = BEATS.map((b) => b.id);
for (let i = order.length - 1; i > 0; i--) {
  const b = BEATS[i];
  while (plan[b.id].length > b.max) {
    // move the most common, simplest words first (short, not taught)
    const cand = plan[b.id].filter((w) => !PIN[w]).sort((a, c) => a.length - c.length)[0] || plan[b.id][0];
    let j = i - 1; while (j >= 0 && plan[order[j]].length >= BEATS[j].max) j--;
    if (j < 0) break;
    plan[b.id].splice(plan[b.id].indexOf(cand), 1); plan[order[j]].push(cand);
  }
}
// 4. top up short beats from the theme list
const used = new Set(Object.values(plan).flat());
for (const b of BEATS) for (const w of THEME[b.id]) { if (plan[b.id].length >= b.min) break; if (!used.has(w)) { plan[b.id].push(w); used.add(w); } }

// report
const total = Object.values(plan).flat();
const { lexicon } = await import('./lib/hsk.js');
const LX = JSON.parse(fs.readFileSync(new URL('../content/lexicon.json', import.meta.url)));
const taught = Object.fromEntries(LX.taught.baotu.map(([h, p, m]) => [h, `${p} · ${m} ★ taught`]));
const gloss = (w) => (w === '白' ? 'bái · white' : taught[w]) || (lexicon.get(w) ? `${lexicon.get(w).p} · ${lexicon.get(w).m}` : '?');
for (const b of BEATS) {
  console.log(`\n${b.title}  (${plan[b.id].length} words, target ${b.min}-${b.max})`);
  for (const w of plan[b.id]) console.log(`  ${w.padEnd(4, '　')} ${gloss(w)}`);
}
console.log(`\nTotal: ${total.length} words (${total.filter((w) => taught[w]).length} taught, ${total.filter((w) => !taught[w]).length} HSK 1)`);
if (process.argv.includes('--write')) {
  fs.writeFileSync(new URL('../content/baotu-words.json', import.meta.url), JSON.stringify({ _about: 'Generated by tools/assign-words.js. Words each Baotu beat teaches.', beats: BEATS.map((b) => ({ id: b.id, words: plan[b.id] })) }, null, 2) + '\n');
  console.log('wrote content/baotu-words.json');
}
