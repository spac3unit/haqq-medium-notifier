// https://zetcode.com/javascript/cheerio/
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://medium.com/islamic-coin', { waitUntil: 'domcontentloaded' });
  await autoScroll(page);
  const hrefs = await page.$$eval('a', (anchors) =>
    anchors
      .filter((a) => a.getAttribute('aria-label') == 'Post Preview Title')
      .map((link) => link.getAttribute('href'))
  );

  console.log(hrefs);
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
