// Use (CONCEPT §2.1): the scene's conversation, in the dialogue box over the map.
// Lines are spoken and hoverable. Prompts: pick an answer (Listening/Reading) or build one from tiles (Speaking).
// A right answer without a pinyin hint catches the new words in it. Nothing in a scene is a gate (§2.1).
// Conversation rules (§6.11): reply choices with a nonsense option, audio-first listening, repair lines after a
// missed listening or reading question, recasts for near misses. Challenges keep their hearts (§6.1).
import { openModal, closeModal } from '../ui/modal.js';
import { askChoice, askBuild, confirmBox, esc, speak, gloss } from './quiz-ui.js';
import { wordsIn, lookup } from '../lexicon.js';
import { catchWord, markSeen, addCtx } from '../core/words.js';
import { Paused } from '../ui/panel.js';
import { shuffle, requeue } from './drills.js';
import { todayKey } from '../core/clock.js';

// vocabulary in a line: HSK and taught words (names and particles are never 'caught')
// a hidden listening line: a play button and a waveform
const WAVE = [3, 6, 9, 5, 11, 7, 4, 8, 12, 6, 3, 7, 10, 5, 3, 6, 9, 4];
const listenHtml = () => `<div class="listen"><button class="play" aria-label="Play the line again">▶</button><div class="wave" aria-hidden="true">${WAVE.map((v) => `<i style="height:${v * 0.16}em"></i>`).join('')}</div></div>`;

const idsIn = (text) => wordsIn(text).map((t) => lookup(t)).filter((e) => e && (!e.kind || e.kind === 'taught')).map((e) => String(e.id));

// Repair lines (CONCEPT §6.11 rule 3), taught in the opening; used once every word in them is known.
export const REPAIR = ['什么？', '请再说。', '慢一点儿！', '我不知道。'];
const CONFUSED = '啊？什么？';
const devOn = () => { try { return !!window.__store.state.dev.autoAnswer; } catch { return false; } };

