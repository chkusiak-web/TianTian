import { test, expect } from '@playwright/test';
import { autoplay } from './autoplay.js';

const state = (page) => page.evaluate(() => JSON.parse(JSON.stringify(window.__store.state)));

test('checkpoint 3: fresh save → arrival → Hook beat (Refresh → Learn → Use → Notebook), with pause and resume', async ({ page }) => {
  test.setTimeout(240000);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view && window.__store);
  await page.evaluate(() => { window.__store.state.dev.autoAnswer = true; window.__store.save(); });

  // the arrival starts by itself
  await expect(page.locator('.storycard')).toContainText('Old Zhou');
  await expect(page.locator('#arrival')).toBeVisible();              // the arrival has its own map, not the Baotu board
  await expect(page.locator('.hudplace')).toContainText('济南西站');
  await page.click('.storycard button');
  await expect(page.locator('.sheet .steps li.now')).toHaveText(/Learn/);
  await expect(page.locator('.introhz')).toBeVisible();

  // pause in the middle of Learn, reload: the session resumes at Learn
  await page.click('.inext'); await page.click('.inext');
  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).toHaveCount(0);
  await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view && window.__store);
  expect((await state(page)).progress.openingStep).toBe('learn');
  await expect(page.locator('.sheet .steps li.now')).toHaveText(/Learn/);

  // the arrival is two sessions: the taxi (then 「我是老周。」 is readable), then the gate (「七十三。」 too)
  await autoplay(page, () => !!document.querySelector('.nbclose'));
  await expect(page.locator('.page .nline.clear')).toHaveCount(1);
  await expect(page.locator('#arrival .taxi')).toBeVisible();
  await autoplay(page, () => !!document.querySelector('.storycard'));
  await expect(page.locator('.storycard')).toContainText('old town');
  expect((await state(page)).progress.part).toBe(1);
  await autoplay(page, () => !!document.querySelector('.nbclose'));
  await expect(page.locator('.page .nline.clear')).toHaveCount(2);
  await autoplay(page, () => window.__store.state.progress.stage === 'district' && !document.querySelector('.storycard'));
  let s = await state(page);
  expect(s.progress.beat).toBe(0);
  await expect(page.locator('#arrival')).toBeHidden();
  await expect(page.locator('.hudplace')).toContainText('趵突泉');
  const openingWords = await page.evaluate(() => window.__content.opening.words.length);
  expect(Object.keys(s.words).length).toBe(openingWords);           // every opening word caught, nothing else
  expect(s.stats.conversations).toBe(2);
  expect(s.progress.part).toBe(0);

  // open the spring on the board and click Grandma Wang to play the Hook
  await page.click('.spot.k-place[data-id="spring"]');
  await page.click('.hot.k-npc[data-id="wang"]');
  await expect(page.locator('.sheet .sheettitle')).toContainText('Hook');
  await autoplay(page, () => !!document.querySelector('.convo .dask .choices'));
  await expect(page.locator('.convo .dname')).toContainText('王奶奶');
  await autoplay(page, () => !!document.querySelector('.nbclose'));
  await expect(page.locator('.page .nline.fresh')).toContainText('孩子');
  await autoplay(page, () => window.__store.state.progress.beat === 1);

  s = await state(page);
  const hookWords = await page.evaluate(() => window.__content.beats[0].words.length);
  expect(Object.keys(s.words).length).toBe(openingWords + hookWords);
  expect(s.stats.conversations).toBe(4);
  expect(s.stats.cleanConversations).toBe(4);
  await expect(page.locator('#hint')).toContainText('tai chi');

  // the notebook opens from the bottom bar with three lines readable
  await page.click('#hudBook');
  await expect(page.locator('.notebook-modal .nline.clear')).toHaveCount(3);
  await page.keyboard.press('Escape');

  // a day later, Refresh has due words before the next beat
  await page.keyboard.press('`');
  await page.click('[data-d="1"]'); await page.click('[data-d="1"]');
  await page.keyboard.press('`');
  expect(await page.evaluate(() => Object.values(window.__store.state.words).filter((w) => w.due <= Date.now() + window.__store.state.dev.dayOffset * 86400000).length)).toBeGreaterThan(0);

  expect(errors).toEqual([]);
});

test('Investigate 1: the tai chi beat plays as two sessions and points to the ticket window', async ({ page }) => {
  test.setTimeout(240000);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view && window.__store);
  await page.evaluate(() => { window.__store.state.dev.autoAnswer = true; window.__store.save(); });
  await page.click('.storycard button');            // the arrival starts by itself; pause it and jump ahead
  await expect(page.locator('.introhz')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).toHaveCount(0);
  await page.keyboard.press('`');
  await page.selectOption('#dvbeat', '1'); await page.click('#dvjump');
  await page.keyboard.press('`');
  await expect(page.locator('#hint')).toContainText('tai chi');

  await page.click('.spot.k-place[data-id="taichi"]');
  await expect(page.locator('.spot.k-npc[data-id="lin"]')).toContainText('林姐');
  await page.click('.hot.k-npc[data-id="zhang"]');
  await expect(page.locator('.sheet .sheettitle')).toContainText('who are you');
  await autoplay(page, () => !!document.querySelector('.convo .dname') && document.querySelector('.convo .dname').textContent.includes('林姐'));
  await autoplay(page, () => !!document.querySelector('.storycard'));
  expect(await page.evaluate(() => window.__store.state.progress.part)).toBe(1);
  await autoplay(page, () => window.__store.state.progress.beat === 2);
  const s = await page.evaluate(() => window.__store.state);
  const words = await page.evaluate(() => window.__content.beats[1].words);
  expect(words.length).toBe(14);
  expect(s.stats.cleanConversations).toBe(2);
  expect(s.progress.part).toBe(0);
  await expect(page.locator('#hint')).toContainText('ticket window');
  expect(errors).toEqual([]);
});

