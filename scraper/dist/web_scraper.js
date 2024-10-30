"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scrapeBlog;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const node_fetch_1 = __importDefault(require("node-fetch"));
// --------------------------helper-----------------------------
function randomDelay(min, max) {
    return __awaiter(this, void 0, void 0, function* () {
        const delay = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise((resolve) => setTimeout(resolve, delay));
    });
}
function randomUserEvent(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const randomOffset = Math.floor(Math.random() * 500) + 200;
        yield page.evaluate((offset) => window.scrollBy(0, offset), randomOffset);
        yield randomDelay(2000, 4000);
        yield page.mouse.move(150, 250, { steps: 10 });
        yield page.keyboard.type(Math.random().toString(), { delay: 100 });
    });
}
function wordCount(content) {
    return __awaiter(this, void 0, void 0, function* () {
        return content.trim().split(/\s+/).filter(word => word.length > 0).length;
    });
}
// -------------------------------------------------------------
function sendDataToBackend(header, content, link) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield (0, node_fetch_1.default)('http://localhost:8911/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: mutation, variables }),
            });
            if (!response.ok) {
                const errorText = yield response.text();
                console.error('GraphQL request failed:', errorText);
                return;
            }
            const result = yield response.json();
        }
        catch (error) {
            console.error('Failed to send data to backend:', error);
        }
    });
}
function scrollElement(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let previousHeight = 0;
        let currentHeight = yield page.evaluate(() => document.body.scrollHeight);
        while (previousHeight !== currentHeight) {
            previousHeight = currentHeight;
            yield page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            yield randomDelay(1500, 2000);
            currentHeight = (yield page.evaluate(() => document.body.scrollHeight));
        }
    });
}
function scrapeLink(page, target_url, config, allBlogLinks, linkSet, state) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Navigating to: ${target_url}`);
        yield page.goto(target_url, { waitUntil: 'networkidle2' });
        yield randomUserEvent(page);
        const lastPageNumber = 5;
        for (let i = 0; i < lastPageNumber; i++) {
            // perform inifnite scroll
            yield scrollElement(page);
            const blogLinks = yield page.evaluate((selector) => {
                return Array.from(document.querySelectorAll(selector)).map((a) => a.href);
            }, config.articleLinkSelector);
            blogLinks.forEach((link) => {
                if (!linkSet.has(link)) {
                    allBlogLinks.add(link);
                    linkSet.add(link);
                }
            });
            if (config.nextButton == null) {
                break;
            }
            else if (config.nextButton != null) {
                try {
                    yield page.click(config.nextButton);
                    yield randomUserEvent(page);
                    console.log("Successfully click the button!");
                }
                catch (error) {
                    console.log("Failed to find the button!");
                    break;
                }
            }
        }
        const { header, content } = yield page.evaluate((config) => {
            const headerElement = Array.from(document.querySelectorAll(config.headerSelector))[config.headerAppearTime];
            const contentElement = Array.from(document.querySelectorAll(config.contentSelector))[config.contentAppearTime];
            let header = '';
            let content = '';
            if (headerElement instanceof HTMLElement) {
                const rawTextArray = Array.from(headerElement.querySelectorAll('*'))
                    .map(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim()) || ''; })
                    .filter(text => text.length > 0);
                header = Array.from(new Set(rawTextArray))[config.headerAppearPos];
            }
            else {
                header = 'No title found';
            }
            if (contentElement instanceof HTMLElement) {
                const rawTextArray = Array.from(contentElement.querySelectorAll('*'))
                    .map(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, '').trim()) || ''; })
                    .filter(text => text.length > 0);
                content = Array.from(new Set(rawTextArray))[config.contentAppearPos];
            }
            else {
                content = 'No content found';
            }
            return { header, content };
        }, config);
        if (header != 'No title found' && content != 'No content found' && (yield wordCount(content)) >= 200) {
            state.count++;
            sendDataToBackend(header, content, target_url);
            console.log(`\x1b[34mExtracted Header:\x1b[0m ${header}`);
            console.log(`\x1b[34mExtracted Content:\x1b[0m ${content.slice(0, 50)}` + '...');
            console.log();
        }
        yield randomUserEvent(page);
    });
}
function scrapeBlog(config_1) {
    return __awaiter(this, arguments, void 0, function* (config, existingPage = null, limit = null) {
        puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
        const browser = yield puppeteer_extra_1.default.launch({ headless: true, args: ['--no-sandbox'] });
        const page = existingPage || (yield browser.newPage());
        const allBlogLinks = new Set();
        const linkSet = new Set();
        let state = { count: 0 };
        try {
            yield scrapeLink(page, `${config.blogUrl}${config.indexPage}`, config, allBlogLinks, linkSet, state);
            while (true) {
                let linksArray = Array.from(allBlogLinks);
                if (linksArray.length == 0) {
                    break;
                }
                if (limit != null && state.count >= limit) {
                    console.log("Reaching Limit of " + limit + "! Program Quits.");
                    console.log();
                    return;
                }
                const link = linksArray[0];
                yield scrapeLink(page, link, config, allBlogLinks, linkSet, state);
                allBlogLinks.delete(link);
            }
        }
        catch (error) {
            console.error('Error during scraping:', error);
            return;
        }
        finally {
            yield browser.close();
        }
    });
}
