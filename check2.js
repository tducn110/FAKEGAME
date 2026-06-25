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
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  
  try {
    const playButton = await page.$('.prescreen-play-btn');
    if (playButton) {
      console.log('Clicking play button...');
      await playButton.click();
      await new Promise(r => setTimeout(r, 4000)); // wait for transition
    } else {
      console.log('Play button not found!');
    }
  } catch(e) {
    console.error(e);
  }
  
  await browser.close();
})();
