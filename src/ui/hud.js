// Corner display: where you are, what to do next, and buttons for the dictionary and settings.
// Also the "Space · Talk" prompt over whoever is in reach, and the in-world sign text.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = (tiles, total) => `${(tiles * 16 / total) * 100}%`;

export function createHud({ map, onSettings, onDictionary }) {
  const overlay = document.getElementById('overlay');
  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = `<div class="place"><span class="zh">${esc(map.name.zh)}</span> <span class="pen">${esc(map.name.en)}</span><span class="hint" id="hint"></span></div>
    <div class="hudbtns"><button class="btn" id="hudDict" title="Dictionary (⌘K)">词典</button><button class="btn" id="hudSet" title="Settings">⚙ Settings</button></div>`;
  overlay.appendChild(hud);
  hud.querySelector('#hudSet').onclick = onSettings;
  hud.querySelector('#hudDict').onclick = onDictionary;

  const labels = document.getElementById('labels');
  labels.innerHTML = '';
  for (const l of map.labels) {
    const d = document.createElement('div');
    d.className = 'wlabel' + (l.sign ? ' sign' : '');
    d.textContent = l.zh;
    d.style.left = pct(l.x, 480); d.style.top = pct(l.y, 270);
    labels.appendChild(d);
  }

  const prompt = document.createElement('div');
  prompt.className = 'reach'; prompt.hidden = true;
  labels.appendChild(prompt);

  return {
    setHint(text) { hud.querySelector('#hint').textContent = text ? 'Next: ' + text : ''; },
    showReach(t) {
      if (!t) { prompt.hidden = true; return; }
      prompt.hidden = false;
      prompt.innerHTML = `<kbd>Space</kbd> ${t.kind === 'sign' ? 'Read' : 'Talk'}`;
      prompt.style.left = `${(t.x / 480) * 100}%`;
      prompt.style.top = `${((t.y - (t.kind === 'sign' ? 22 : 30)) / 270) * 100}%`;
    }
  };
}
