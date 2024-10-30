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
const web_scraper_1 = __importDefault(require("./web_scraper"));
const coinbaseConfig = {
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
const binanceConfig = {
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await scrapeBlog(coinbaseConfig, null, 5);
        yield (0, web_scraper_1.default)(binanceConfig, null, 5);
    }
    catch (error) {
        console.error('Error during test:', error);
    }
}))();
