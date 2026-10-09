import { test, expect } from '@playwright/test';

test('checkpoint 1 shell: canvas, hover, click, question lock, autosave, dev panel only with ?dev', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await expect(page.locator('#phaser canvas')).toBeVisible();
  expect(await page.evaluate(() => { const c = document.querySelector('#phaser canvas'); return [c.width, c.height]; })).toEqual([480, 270]);

  // hover + click
  const w = page.locator('.sample .hz', { hasText: '杯子' }).first();
  await w.hover();
  await expect(page.locator('.hztip')).toHaveText(/bēi zi/);
  await w.click();
  await expect(page.locator('.hztip')).toHaveText(/cup/);

  // sweeping along a line never drops the tip between the first and last word (punctuation included)
  const line = page.locator('.sample').first();
  const first = await line.locator('.hz').first().boundingBox(), last = await line.locator('.hz').last().boundingBox();
  for (let x = first.x + 2; x < last.x + last.width - 2; x += 5) {
    await page.mouse.move(x, first.y + first.height / 2);
    await expect(page.locator('.hztip')).toBeVisible();
  }

  // locked inside the question until answered, and says so
  await page.locator('#q .hz').first().hover();
  await expect(page.locator('.hztip')).toHaveText(/unlocks after you answer/);
  await page.locator('[data-opt="杯子"]').click();
  await expect(page.locator('.verdict.ok')).toBeVisible();
  await page.locator('#q .hz').nth(1).hover();
  await expect(page.locator('.hztip')).toHaveText(/shì/);

  // settings save by themselves and survive a reload; no dev panel in normal play
  await page.locator('#slow').check();
  await page.reload();
  await expect(page.locator('#slow')).toBeChecked();
  await page.keyboard.press('`');
  await expect(page.locator('.devpanel')).toHaveCount(0);

  // with ?dev: mark words and move the clock
  await page.goto('/?dev');
  await page.keyboard.press('`');
  await page.fill('#dvword', '你好 杯子');
  await page.click('[data-m="caught"]');
  expect(await page.evaluate(() => Object.keys(window.__store.state.words).length)).toBe(2);
  await page.click('[data-d="1"]'); await page.click('[data-d="1"]');
  await expect(page.locator('.devpanel h4', { hasText: '2 words due' })).toBeVisible();

  expect(errors).toEqual([]);
});
