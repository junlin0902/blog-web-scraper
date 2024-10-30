import scrapeBlog, { IBlog } from './web_scraper';

const coinbaseConfig: IBlog = {
  blogUrl: 'https://www.coinbase.com/en-sg/',
  indexPage: 'blog',
  articleLinkSelector: 'a[href^="/en-sg/blog/"]',
  _id: 'coinbase-blog',

  headerSelector: '#article_introduction',
  headerAppearTime: 0,
  headerAppearPos: 1,

  contentSelector: '#article_introduction',
  contentAppearTime: 1,
  contentAppearPos: 0,

  nextButton: "#__next > div > div > div > div > div.cds-flex-f1g67tkn.sc-20f7f24c-0.jxwgNN > div > div > div > div > button"
};

const binanceConfig: IBlog = {
  blogUrl: 'https://www.binance.com/en/',
  indexPage: 'blog',
  articleLinkSelector: 'a[href^="/en/blog/"]',
  _id: 'binance-blog',

  headerSelector: 'article',
  headerAppearTime: 0,
  headerAppearPos: 1,

  contentSelector: 'article',
  contentAppearTime: 0,
  contentAppearPos: 3,

};

(async () => {
  try {
    await scrapeBlog(coinbaseConfig, null, 5);
    await scrapeBlog(binanceConfig, null, 5);
  } catch (error) {
    console.error('Error during test:', error);
  }
})();