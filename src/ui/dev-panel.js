// Dev panel (toggle with the ` key). Used for testing: jump to a beat, mark words, move the clock, inspect the save.
import { lookup } from '../lexicon.js';
import { learnWord, grade, dueIds } from '../core/srs.js';
import { setOffsetDays, getOffsetDays, now, DAY } from '../core/clock.js';
import { downloadSave, parseImport, readFileText } from '../save/transfer.js';
import { BEATS, OPENING } from '../beats.js';

export function initDevPanel({ store, toast, onChange }) {
  let panel = null;
  const S = () => store.state;

  const fireChange = () => { store.save(); onChange && onChange(); render(); };
  const wordKey = (text) => { const e = lookup(text.trim()); return e ? String(e.id) : null; };

  function shiftDays(d) {
    // moving the clock forward makes words due; the offset is kept in the save so it survives a reload
    S().dev.dayOffset = (S().dev.dayOffset || 0) + d; setOffsetDays(S().dev.dayOffset); fireChange();
  }
  function mark(kind) {
    const inp = panel.querySelector('#dvword'); const parts = inp.value.split(/[\s,，、]+/).filter(Boolean);
    const bad = [];
    for (const p of parts) {
      const id = wordKey(p); if (!id) { bad.push(p); continue; }
      if (kind === 'seen') S().seen[id] = true;
      else if (kind === 'caught') { learnWord(S(), id, 1); S().seen[id] = true; }
      else if (kind === 'mastered') { learnWord(S(), id, 1); const w = S().words[id]; w.ivl = 30; w.reps = 6; w.due = now() + 20 * DAY; S().seen[id] = true; }
      else if (kind === 'due') { learnWord(S(), id, 1); S().words[id].due = now() - 1000; S().seen[id] = true; }
      else if (kind === 'lapse') { learnWord(S(), id, 1); grade(S(), id, false); S().words[id].due = now() - 1000; }
      else if (kind === 'forget') { delete S().words[id]; delete S().seen[id]; }
    }
    if (bad.length) toast('Unknown: ' + bad.join(' '));
    fireChange();
  }

  function render() {
    if (!panel) return;
    const s = S(), p = s.progress;
    panel.innerHTML = `<h2>Dev panel <span class="note" style="color:#aaa">( \` closes )</span></h2>
      <h4>Jump to a beat</h4>
      <div class="row"><select id="dvbeat">${BEATS.map((b, i) => `<option value="${i}" ${p.beat === i ? 'selected' : ''}>${i + 1}. ${b.title}</option>`).join('')}<option value="6" ${p.beat === 6 ? 'selected' : ''}>All beats done</option></select>
        <select id="dvstep">${['refresh', 'learn', 'use', 'notebook'].map((x) => `<option ${p.beatStep === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        <button class="btn" id="dvjump">Go</button></div>
      <p class="note" style="color:#aaa">Jumping skips the opening and marks all earlier beats' words as caught.</p>
      <h4>Words (type characters, e.g. 你好 杯子)</h4>
      <div class="row"><input id="dvword" style="width:11em" placeholder="你好 杯子"><button class="btn" data-m="seen">seen</button><button class="btn" data-m="caught">caught</button><button class="btn" data-m="due">due</button><button class="btn" data-m="lapse">lapsed</button><button class="btn" data-m="mastered">mastered</button><button class="btn" data-m="forget">forget</button></div>
      <h4>Clock: day ${getOffsetDays()} ahead · ${dueIds(s).length} words due</h4>
      <div class="row"><button class="btn" data-d="1">+1 day</button><button class="btn" data-d="7">+7</button><button class="btn" data-d="21">+21</button><button class="btn" data-d="-1">−1</button><button class="btn" data-d="reset">back to now</button></div>
      <h4>Testing</h4>
      <label class="toggle"><input type="checkbox" id="dvauto" ${s.dev.autoAnswer ? 'checked' : ''}> show the right answer on every question (test answers)</label>
      <h4>Save</h4>
      <div class="row"><button class="btn" id="dvexp">Export</button><label class="btn">Import<input type="file" id="dvimp" accept="application/json" hidden></label><button class="btn danger" id="dvreset">Reset save</button></div>
      <pre id="dvjson">${JSON.stringify(s, null, 1).replace(/</g, '&lt;')}</pre>`;
    panel.querySelector('#dvjump').onclick = () => jump(+panel.querySelector('#dvbeat').value, panel.querySelector('#dvstep').value);
    panel.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => mark(b.dataset.m)));
    panel.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => (b.dataset.d === 'reset' ? shiftDays(-getOffsetDays()) : shiftDays(+b.dataset.d))));
    panel.querySelector('#dvauto').onchange = (e) => { S().dev.autoAnswer = e.target.checked; store.save(); };
    panel.querySelector('#dvexp').onclick = () => downloadSave(S());
    panel.querySelector('#dvimp').onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { store.replace(parseImport(await readFileText(f))); toast('Save imported'); onChange && onChange(); render(); } catch (err) { toast(err.message); }
    };
    panel.querySelector('#dvreset').onclick = () => { if (confirm('Reset the whole save?')) { store.reset(); store.save(); toast('Save reset'); onChange && onChange(); render(); } };
  }

  function jump(beat, step) {
    const s = S();
    s.progress.stage = 'district';
    s.progress.beat = beat; s.progress.beatStep = step;
    // the opening and earlier beats count as played: their words become caught
    for (const b of [OPENING, ...BEATS.slice(0, beat)]) for (const w of b.words || []) { const e = lookup(w); if (e) { learnWord(s, String(e.id), 1); s.seen[String(e.id)] = true; delete s.pending[String(e.id)]; } }
    fireChange(); toast('Jumped to beat ' + (beat + 1));
  }

  function toggle() {
    if (panel) { panel.remove(); panel = null; return; }
    panel = document.createElement('div'); panel.className = 'devpanel'; panel.setAttribute('data-nohz', '');
    document.getElementById('overlay').appendChild(panel); render();
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' && !/input|textarea|select/i.test(e.target.tagName)) { e.preventDefault(); toggle(); }
  });
  store.subscribe(() => { if (panel) { const y = panel.scrollTop; render(); panel.scrollTop = y; } });
  return { toggle, render };
}
