import { test, expect } from '@playwright/test';

// Click through whatever the session shows, using the dev panel's test answers (dashed outlines on the right options).
// `miss` (optional) is called on each prompt; return true to answer it wrong on purpose.
async function play(page, { miss } = {}) {
  for (let i = 0; i < 1500; i++) {
    if (!(await page.locator('.session').count())) return;
    const act = await page.evaluate(() => {
      const vis = (el) => el && el.offsetParent !== null && !el.disabled && !el.hidden;
      const q = (s) => [...document.querySelectorAll(s)].filter(vis);
      if (q('#wok').length) return { sel: '#wok' };
      const tiles = q('.tile.cheat').sort((a, b) => a.dataset.order - b.dataset.order);
      if (tiles.length) return { sel: `.tile[data-k="${tiles[0].dataset.k}"]`, prompt: q('.tile').length > tiles.length ? null : 'build' };
      if (q('.tile').length) return { sel: '#check' };
      if (q('.opt.cheat').length && !document.querySelector('.opt.ok, .opt.bad')) return { sel: '.opt.cheat', prompt: document.querySelector('.pcard .label')?.textContent || 'drill' };
      for (const s of ['#knew', '#flip', '#next', '#go', '#dnext']) if (q(s).length) return { sel: s };
      return null;
    });
    if (!act) { await page.waitForTimeout(150); continue; }
    // a card can move on by itself while we click (right answers advance after a moment), so a missed click just loops
    const target = act.prompt && act.sel === '.opt.cheat' && miss && miss(act.prompt) ? '.opt:not(.cheat)' : act.sel;
    await page.locator(target).first().click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(60);
  }
  throw new Error('session did not finish');
}

test('checkpoint 3: opening, then the Hook beat end to end (Refresh → Learn → Use → Notebook)', async ({ page }) => {
  test.setTimeout(240000);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();

  // a fresh save opens the taxi ride
  await expect(page.locator('.session .stitle')).toContainText('Opening');
  await page.keyboard.press('`'); await page.check('#dvauto'); await page.keyboard.press('`');
  await expect(page.locator('.ssteps li.on')).toHaveText('Learn');
  await expect(page.locator('.card .label')).toContainText('New word · 1 / 12');
  // pausing keeps your place, and the corner hint takes you back
  await page.keyboard.press('Escape');
  await expect(page.locator('.session')).toHaveCount(0);
  await page.click('#hint');
  await expect(page.locator('.session .stitle')).toContainText('Opening');

  await play(page);
  const s1 = await page.evaluate(() => ({ p: window.__store.state.progress, caught: Object.keys(window.__store.state.words).length }));
  expect(s1.p.stage).toBe('district'); expect(s1.p.beat).toBe(0); expect(s1.caught).toBe(12);
  await expect(page.locator('#hint')).toContainText('Grandma Wang');

  // the notebook: 七十三 on top, nothing in focus yet
  await page.click('#hudBook');
  await expect(page.locator('.nbhead')).toHaveText('七十三');
  await expect(page.locator('.nbline.clear')).toHaveCount(0);
  await expect(page.locator('.smudge').first()).toBeVisible();
  await page.keyboard.press('Escape');

  // walk up to Grandma Wang and talk: the Hook session starts
  await page.evaluate(() => { const w = window.__scene.npcs.find((n) => n.id === 'wang'); window.__scene.player.setPosition(w.x + 20, w.y + 2); });
  await page.keyboard.down('ArrowLeft');
  await page.waitForFunction(() => window.__scene.near && window.__scene.near.id === 'wang');
  await page.keyboard.up('ArrowLeft');
  await page.keyboard.press('Space');
  await expect(page.locator('.session .stitle')).toContainText('Hook');
  await expect(page.locator('.ssteps li.on')).toHaveText('Refresh');
  await expect(page.locator('.card')).toContainText('Nothing is due today');

  // answer the first scene question wrong on purpose: its word waits in Refresh instead of being caught
  let missed = false;
  await play(page, { miss: (label) => { if (!missed && /what does she call you/i.test(label)) return (missed = true); return false; } });
  expect(missed).toBe(true);

  const s2 = await page.evaluate(() => ({ p: window.__store.state.progress, S: window.__store.state }));
  expect(s2.p.beat).toBe(1); expect(s2.p.beatStep).toBe('refresh');
  const id = (h) => page.evaluate((x) => window.__district.byH.get(x).id, h);
  expect(s2.S.pending[await id('孩子')]).toBe(true);
  expect(s2.S.words[await id('杯子')]).toBeTruthy();
  expect(s2.S.stats.conversations).toBe(2); expect(s2.S.stats.cleanConversations).toBe(1);
  await expect(page.locator('#hint')).toContainText('tai chi');

  // a sentence the word was met in is kept for context cards
  expect(s2.S.ctx[await id('杯子')].length).toBeGreaterThan(0);
  await page.screenshot({ path: 'test-results/session.png' });
  expect(errors).toEqual([]);
});
