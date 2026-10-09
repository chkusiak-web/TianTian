// Use (CONCEPT §2.1): the scene's conversation, in the dialogue box over the map.
// Lines are spoken and hoverable. Prompts: pick an answer (Listening/Reading) or build one from tiles (Speaking).
// A right answer without a pinyin hint catches the new words in it. A miss shows the answer and the scene goes on:
// nothing in a scene is a gate (§2.1).
import { openModal, closeModal } from '../ui/modal.js';
import { askChoice, askBuild, esc, speak, gloss } from './quiz-ui.js';
import { wordsIn, lookup } from '../lexicon.js';
import { catchWord, markSeen, addCtx } from '../core/words.js';
import { Paused } from '../ui/panel.js';
import { todayKey } from '../core/clock.js';

// vocabulary in a line: HSK and taught words (names and particles are never 'caught')
const idsIn = (text) => wordsIn(text).map((t) => lookup(t)).filter((e) => e && (!e.kind || e.kind === 'taught')).map((e) => String(e.id));

export function runConversation({ use, store, cast, portraitFor, sessionId, backdrop }) {
  const S = store.state;
  const result = { misses: 0, hints: 0, caught: [] };
  const silentToday = () => { const m = S.settings.silent; return !!(m && m.on && m.date === todayKey()); };
  return new Promise((resolve, reject) => {
    const el = document.createElement('div');
    el.className = 'dialogue convo panel';
    el.setAttribute('role', 'dialog');
    let bd = null;
    if (backdrop) { bd = document.createElement('div'); bd.className = 'backdrop'; bd.innerHTML = `<div class="bdplace">${esc(backdrop)}</div>`; document.getElementById('overlay').appendChild(bd); }
    let finished = false;
    openModal(el, { onClose: () => { if (bd) bd.remove(); if (!finished) reject(new Paused()); } });

    let advance = null;
    const wait = () => new Promise((res) => { advance = res; });
    const onKey = (e) => { if (advance && (e.key === ' ' || e.key === 'Enter') && !/^(input|textarea)$/i.test(e.target.tagName)) { e.preventDefault(); e.stopPropagation(); const a = advance; advance = null; a(); } };
    document.addEventListener('keydown', onKey, true);

    const frame = (step) => {
      const who = step.npc && cast[step.npc];
      const p = step.npc && portraitFor(step.npc);
      el.classList.toggle('narration', !step.npc);
      el.innerHTML = `${step.npc ? `<div class="portrait">${p ? `<img src="${esc(p.src)}" alt="" class="${p.pixel ? 'pixel' : ''}">` : ''}</div>` : ''}
        <div class="dbody">${who ? `<div class="dname">${who.name ? `<span class="zh">${esc(who.name)}</span> ` : ''}<span class="den">${esc(who.en)}</span></div>` : ''}
        <div class="dline"></div><div class="dask"></div><div class="dfoot"></div></div>`;
      return { line: el.querySelector('.dline'), ask: el.querySelector('.dask'), foot: el.querySelector('.dfoot') };
    };
    const say = (box, step) => {
      box.line.classList.add('zh'); box.line.textContent = step.zh;
      const ids = idsIn(step.zh); markSeen(S, ids); ids.forEach((id) => addCtx(S, id, step.zh, sessionId));
      speak(step.zh, { who: step.npc });
    };
    const nextBtn = (box, label = 'Next') => { box.foot.innerHTML = `<button class="icon-btn dsay" aria-label="Listen again">🔊</button><button class="btn primary dnext">${label} <kbd>Space</kbd></button>`; box.foot.querySelector('.dnext').onclick = () => { if (advance) { const a = advance; advance = null; a(); } }; };

    (async () => {
      for (const step of use.steps) {
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
        // a prompt
        // a listening question doesn't show the line until you've answered (silent mode shows it: it becomes reading)
        const hidden = step.ask === 'listen' && step.zh && !silentToday();
        if (step.zh) { say(box, step); if (hidden) { box.line.innerHTML = '<span class="note">🔊 Listen…</span>'; box.line.classList.add('hiddenline'); } box.foot.innerHTML = `<button class="icon-btn dsay" aria-label="Listen again">🔊</button>`; box.foot.querySelector('.dsay').onclick = () => speak(step.zh, { who: step.npc }); }
        box.ask.innerHTML = `<div class="label">${esc(step.label)}</div><div class="q">${esc(step.q)}</div><div class="qarea"></div>`;
        const area = box.ask.querySelector('.qarea');
        let r;
        if (step.ask) r = await askChoice(area, { options: step.options.map((o) => ({ html: esc(o), value: o, zh: true })), answer: step.answer, answerHtml: esc(step.answer), glossText: gloss(step.answer) });
        else r = await askBuild(area, { answer: step.answer, accept: step.accept || [], extra: step.extra || [] });
        if (r.hint) result.hints++;
        if (!r.ok) result.misses++;
        if (hidden) { box.line.textContent = step.zh; box.line.classList.remove('hiddenline'); }
        const said = r.said || step.answer;
        if (r.ok && !r.hint) for (const id of idsIn(said)) { if (catchWord(S, id)) result.caught.push(id); addCtx(S, id, said, sessionId); }
        store.save();
      }
      finished = true;
      document.removeEventListener('keydown', onKey, true);
      closeModal();
      resolve(result);
    })().catch((e) => { document.removeEventListener('keydown', onKey, true); reject(e); });
  });
}
