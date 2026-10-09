import { test, expect } from '@playwright/test';

const view = (page) => page.evaluate(() => ({ view: window.__scene.view, place: window.__scene.place && window.__scene.place.id }));
const marker = (page) => page.evaluate(() => ({ vis: window.__scene.marker.visible, x: window.__scene.marker.x }));

test('scene map: board → place → talk, read a sign, back to the board, marker follows the beat', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/?dev');
  // skip the arrival: start at the district board at beat 1
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('working-title:save', JSON.stringify({ v: 1, progress: { stage: 'district', beat: 0, openingStep: 'done' } })); });
  await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view);

  // the board: five places, today's (the spring) marked, labels in Chinese with hover
  expect(await view(page)).toEqual({ view: 'board', place: null });
  await expect(page.locator('.hot.k-place')).toHaveCount(5);
  await expect(page.locator('.place')).toContainText('趵突泉');
  await expect(page.locator('#hint')).toContainText('Grandma Wang');
  expect((await marker(page)).vis).toBe(true);
  await page.locator('.hot.k-place[data-id="taichi"]').hover();
  await expect(page.locator('.reach')).toContainText('tai chi');

  // someone without a beat today just chats: Xiao Xie at the fish pool. No marker there.
  await page.click('.hot.k-place[data-id="fish"]');
  expect(await view(page)).toEqual({ view: 'place', place: 'fish' });
  expect((await marker(page)).vis).toBe(false);
  await page.locator('.hot.k-npc[data-id="xie"]').hover();
  await expect(page.locator('.reach')).toContainText('Talk');
  await page.click('.hot.k-npc[data-id="xie"]');
  await expect(page.locator('.dialogue')).toBeVisible();
  await expect(page.locator('.dialogue .dline')).toContainText('小谢');
  await page.locator('.dialogue .dline .hz').first().hover();
  await expect(page.locator('.hztip')).toHaveText(/nǐ hǎo/);
  // Esc closes the dialogue but stays in the place
  await page.keyboard.press('Escape');
  await expect(page.locator('.dialogue')).toHaveCount(0);
  expect((await view(page)).place).toBe('fish');

  // back to the board with the button, then the spring: the marker sits over Grandma Wang
  await page.click('#hudBack');
  expect((await view(page)).view).toBe('board');
  await page.click('.hot.k-place[data-id="spring"]');
  const m = await marker(page);
  const wx = await page.evaluate(() => window.__scene.targets.find((t) => t.id === 'wang').x);
  expect(m.vis).toBe(true); expect(m.x).toBe(wx);

  // read the Gate 4 sign by the spring
  await page.click('.hot.k-sign[data-id="gate4"]');
  await expect(page.locator('.signcard .signtext')).toContainText('四号门');
  await page.keyboard.press('Escape');
  await expect(page.locator('.signcard')).toHaveCount(0);
  // Esc with nothing open goes back to the board
  await page.keyboard.press('Escape');
  expect((await view(page)).view).toBe('board');

  // dev panel: jump to beat 2 → the tai chi square is marked, hint changes
  await page.keyboard.press('`');
  await page.selectOption('#dvbeat', '1');
  await page.click('#dvjump');
  await page.keyboard.press('`');
  await expect(page.locator('#hint')).toContainText('tai chi');
  await page.click('.hot.k-place[data-id="taichi"]');
  const m2 = await marker(page);
  const zx = await page.evaluate(() => window.__scene.targets.find((t) => t.id === 'zhang').x);
  expect(m2.x).toBe(zx);

  // settings: slow speech sticks after reload
  await page.click('#hudSet');
  await page.selectOption('#stRate', 'slow');
  await page.keyboard.press('Escape');
  await page.reload();
  await page.waitForFunction(() => window.__scene && window.__scene.view);
  await page.click('#hudSet');
  await expect(page.locator('#stRate')).toHaveValue('slow');

  await page.screenshot({ path: 'test-results/world.png' });
  expect(errors).toEqual([]);
});
