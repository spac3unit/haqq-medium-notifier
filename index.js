const puppeteer = require('puppeteer');
const { Telegraf } = require('telegraf');

const bot = new Telegraf('5607581899:AAHYNzoSU4LWIm_BDqxQBTl_rayj_rLPlHs');
let chatids = [];

bot.start((ctx) => {
  ctx.reply("Welcome! I'll send you new posts when readdy");
  chatids.push(ctx.from.id);
  console.log('chat_id: ', ctx.from.id);
});

bot.launch();

const minutes = 1;
const the_interval = minutes * 60 * 1000;
// '/islamic-coin/cryptocurrency-a-global-phenomenon-in-business-b2f662b0b9b?source=collection_home---------0----------------------------',
let items = [
  '/islamic-coin/shariah-compliant-islamic-coin-welcomes-his-highness-sheikh-juma-bin-maktoum-al-maktoum-of-dubai-d446d96e0bf4?source=collection_home---------1----------------------------',
  '/islamic-coin/eduseries-2-the-future-is-now-evolution-of-islamic-coin-as-a-crypto-bc437a671333?source=collection_home---------2----------------------------',
  '/islamic-coin/nfts-halal-or-not-a3d71a3fe1b3?source=collection_home---------3----------------------------',
  '/islamic-coin/winners-of-the-community-contribution-challenge-24f4e749534e?source=collection_home---------4----------------------------',
  '/islamic-coin/islamic-coin-announces-support-of-uns-sustainable-development-goals-partners-withworld-green-e0205edeb55f?source=collection_home---------5----------------------------',
  '/islamic-coin/ambassador-program-5cbe92e987b3?source=collection_home---------6----------------------------',
  '/islamic-coin/shariah-compliant-islamic-coin-welcomes-he-sheikh-khalifa-bin-mohammed-bin-khalid-al-nahyan-of-uae-df2df07eee51?source=collection_home---------7----------------------------',
  '/islamic-coin/important-announcement-for-validators-contest-participants-90b18d0e0744?source=collection_home---------8----------------------------',
  '/islamic-coin/islamic-coin-x-dexpad-ama-1afde1810a72?source=collection_home---------9----------------------------',
  '/islamic-coin/haqq-validators-contest-dad49e1038c8?source=collection_home---------10----------------------------',
  '/islamic-coin/islamic-coin-has-integrated-with-gnosis-safe-3cb7d876c457?source=collection_home---------11----------------------------',
  '/islamic-coin/the-islamic-coin-community-contribution-challenge-5d7d02bb792c?source=collection_home---------12----------------------------',
  '/islamic-coin/haqq-testedge-testnet-is-live-get-some-islm-and-try-it-today-e82724f8137d?source=collection_home---------13----------------------------',
  '/islamic-coin/the-haqq-network-integrates-the-gnosis-safe-multisig-wallet-why-it-matters-and-how-you-can-use-it-19582bcbb2fe?source=collection_home---------14----------------------------',
];

(async () => {
  setInterval(async function () {
    const browser = await puppeteer.launch({ headless: false });
    console.log('items length: ', items.length);

    try {
      console.log('I am doing my 0.5 minutes check');
      const page = await browser.newPage();
      await page.goto('https://medium.com/islamic-coin', { waitUntil: 'domcontentloaded' });
      await autoScroll(page);
      const hrefs = await page.$$eval('a', (anchors) =>
        anchors
          .filter((a) => a.getAttribute('aria-label') == 'Post Preview Title')
          .map((link) => link.getAttribute('href'))
      );

      console.log('hrefs length: ', hrefs.length);

      if (hrefs.length > items.length) {
        let difference = hrefs.filter((x) => !items.includes(x));
        difference.map((newPost) => {
          let newPostUrl = `https://medium.com${newPost}`;
          chatids.map((chatid) => {
            bot.telegram.sendMessage(chatid, newPostUrl);
          });
        });
        console.log('difference length: ', difference.length);
        console.log('difference: ', difference);
      }

      items = hrefs;
    } catch (e) {
      console.log(e);
    } finally {
      await browser.close();
    }
  }, the_interval);
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