test('Investigate 2: the ticket window and the ledger, then on to the fish pool', async ({ page }) => {
  test.setTimeout(240000);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view && window.__store);
  await page.evaluate(() => { window.__store.state.dev.autoAnswer = true; window.__store.save(); });
  await page.click('.storycard button');
  await expect(page.locator('.introhz')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).toHaveCount(0);
  await page.keyboard.press('`');
  await page.selectOption('#dvbeat', '2'); await page.click('#dvjump');
  await page.keyboard.press('`');
  await expect(page.locator('#hint')).toContainText('ticket window');

  await page.click('.spot.k-place[data-id="gate"]');
  await page.click('.hot.k-npc[data-id="chen"]');
  await expect(page.locator('.sheet .sheettitle')).toContainText('a ticket');
  await autoplay(page, () => !!document.querySelector('.storycard'));
  await expect(page.locator('.storycard')).toContainText('ledger');
  await autoplay(page, () => window.__store.state.progress.beat === 3);
  await expect(page.locator('#hint')).toContainText('fish pool');
  expect(await page.evaluate(() => window.__store.state.stats.cleanConversations)).toBe(2);
  expect(errors).toEqual([]);
});

test('Investigate 3: mishear 四 as 十, walk to Gate 10, then follow the signs to Gate 4', async ({ page }) => {
  test.setTimeout(240000);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view && window.__store);
  await page.evaluate(() => { window.__store.state.dev.autoAnswer = true; window.__store.save(); });
  await page.click('.storycard button');
  await expect(page.locator('.introhz')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).toHaveCount(0);
  await page.keyboard.press('`');
  await page.selectOption('#dvbeat', '3'); await page.click('#dvjump');
  await page.keyboard.press('`');
  await expect(page.locator('#hint')).toContainText('fish pool');

  await page.click('.spot.k-place[data-id="fish"]');
  await page.click('.hot.k-npc[data-id="xie"]');
  await autoplay(page, () => (document.querySelector('.convo .tagq') || {}).textContent === 'Tones');
  await page.click('.convo .choice:not([data-dev-ok])');               // hear 十 instead of 四
  await page.click('.cgo');
  await expect(page.locator('.convo')).toContainText('Gate 10');
  await page.keyboard.press('Space');
  await expect(page.locator('.convo .dline')).toContainText('这儿没有十号门');
  expect(await page.evaluate(() => window.__store.state.progress.clueMistake)).toBe(true);

  await autoplay(page, () => !!document.querySelector('.storycard'));
  await expect(page.locator('.storycard')).toContainText('Signs');
  await autoplay(page, () => window.__store.state.progress.beat === 4);
  await expect(page.locator('#hint')).toContainText('Lele');
  expect(errors).toEqual([]);
});

test('Challenge: Lele\'s riddle duel — 4 hearts after the clue mistake, lose, retry, win', async ({ page }) => {
  test.setTimeout(300000);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view && window.__store);
  await page.evaluate(() => { window.__store.state.dev.autoAnswer = true; window.__store.save(); });
  await page.click('.storycard button');
  await expect(page.locator('.introhz')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).toHaveCount(0);
  await page.keyboard.press('`');
  await page.selectOption('#dvbeat', '4'); await page.click('#dvjump');
  await page.keyboard.press('`');
  await page.evaluate(() => { window.__store.state.progress.clueMistake = true; window.__store.save(); });
  await expect(page.locator('#hint')).toContainText('Lele');

  await page.click('.spot.k-place[data-id="gate4"]');
  await page.click('.hot.k-npc[data-id="lele"]');
  await autoplay(page, () => !!document.querySelector('.storycard'));
  await expect(page.locator('.storycard')).toContainText('面子');
  await autoplay(page, () => !!document.querySelector('.convo .hearts'));
  await expect(page.locator('.convo .hearts .h.on')).toHaveCount(4);

  // miss four choice prompts in a row: out of face
  for (let k = 0; k < 4; k++) {
    await page.locator('.convo .choice:not([data-dev-ok])').first().click();
    await page.click('.cgo');
  }
  await expect(page.locator('.convo')).toContainText('对不起，我先走了。');
  await page.click('.dnext');
  await expect(page.locator('.convo .hearts .h.on')).toHaveCount(4);
  await autoplay(page, () => window.__store.state.progress.beat === 5);
  expect(await page.evaluate(() => window.__store.state.progress.challengeWon)).toBe(true);
  await expect(page.locator('#hint')).toContainText('thermos back');
  expect(errors).toEqual([]);
});

test('Payoff: return the thermos, read notebook page 1, and Baotu is done', async ({ page }) => {
  test.setTimeout(300000);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view && window.__store);
  await page.evaluate(() => { window.__store.state.dev.autoAnswer = true; window.__store.save(); });
  await page.click('.storycard button');
  await expect(page.locator('.introhz')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.sheet')).toHaveCount(0);
  await page.keyboard.press('`');
  await page.selectOption('#dvbeat', '5'); await page.click('#dvjump');
  await page.keyboard.press('`');
  await expect(page.locator('#hint')).toContainText('thermos back');

  await page.click('.spot.k-place[data-id="spring"]');
  await page.click('.hot.k-npc[data-id="wang"]');
  await autoplay(page, () => !!document.querySelector('.storycard'));
  expect(await page.evaluate(() => window.__store.state.progress.part)).toBe(1);
  await expect(page.locator('.storycard')).toContainText('notebook');
  await autoplay(page, () => window.__store.state.progress.beat === 6);
  await expect(page.locator('#hint')).toContainText('beats are done');
  expect(errors).toEqual([]);
});
