import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url(), request.failure().errorText));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('HTTP ERROR:', response.status(), response.url());
    }
  });
  
  await page.goto('http://localhost:5175', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
