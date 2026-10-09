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

  // play the arrival to the end: conversation in the taxi, then the notebook shows two lines in focus
  await autoplay(page, () => !!document.querySelector('.nbclose'));
  await expect(page.locator('.page .nline.clear')).toHaveCount(2);
  await autoplay(page, () => window.__store.state.progress.stage === 'district' && !document.querySelector('.storycard'));
  let s = await state(page);
  expect(s.progress.beat).toBe(0);
  await expect(page.locator('#arrival')).toBeHidden();
  await expect(page.locator('.hudplace')).toContainText('趵突泉');
  const openingWords = await page.evaluate(() => window.__content.opening.words.length);
  expect(Object.keys(s.words).length).toBe(openingWords);           // every opening word caught, nothing else
  expect(s.stats.conversations).toBe(1);

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
  expect(s.stats.conversations).toBe(2);
  expect(s.stats.cleanConversations).toBe(2);
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
