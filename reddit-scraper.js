const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const colors = require('colors');

const url = 'https://www.reddit.com/r/Philippines';

console.log(`Scraping: ${url}`.yellow);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'})
    .catch(err => {
      console.log(`ERROR: ${err}`.bgRed);
      return console.error;
    });
  const html = await page.content();

  const posts = [];
  const $ = cheerio.load(html);
  $('.scrollerItem').each(function() {
    const title = $(this).find('a[href*="/r/Philippines/comments"] h3').text();
    const votes = !isNaN(parseInt($(this).find('div[id*="vote-arrows-"] > button + div').html())) ? parseInt($(this).find('div[id*="vote-arrows-"] > button + div').html()) : 0;
    const url = $(this).find('a[href*="/r/Philippines/comments"]').attr('href');
    if (title !== '') {
      posts.push({
        title: title,
        votes: votes,
        url: url,
      });
    }
  });

  console.log(posts);
 
  await browser.close();
})();