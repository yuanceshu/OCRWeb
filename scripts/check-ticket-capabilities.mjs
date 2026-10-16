import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.TICKET_QA_URL || 'http://localhost:5173';
const output = '.codex-screens/ticket-capabilities';
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
try {
  await page.goto(base + '/ticket-capabilities');
  assert.equal(await page.locator('.ticket-card').count(), 22);
  await page.screenshot({ path: `${output}/desktop-list.png`, fullPage: true });
  await page.locator('input').fill('有效期');
  assert.equal(await page.locator('.ticket-card').count(), 1);
  await page.locator('.ticket-card h2 a').click();
  assert.match(await page.locator('.ticket-fields').innerText(), /competitionNumber/);
  await page.getByRole('link', { name: '← 返回票根列表' }).click();
  assert.equal(await page.locator('input').inputValue(), '有效期');
  await page.locator('input').fill(' 大麦 TN ');
  assert.equal(await page.locator('.ticket-card').count(), 2);
  await page.locator('input').fill('NONEXISTENT');
  await page.getByRole('heading', { name: '没有找到相关票根' }).waitFor();
  await page.locator('.ticket-empty button').click();
  await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
  await page.waitForTimeout(150);
  await page.locator('.ticket-card h2 a').nth(8).scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await page.locator('.ticket-card h2 a').nth(8).click();
  await page.goBack();
  await page.waitForTimeout(400);
  assert.ok(Math.abs((await page.evaluate(() => scrollY)) - before) < 5, '浏览器返回应恢复列表位置');
  await page.goto(base + '/ticket-capabilities/1');
  await page.reload();
  assert.equal(await page.locator('.ticket-sample-switch button').count(), 2);
  await page.getByRole('button', { name: '样张 2', exact: true }).click();
  await page.getByRole('button', { name: '放大查看原始样张', exact: true }).click();
  await page.locator('dialog[open]').waitFor();
  await page.getByRole('button', { name: '放大', exact: true }).click();
  assert.match(await page.locator('.ticket-viewer-toolbar').innerText(), /150%/);
  await page.keyboard.press('ArrowLeft');
  assert.match(await page.locator('.ticket-viewer-toolbar').innerText(), /样张 1\/2/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), '放大查看原始样张');
  await page.screenshot({ path: `${output}/desktop-detail.png`, fullPage: true });
  for (const t of JSON.parse(fs.readFileSync('src/data/ticketCapabilities.json'))) {
    await page.goto(base + '/ticket-capabilities/' + t.code);
    assert.equal(await page.locator('tbody tr').count(), t.fields.length);
    for (const s of t.samples) assert.equal((await page.request.get(base + s.src)).status(), 200);
  }
  await page.goto(base + '/ticket-capabilities/missing');
  await page.getByRole('heading', { name: '未找到该票根' }).waitFor();
  for (const route of ['/', '/activation-guide', '/interfaces/idcard', '/interface-custom-guide/']) {
    await page.goto(base + route);
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, route);
    await page.screenshot({ path: `${output}/regression-${route.replaceAll('/', '-') || 'home'}.png` });
  }
  await page.getByRole('link', { name: '查看票根识别能力 →' }).click();
  assert.match(page.url(), /ticket-capabilities/);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/ticket-capabilities', '/ticket-capabilities/1']) {
    await page.goto(base + route);
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: `${output}/mobile-${route.endsWith('/1') ? 'detail' : 'list'}.png`, fullPage: true });
  }
  await page.getByRole('button', { name: '放大查看原始样张', exact: true }).click();
  await page.getByRole('button', { name: '放大', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.goto(base + '/');
  await page.getByRole('button', { name: '打开菜单' }).click();
  await page.getByRole('menuitem', { name: '票根识别能力查询' }).click();
  assert.match(page.url(), /ticket-capabilities/);
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('PASS：22 个详情、搜索、刷新、滚动恢复、图库、键盘与焦点、指南入口、桌面回归及手机浏览');
} finally { await browser.close(); }
