import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';
import fetch from 'node-fetch';

export interface IBlog {
  blogUrl: string;
  indexPage: string;
  articleLinkSelector: string;
  _id: string;
  headerSelector: string;
  headerAppearTime: number;
  headerAppearPos: number;
  contentSelector: string;
  contentAppearTime: number;
  contentAppearPos: number;
  nextButton?: string;
}

// --------------------------helper-----------------------------
async function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function randomUserEvent(page: Page) {
  const randomOffset = Math.floor(Math.random() * 500) + 200;
  await page.evaluate((offset) => window.scrollBy(0, offset), randomOffset);
  await randomDelay(2000, 4000);
  await page.mouse.move(150, 250, { steps: 10 });
  await page.keyboard.type(Math.random().toString(), { delay: 100 });
}

async function wordCount(content: string) {
  return content.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// -------------------------------------------------------------
async function sendDataToBackend(header: string, content: string, link: string): Promise<void> {
  const mutation = `
    mutation CreateBlogContent($input: CreateBlogContentInput!) {
      createBlogContent(input: $input) {
        id
        head
        content
        link
      }
    }
  `;

  const variables = {
    input: {
      head: header,
      content: content,
      link: link,
    },
  };

  try {
    const response = await fetch('http://localhost:8911/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GraphQL request failed:', errorText);
      return;
    }

    const result = await response.json();
  } catch (error) {
    console.error('Failed to send data to backend:', error);
  }
}


async function scrollElement(page: Page): Promise<void> {
  let previousHeight: number = 0;
  let currentHeight: number = await page.evaluate(() => document.body.scrollHeight) as number;

  while (previousHeight !== currentHeight) {
    previousHeight = currentHeight;
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await randomDelay(1500, 2000);
    currentHeight = await page.evaluate(() => document.body.scrollHeight) as number;
  }
}


async function scrapeLink(
  page: Page,
  target_url: string,
  config: IBlog,
  allBlogLinks: Set<string>,
  linkSet: Set<string>,
  state: { count: number }
) {
  console.log(`Navigating to: ${target_url}`);
  await page.goto(target_url, { waitUntil: 'networkidle2' });
  await randomUserEvent(page);
  const lastPageNumber = 5;
  for (let i = 0; i < lastPageNumber; i++) {
    // perform inifnite scroll
    await scrollElement(page);

    const blogLinks = await page.evaluate((selector) => {
      return Array.from(document.querySelectorAll(selector)).map(
        (a) => (a as HTMLAnchorElement).href
      );
    }, config.articleLinkSelector);
  
    blogLinks.forEach((link) => {
      if (!linkSet.has(link)) {
        allBlogLinks.add(link);
        linkSet.add(link);
      }
    });

    if (config.nextButton == null) {
      break;
    } else if (config.nextButton != null) {
      try {
        await page.click(config.nextButton);
        await randomUserEvent(page);
        console.log("Successfully click the button!");
      } catch (error) {
        console.log("Failed to find the button!");
        break;
      }
    }
  }

  const { header, content } = await page.evaluate((config) => {
    const headerElement = Array.from(document.querySelectorAll(config.headerSelector))[config.headerAppearTime];
    const contentElement = Array.from(document.querySelectorAll(config.contentSelector))[config.contentAppearTime];

    let header = '';
    let content = '';

    if (headerElement instanceof HTMLElement) {
      const rawTextArray = Array.from(headerElement.querySelectorAll('*'))
        .map(el => el.textContent?.replace(/\n/g, '').trim() || '')
        .filter(text => text.length > 0);
      header = Array.from(new Set(rawTextArray))[config.headerAppearPos];
    } else {
      header = 'No title found';
    }
  
    if (contentElement instanceof HTMLElement) {
      const rawTextArray = Array.from(contentElement.querySelectorAll('*'))
        .map(el => el.textContent?.replace(/\n/g, '').trim() || '')
        .filter(text => text.length > 0);
      content = Array.from(new Set(rawTextArray))[config.contentAppearPos];
    } else {
      content = 'No content found';
    }
  
    return { header, content };
  }, config);

  if (header != 'No title found' && content != 'No content found' && await wordCount(content) >= 200) {
    state.count++;
    sendDataToBackend(header, content, target_url);
    
    console.log(`\x1b[34mExtracted Header:\x1b[0m ${header}`);
    console.log(`\x1b[34mExtracted Content:\x1b[0m ${content.slice(0, 50)}` + '...');
    console.log();
  }

  await randomUserEvent(page);
}


export default async function scrapeBlog(
  config: IBlog,
  existingPage: Page | null = null,
  limit: number | null = null
) {
  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = existingPage || (await browser.newPage());
  const allBlogLinks = new Set<string>();
  const linkSet = new Set<string>();
  let state = { count: 0 };

  try {
    await scrapeLink(page, `${config.blogUrl}${config.indexPage}`, config, allBlogLinks, linkSet, state);
    while (true) {
      let linksArray = Array.from(allBlogLinks);
      if (linksArray.length == 0) {
        break;
      }

      if (limit != null && state.count >= limit) {
        console.log("Reaching Limit of " + limit + "! Program Quits.")
        console.log();
        return;
      }

      const link = linksArray[0];
      await scrapeLink(page, link, config, allBlogLinks, linkSet, state);
      allBlogLinks.delete(link);
    }

  } catch (error) {
    console.error('Error during scraping:', error);
    return;
  } finally {
    await browser.close();
  }
}