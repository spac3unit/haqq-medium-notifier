const puppeteer = require('puppeteer');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.launch();

const minutes = 1;
const the_interval = minutes * 60 * 1000;

let items = [];
let chatids = [];

(async () => {
  setInterval(async function () {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

    try {
      const page = await browser.newPage();
      await page.goto('https://medium.com/islamic-coin', { waitUntil: 'domcontentloaded' });
      await autoScroll(page);

      const hrefs = await page.$$eval('a', (anchors) =>
        anchors
          .filter((a) => a.getAttribute('aria-label') == 'Post Preview Title')
          .map((link) => link.getAttribute('href'))
      );

      if (hrefs.length > items.length) {
        let difference = hrefs.filter((x) => !items.includes(x));
        difference.map((newPost) => {
          let newPostUrl = `https://medium.com${newPost}`;
          chatids.map((chatid) => {
            bot.telegram.sendMessage(chatid, newPostUrl, {
              disable_web_page_preview: true,
            });
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

bot.start((ctx) => {
  chatids.push(ctx.from.id);
  ctx.reply('Welcome! 👋');

  ctx.reply("⏰ I'll let you know if there are any new posts in Haqq Blog");

  if (items.length > 0) {
    ctx.reply('Here is a list of current posts 🧾: ');

    items.map((item) => {
      let postUrl = `https://medium.com${item}`;
      chatids.map((chatid) => {
        bot.telegram.sendMessage(chatid, postUrl, {
          disable_web_page_preview: true,
        });
      });
    });
  }

  console.log('chat_id: ', ctx.from.id);
});

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
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
