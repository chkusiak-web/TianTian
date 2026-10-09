import { test, expect } from '@playwright/test';

// Walk by holding keys until a condition holds (or time runs out)
async function walk(page, key, until, ms = 4000) {
  await page.keyboard.down(key);
  const t0 = Date.now();
  while (Date.now() - t0 < ms && !(await page.evaluate(until))) await page.waitForTimeout(30);
  await page.keyboard.up(key);
}
const pos = (page) => page.evaluate(() => ({ x: window.__scene.player.x, y: window.__scene.player.y, near: window.__scene.near && window.__scene.near.id }));

test('checkpoint 2: walk the park, talk to Grandma Wang, read a sign, marker follows the beat', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/?dev');
  await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.player);

  // HUD: place and next step
  await expect(page.locator('.place')).toContainText('趵突泉');
  await expect(page.locator('#hint')).toContainText('Grandma Wang');

  // marker over Grandma Wang
  const m = await page.evaluate(() => ({ mx: window.__scene.marker.x, wx: window.__scene.npcs.find((n) => n.id === 'wang').x, vis: window.__scene.marker.visible }));
  expect(m.vis).toBe(true); expect(m.mx).toBe(m.wx);

  // water blocks you: walking straight up from the south gate stops at the pool rim
  await walk(page, 'ArrowUp', () => false, 2500);
  const p1 = await pos(page);
  expect(p1.y).toBeGreaterThan(10 * 16);

  // walk left until Grandma Wang is in reach, then talk
  await walk(page, 'ArrowLeft', () => window.__scene.near && window.__scene.near.id === 'wang');
  expect((await pos(page)).near).toBe('wang');
  await expect(page.locator('.reach')).toContainText('Talk');
  await page.keyboard.press('Space');
  await expect(page.locator('.dialogue')).toBeVisible();
  await expect(page.locator('.dialogue .dline')).toContainText('孩子');
  // hover works in dialogue lines; walking is frozen while it's open
  await page.locator('.dialogue .dline .hz').first().hover();
  await expect(page.locator('.hztip')).toHaveText(/hái zi/);
  const before = await pos(page);
  await walk(page, 'ArrowRight', () => false, 400);
  expect((await pos(page)).x).toBe(before.x);
  await page.keyboard.press('Space');
  await expect(page.locator('.dialogue .dline')).toContainText('王奶奶');
  await page.keyboard.press('Space');
  await expect(page.locator('.dialogue')).toHaveCount(0);

  // read the Gate 4 sign: start beside the signpost (the walking itself is covered above)
  await page.evaluate(() => window.__scene.player.setPosition(17.6 * 16, 3.9 * 16));
  await walk(page, 'ArrowLeft', () => window.__scene.near && window.__scene.near.kind === 'sign', 3000);
  expect((await pos(page)).near).toBe('gate4');
  await expect(page.locator('.reach')).toContainText('Read');
  await page.keyboard.press('Space');
  await expect(page.locator('.signcard .signtext')).toContainText('四号门');
  await page.keyboard.press('Escape');
  await expect(page.locator('.signcard')).toHaveCount(0);

  // dev panel: jump to beat 2 → marker moves to Teacher Zhang, hint changes
  await page.keyboard.press('`');
  await page.selectOption('#dvbeat', '1');
  await page.click('#dvjump');
  await expect(page.locator('#hint')).toContainText('tai chi');
  const m2 = await page.evaluate(() => ({ mx: window.__scene.marker.x, zx: window.__scene.npcs.find((n) => n.id === 'zhang').x }));
  expect(m2.mx).toBe(m2.zx);
  await page.keyboard.press('`');

  // settings: slow speech sticks after reload
  await page.click('#hudSet');
  await page.selectOption('#stRate', 'slow');
  await page.keyboard.press('Escape');
  await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.player);
  await page.click('#hudSet');
  await expect(page.locator('#stRate')).toHaveValue('slow');

  await page.screenshot({ path: 'test-results/world.png' });
  expect(errors).toEqual([]);
});
