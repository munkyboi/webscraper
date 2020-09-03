const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://www.reddit.com/r/Philippines/';

puppeteer
  .launch()
  .then(browser => browser.newPage())
  .then(page => {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(html => {
    const $ = cheerio.load(html);
    const newsHeadlines = [];
    $('.scrollerItem').each(function() {
      if ($(this).find('a[href*="/r/Philippines/comments"] h3').text() !== '') {
        newsHeadlines.push({
          title: $(this).find('a[href*="/r/Philippines/comments"] h3').text(),
          votes: $(this).find('div[id*="vote-arrows-"] > div').html(),
          url: $(this).find('a[href*="/r/Philippines/comments"]').attr('href'),
        });
      }
    });
    console.log(newsHeadlines);
  })
  .catch(console.error);