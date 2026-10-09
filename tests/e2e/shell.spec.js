import { test, expect } from '@playwright/test';

test('checkpoint 1 shell: canvas, hover, click, question lock, save, dev panel', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await expect(page.locator('#phaser canvas')).toBeVisible();
  const size = await page.evaluate(() => { const c = document.querySelector('#phaser canvas'); return [c.width, c.height]; });
  expect(size).toEqual([480, 270]);

  // hover + click on a sample word (question still locked, but samples are outside the question)
  const w = page.locator('.sample .hz', { hasText: '杯子' }).first();
  await w.hover();
  await expect(page.locator('.hztip')).toBeVisible();
  await expect(page.locator('.hztip')).toHaveText(/bēi zi/);
  await w.click();
  await expect(page.locator('.hztip')).toHaveText(/cup/);

  // locked inside the question until answered
  const qword = page.locator('#q .hz').first();
  await qword.hover();
  await expect(page.locator('.hztip')).toBeHidden();
  await page.locator('[data-opt="杯子"]').click();
  await expect(page.locator('.verdict.ok')).toBeVisible();
  await page.locator('#q .hz').first().hover();
  await expect(page.locator('.hztip')).toBeVisible();

  // save survives a reload
  await page.locator('#bump').click(); await page.locator('#bump').click();
  await page.reload();
  await expect(page.locator('#opens')).toHaveText('2');

  // dev panel marks a word caught and fast-forwards a day
  await page.keyboard.press('`');
  await page.fill('#dvword', '你好 杯子');
  await page.click('[data-m="caught"]');
  expect(await page.evaluate(() => Object.keys(window.__store.state.words).length)).toBe(2);
  await page.click('[data-d="1"]'); await page.click('[data-d="1"]');
  expect(await page.evaluate(() => window.__store.state.dev.dayOffset)).toBe(2);
  await expect(page.locator('.devpanel h4', { hasText: '2 words due' })).toBeVisible();

  await page.screenshot({ path: 'test-results/shell.png' });
  expect(errors).toEqual([]);
});
