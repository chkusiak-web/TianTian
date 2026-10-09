// Plays whatever is on screen using the dev panel's test answers (data-dev-ok / data-dev-answer).
// Returns when `until()` is true in the page, or throws after `ms`.
export async function autoplay(page, until, { ms = 120000, onStep } = {}) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (await page.evaluate(until)) return;
    const did = await page.evaluate(() => {
      const vis = (el) => el && el.offsetParent !== null && !el.disabled;
      const q = (s) => [...document.querySelectorAll(s)].find(vis);
      const click = (el) => { el.click(); return true; };
      let el;
      if ((el = q('.confirm .cgo'))) return click(el) && 'confirm';
      const build = q('.build[data-dev-answer]');
      if (build && !build.querySelector('.bcheck').disabled) {
        const want = build.dataset.devAnswer.split('|');
        const placed = [...build.querySelectorAll('.slots .tile')].map((b) => b.textContent);
        if (placed.length < want.length) {
          const t = [...build.querySelectorAll('.tiles .tile')].find((b) => !b.disabled && b.textContent === want[placed.length]);
          if (t) return click(t) && 'tile';
        }
        return click(build.querySelector('.bcheck')) && 'check';
      }
      for (const s of ['[data-dev-ok]', '.storycard button', '.inext', '.rshow button', '.rmark [data-ok="1"]', '.dnext', '.nbclose', '#hudToday'])
        if ((el = q(s))) return click(el) && s;
      return null;
    });
    if (onStep && did) onStep(did);
    await page.waitForTimeout(did ? 40 : 150);
  }
  throw new Error('autoplay timed out');
}
