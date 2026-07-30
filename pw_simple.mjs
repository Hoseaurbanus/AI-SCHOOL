import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: true
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const consoleMessages = [];
const pageErrors = [];
page.on('console', m => consoleMessages.push(`${m.type()}: ${m.text()}`));
page.on('pageerror', e => pageErrors.push(e.message));

// Wait for network idle 
await page.goto('http://localhost:8443', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);

const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const rootInner = await page.evaluate(() => document.getElementById('root')?.innerHTML?.slice(0, 200));
const docTitle = await page.title();
const bodyContent = await page.evaluate(() => document.body.innerText?.slice(0, 300));

console.log('Title:', docTitle);
console.log('Body background:', bodyBg);
console.log('Root innerHTML (200 chars):', rootInner);
console.log('Body text:', bodyContent);
console.log('Page errors:', pageErrors.length ? pageErrors.join('\n') : 'NONE');
console.log('Console messages:', consoleMessages.slice(0, 10).join('\n'));

await page.screenshot({ path: '/tmp/smugflex_shots/diag_landing.png', fullPage: false });
await browser.close();
