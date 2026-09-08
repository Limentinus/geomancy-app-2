/** Verify the single-file bundle behaves exactly like the module build. */
import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const problems = [];
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('TUNNEL')) problems.push(m.text()); });
page.on('pageerror', (e) => problems.push(`PAGE ERROR: ${e.message}`));

await page.goto('http://localhost:8899/demo.html', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#question');
await page.fill('#question', 'Wird die Portfolio-Seite gut ankommen?');
await page.click('button[type="submit"]');
for (let i = 0; i < 16; i++) {
  for (let k = 0; k < (i * 7) % 4; k++) await page.click('.tap-pad');
  await page.click('.cast .btn--primary');
}
await page.click('.btn--ready');
await page.waitForSelector('.shield');
await page.waitForTimeout(1300);
await page.screenshot({ path: 'docs/screenshot-reading.png', fullPage: true });

const houses = await page.$$eval('.house .house__name', (n) => n.map((x) => x.textContent));
console.log(JSON.stringify({
  problems,
  houseCount: houses.length,
  judge: await page.textContent('.house--judge .house__name'),
  verdict: await page.textContent('.answer__verdict'),
}, null, 2));

await browser.close();
