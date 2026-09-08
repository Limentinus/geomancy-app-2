/**
 * End-to-end walkthrough: ask a question, cast sixteen lines, read the chart.
 * Captures screenshots at each stage and reports any console error.
 */
import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = 'http://localhost:8899';
const shots = [];

const browser = await chromium.launch();

for (const [label, viewport] of [
  ['desktop', { width: 1280, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  const problems = [];
  page.on('console', (m) => { if (m.type() === 'error') problems.push(m.text()); });
  page.on('pageerror', (e) => problems.push(`PAGE ERROR: ${e.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test/shot-${label}-1-ask.png`, fullPage: true });

  // Ask.
  await page.fill('#question', 'Soll ich die Stelle in Leipzig annehmen?');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.tap-pad');

  // Cast sixteen lines with a varying number of taps each.
  for (let line = 0; line < 16; line++) {
    const taps = (line * 3 + 1) % 5;
    for (let i = 0; i < taps; i++) await page.click('.tap-pad');
    if (line === 5) {
      await page.screenshot({ path: `test/shot-${label}-2-cast.png`, fullPage: true });
    }
    await page.click('.cast .btn--primary');
  }
  await page.waitForSelector('.btn--ready');
  await page.click('.btn--ready');

  await page.waitForSelector('.shield');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `test/shot-${label}-3-reading.png`, fullPage: true });

  // Click a house and check the detail panel follows.
  await page.click('#house-mother1');
  await page.waitForTimeout(250);
  const detailTitle = await page.textContent('.detail__latin');
  const houseTitle = await page.textContent('#house-mother1 .house__name');

  // Switch language and confirm the chart survives.
  const verdictBefore = await page.textContent('.answer__verdict');
  const judgeBefore = await page.textContent('.answer__figures .mini:nth-child(2) .mini__latin');
  await page.click('.lang');
  await page.waitForTimeout(300);
  await page.waitForTimeout(1100);
  const verdictAfter = await page.textContent('.answer__verdict');
  const judgeAfter = await page.textContent('.answer__figures .mini:nth-child(2) .mini__latin');
  await page.screenshot({ path: `test/shot-${label}-4-english.png`, fullPage: true });

  shots.push({
    label,
    problems,
    detailMatchesHouse: detailTitle.trim() === houseTitle.trim(),
    judgeStableAcrossLanguages: judgeBefore === judgeAfter,
    verdictTranslated: verdictBefore !== verdictAfter,
    verdictBefore, verdictAfter, judge: judgeAfter,
  });

  await page.close();
}

await browser.close();
console.log(JSON.stringify(shots, null, 2));