export function runConversation({ use, store, cast, portraitFor, sessionId, onAt, known = [] }) {
  const S = store.state;
  const knownSet = new Set(known);
  const repairOn = REPAIR.every((l) => wordsIn(l).every((w) => knownSet.has(w)));
  let keyFn = null;
  const keyTap = (e) => { if (keyFn && !/^(input|textarea|select)$/i.test(e.target.tagName)) keyFn(e); };
  const result = { misses: 0, hints: 0, caught: [] };
  const silentToday = () => { const m = S.settings.silent; return !!(m && m.on && m.date === todayKey()); };
  return new Promise((resolve, reject) => {
    const el = document.createElement('div');
    el.className = 'dialogue convo panel';
    el.setAttribute('role', 'dialog');
    let finished = false;
    openModal(el, { onClose: () => { if (!finished) reject(new Paused()); } });

    let advance = null;
    const wait = () => new Promise((res) => { advance = res; });
    const onKey = (e) => { if (advance && (e.key === ' ' || e.key === 'Enter') && !/^(input|textarea)$/i.test(e.target.tagName)) { e.preventDefault(); e.stopPropagation(); const a = advance; advance = null; a(); } };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('keydown', keyTap);

    let heartsNow = null;   // { hearts, start } during a challenge
    const heartsHtml = () => heartsNow ? `<span class="hearts" aria-label="面子: ${heartsNow.hearts} of ${heartsNow.start}"><b class="zh">面子</b>${'<i class="h on">♥</i>'.repeat(heartsNow.hearts)}${'<i class="h">♥</i>'.repeat(Math.max(0, heartsNow.start - heartsNow.hearts))}</span>` : '';
    const frame = (step) => {
      const who = step.npc && cast[step.npc];
      const p = step.npc && portraitFor(step.npc, step.face);
      el.classList.toggle('narration', !step.npc);
      el.innerHTML = `${step.npc ? `<div class="portrait">${p ? `<img src="${esc(p.src)}" alt="" class="${p.pixel ? 'pixel' : ''}">` : ''}</div>` : ''}
        <div class="dbody">${who ? `<div class="dname">${who.name ? `<span class="zh">${esc(who.name)}</span> ` : ''}<span class="den">${esc(who.en)}</span><span class="tagq" hidden></span>${heartsHtml()}</div>` : heartsHtml()}
        <div class="dline"></div><div class="dask"></div><div class="dfoot"></div></div>`;
      return { line: el.querySelector('.dline'), ask: el.querySelector('.dask'), foot: el.querySelector('.dfoot') };
    };
    const say = (box, step, slow) => {
      box.line.classList.add('zh'); box.line.classList.toggle('signline', !!step.sign); box.line.textContent = step.zh;
      const ids = idsIn(step.zh); markSeen(S, ids); ids.forEach((id) => addCtx(S, id, step.zh, sessionId));
      speak(step.zh, { who: step.npc, ...(slow || step.slow ? { slow: true } : {}) });
    };
    const nextBtn = (box, label = 'Next') => { box.foot.innerHTML = `<button class="icon-btn dsay" aria-label="Listen again">🔊</button><button class="btn primary dnext">${label} <kbd>Space</kbd></button>`; box.foot.querySelector('.dnext').onclick = () => { if (advance) { const a = advance; advance = null; a(); } }; };

    // Text helpers for the rules below
    const npcLine = async (step, zh, { face, under, slow } = {}) => {   // someone says something and you click on
      const box = frame({ ...step, face: face || step.face });
      box.line.classList.add('zh'); box.line.classList.remove('signline'); box.line.textContent = zh;
      if (under) box.line.insertAdjacentHTML('beforeend', `<div class="recast">${under}</div>`);
      const o = { who: step.npc, ...(slow ? { slow: true } : {}) };
      speak(zh, o); nextBtn(box);
      box.foot.querySelector('.dsay').onclick = () => speak(zh, o);
      await wait();
    };
    const tokens = (zh) => wordsIn(zh);
    const tag = (box, label) => {
      const tq = el.querySelector('.tagq');
      if (tq) { tq.textContent = label.split(' · ')[0]; tq.hidden = false; }
      return tq;
    };
    const catchSaid = (said) => { for (const id of idsIn(said)) { if (catchWord(S, id)) result.caught.push(id); addCtx(S, id, said, sessionId); } };

    // A listening or reading question. They say a line (its text hidden until you answer, or until you've replayed it
    // twice: §6.11 rule 2) or show it, and you pick. A miss outside a challenge gets no ✗: you ask them to repeat it
    // with a repair line, they say it again (slower for 慢一点儿), and you answer once more (rule 3).
    async function choicePrompt(step, { duel = false, again = false, options = step.options } = {}) {
      const box = frame(step);
      const hidden = step.ask === 'listen' && step.zh && !silentToday();
      if (step.zh) {
        say(box, step, again && again.slow);
        if (hidden) {
          box.line.innerHTML = listenHtml(); box.line.classList.add('hiddenline');
          let plays = 0;
          box.line.querySelector('.play').onclick = () => { speak(step.zh, { who: step.npc }); if (++plays >= 2) reveal(); };
        } else { box.foot.innerHTML = `<button class="icon-btn dsay" aria-label="Listen again">🔊</button>`; box.foot.querySelector('.dsay').onclick = () => speak(step.zh, { who: step.npc }); }
      }
      function reveal() { if (box.line.classList.contains('hiddenline')) { box.line.textContent = step.zh; box.line.classList.remove('hiddenline'); } }
      const tq = tag(box, step.label);
      box.ask.innerHTML = `${tq ? '' : `<div class="label">${esc(step.label)}</div>`}<div class="q">${esc(step.q)}</div><div class="qarea"></div>`;
      const area = box.ask.querySelector('.qarea');
      const canRepair = repairOn && !!step.npc && !again;
      const r = await askChoice(area, { options: options.map((o) => ({ html: esc(o), value: o, zh: true })), answer: step.answer, answerHtml: esc(step.answer), glossText: gloss(step.answer), soft: canRepair });
      if (hidden) reveal();
      if (r.ok) { catchSaid(step.answer); store.save(); return r; }
      result.misses++; store.save();
      if (!canRepair) return r;
      const fix = await repairLine(step);
      if (duel) return r;   // in a challenge the heart is lost and the prompt comes back later
      const r2 = await choicePrompt(step, { again: { slow: fix === '慢一点儿！' }, options: options.filter((o) => o !== r.value) });
      return { ...r2, ok: false };
    }

    // After a miss: you build one of the repair lines from its tiles (rule 3).
    async function repairLine(step) {
      const box = frame(step);
      tag(box, 'Repair');
      box.line.innerHTML = '<em>You didn\'t catch that. Ask them to say it again.</em>';
      box.ask.innerHTML = '<div class="q">What do you say?</div><div class="qarea"></div>';
      const all = [...new Set(REPAIR.flatMap(tokens))];
      const want = tokens(REPAIR[1]);
      const r = await askBuild(box.ask.querySelector('.qarea'), { answer: REPAIR[1], accept: REPAIR.filter((x) => x !== REPAIR[1]), extra: all.filter((t) => !want.includes(t)), allowHint: false, soft: true });
      const said = REPAIR.find((x) => tokens(x).join('|') === tokens(r.said).join('|'));
      if (said) catchSaid(said);
      return said || REPAIR[1];
    }

    // A speaking prompt: build the answer from tiles. Outside a challenge, a near miss is recast (the NPC says it back
    // correctly and goes on, rule 4) and a wrong answer gets 「啊？什么？」 and another go; a second wrong one shows the answer.
    async function buildPrompt(step, { duel = false, q = step.q, tries = 0 } = {}) {
      const box = frame(step);
      if (step.zh) say(box, step);
      const tq = tag(box, step.label || 'Speaking');
      box.ask.innerHTML = `${tq ? '' : `<div class="label">${esc(step.label || 'Speaking')}</div>`}<div class="q">${esc(q)}</div><div class="qarea"></div>`;
      const area = box.ask.querySelector('.qarea');
      const soft = !duel && !!step.npc;
      const r = await askBuild(area, { answer: step.answer, accept: step.accept || [], optional: step.optional || [], extra: step.extra || [], soft });
      if (r.hint) result.hints++;
      if (r.ok) { if (!r.hint) catchSaid(r.said || step.answer); store.save(); return r; }
      result.misses++; store.save();
      if (!soft) return r;
      if (r.verdict === 'near') {
        const right = step.recast || step.answer;
        await npcLine(step, right, { under: `<span class="mark">↻</span> <b class="zh">${esc(step.answer)}</b> <span class="note">You said ${esc(r.said)}</span>` });
        return { ...r, near: true };
      }
      if (tries === 0) {
        await npcLine(step, CONFUSED, { face: 'confused' });
        return buildPrompt(step, { duel, q, tries: 1 });
      }
      await confirmBox(area, false, esc(step.answer), gloss(step.answer));
      return r;
    }

    const prompt = (step, opts) => (step.ask ? choicePrompt(step, opts) : buildPrompt(step, opts));

    // Reply choices (rule 1): pick what to say, then build it. A sensible reply gets its own reaction (`then`);
    // a nonsense one gets confusion and you choose again. Choices only change reactions, never the clue path.
    async function replyStep(step) {
      let opts = shuffle(step.options);
      for (;;) {
        const box = frame(step);
        if (step.zh) say(box, step);
        const tq = tag(box, step.label || 'Speaking · reply');
        box.ask.innerHTML = `${tq ? '' : `<div class="label">${esc(step.label || 'Speaking')}</div>`}<div class="q">${esc(step.q)}</div><div class="qarea"></div>`;
        const dev = opts.find((o) => !o.nonsense);
        const pick = await new Promise((res) => {
          const wrap = document.createElement('div');
          wrap.className = 'choices answers replies';
          wrap.innerHTML = opts.map((o, i) => `<button class="btn choice zh" data-i="${i}" ${devOn() && o === dev ? 'data-dev-ok="1"' : ''}><kbd>${i + 1}</kbd> ${esc(o.zh)}</button>`).join('');
          box.ask.querySelector('.qarea').appendChild(wrap);
          wrap.querySelectorAll('.choice').forEach((b) => (b.onclick = () => res(opts[+b.dataset.i])));
          keyFn = (e) => { const n = +e.key; if (n >= 1 && n <= opts.length) { e.preventDefault(); res(opts[n - 1]); } };
        });
        keyFn = null;
        if (pick.nonsense) {
          result.misses++;
          await npcLine(step, pick.react || CONFUSED, { face: 'confused' });
          opts = opts.filter((o) => o !== pick);
          continue;
        }
        const others = [...new Set(opts.filter((o) => o !== pick).flatMap((o) => tokens(o.zh)))].filter((t) => !tokens(pick.zh).includes(t));
        await buildPrompt({ npc: step.npc, face: step.face, label: step.label || 'Speaking · reply', answer: pick.zh, accept: pick.accept, recast: pick.recast, extra: pick.extra || others.slice(0, 2) }, { q: 'Say it.' });
        return pick;
      }
    }

    // A conversation challenge (CONCEPT §6.1): hearts (面子) are the mistakes you're allowed. A miss costs a heart and
    // the prompt comes back two prompts later; 3 right in a row gives a heart back. Out of hearts, you excuse yourself
    // and try again at once with the prompts reshuffled. Nothing is lost.
    async function duel(d) {
      const start = d.hearts - (d.loseOn && S.progress[d.loseOn] ? 1 : 0);
      for (let round = 0; ; round++) {
        let hearts = start, streak = 0;
        const q = round ? shuffle(d.prompts) : [...d.prompts];
        for (let i = 0; i < q.length && hearts > 0; i++) {
          heartsNow = { hearts, start };
          const r = await prompt(q[i], { duel: true });
          if (r.ok) { if (++streak % 3 === 0 && hearts < start) hearts++; }
          else { hearts--; streak = 0; requeue(q, i, q[i]); }
          heartsNow = { hearts, start };
        }
        heartsNow = null;
        if (hearts > 0) { S.progress[d.win || 'challengeWon'] = true; store.save(); return; }
        const box = frame({});
        box.line.innerHTML = `<em>Out of face. You say:</em> <span class="zh">${esc(d.retreat)}</span><br><em>Nothing is lost. The riddles are shuffled; try again.</em>`;
        nextBtn(box, 'Try again'); box.foot.querySelector('.dsay').onclick = () => speak(d.retreat);
        await wait();
      }
    }

    (async () => {
      const steps = [...use.steps];
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.at && onAt) onAt(step.at);   // the scene moves on (the arrival's taxi)
        if (step.duel) { await duel(step.duel); continue; }
        if (step.reply) { const pick = await replyStep(step); if (pick.then) steps.splice(i + 1, 0, ...pick.then); store.save(); continue; }
        const box = frame(step);
        if (step.note) {
          box.line.innerHTML = `<em>${esc(step.note)}</em>`; nextBtn(box); box.foot.querySelector('.dsay').remove();
          await wait(); continue;
        }
        if (!step.ask && !step.build) {
          say(box, step); nextBtn(box);
          box.foot.querySelector('.dsay').onclick = () => speak(step.zh, { who: step.npc });
          await wait(); continue;
        }
        const r = await prompt(step);
        if (!r.ok && !r.near) { if (step.flag) S.progress[step.flag] = true; if (step.onMiss) steps.splice(i + 1, 0, ...step.onMiss); }
        store.save();
      }
      finished = true;
      document.removeEventListener('keydown', onKey, true); document.removeEventListener('keydown', keyTap);
      closeModal();
      resolve(result);
    })().catch((e) => { document.removeEventListener('keydown', onKey, true); document.removeEventListener('keydown', keyTap); reject(e); });
  });
}
