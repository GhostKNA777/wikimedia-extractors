"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CricFoot2Extractor = void 0;
const cheerio_1 = require("cheerio");
const vm_1 = __importStar(require("vm"));
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class CricFoot2Extractor {
    name = 'CricFoot2';
    //logger = log.scope(this.name);
    mainPageUrl = 'https://cricfoot2.com/';
    referer = 'https://paktech2.com/';
    async getMainPage() {
        const res = await axios_1.axiosInstance.get(`${this.mainPageUrl}/sports_tv.php`);
        const $ = (0, cheerio_1.load)(res.data);
        const items = $('.content_area .col-md-3')
            .map((i, el) => {
            const $1 = (0, cheerio_1.load)(el);
            const title = $1('.b_box').text();
            const imgSrc = $1('img').attr('src');
            const url = $1('a').attr('href');
            return {
                title,
                imgSrc,
                url,
            };
        })
            .get();
        return items;
    }
    async extractUrls(url) {
        try {
            //this.logger.debug(`extracting url: ${url}`);
            const res = await axios_1.axiosInstance.get(url);
            const $ = (0, cheerio_1.load)(res.data);
            const link = $("a:contains('Go Watch Links')").attr('href');
            if (!link)
                throw new Error('No link found');
            const watchLinksPage = await axios_1.axiosInstance.get(link);
            const watchLInksPage$ = (0, cheerio_1.load)(watchLinksPage.data);
            const streamLinks = watchLInksPage$("a:contains('Stream')")
                .map((i, el) => watchLInksPage$(el).attr('href'))
                .get();
            // this.logger.debug(`streamLinks: ${streamLinks}`);
            const streamLinkPromises = streamLinks.map(async (streamLink) => {
                const streamPage = await axios_1.axiosInstance.get(streamLink);
                const streamPage$ = (0, cheerio_1.load)(streamPage.data);
                return streamPage$('iframe').attr('src');
            });
            const streamPageLinks = [...new Set((await Promise.all(streamLinkPromises)).filter((l) => l !== undefined))];
            // this.logger.debug(`streamPageLinks: ${streamPageLinks}`);
            const streamPageLinkPromises = streamPageLinks.map(async (streamPageLink) => {
                if (streamPageLink.includes('tvpclive.com')) {
                    return this.extractTVpLiveUrl(streamPageLink);
                }
                if (streamPageLink.includes('crichd.vip')) {
                    return this.extractCrichdUrl(streamPageLink);
                }
                if (streamPageLink.includes('dlhd.sx')) {
                    return this.extractDlhd(streamPageLink);
                }
                if (streamPageLink.includes('daddylivehd.online')) {
                    return this.extractDaddyLiveHD(streamPageLink);
                }
                if (streamPageLink.includes('1stream.buzz')) {
                    return this.extract1StreamBuzz(streamPageLink);
                }
            });
            const streamPageLinkResults = (await Promise.all(streamPageLinkPromises)).filter((l) => l !== undefined);
            //this.logger.debug(streamPageLinkResults);
            return streamPageLinkResults;
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return [];
        }
    }
    extractTVpLiveUrl = async (url) => {
        const res = await axios_1.axiosInstance.get(url);
        const $ = (0, cheerio_1.load)(res.data);
        const iframeUrl = $('iframe').attr('src');
        if (!iframeUrl)
            throw new Error('No iframe url found');
        const iframeRes = await axios_1.axiosInstance.get(iframeUrl, {
            headers: {
                Referer: url,
            },
        });
        const regex = /source:'(.*?)'/g;
        const matches = [...iframeRes.data.matchAll(regex)];
        const finalLiveUrl = matches.map((match) => match[1])[1];
        const quality = await (0, utils_1.getResolutionFromM3u8)(finalLiveUrl, true);
        return {
            server: 'TVPLive',
            source: {
                url: finalLiveUrl,
            },
            quality,
            type: 'm3u8',
            proxySettings: {
                type: 'm3u8',
                referer: 'https://ddolahdplay.xyz/',
            },
        };
    };
    async extractCrichdUrl(url) {
        const res = await axios_1.axiosInstance.get(url);
        const regex = /fid="([^"]+)"/;
        const fid = res.data.match(regex)[1];
        const res2 = await axios_1.axiosInstance.get(`https://lovesomecommunity.com/crichdisi.php?player=desktop&live=${fid}`, {
            headers: {
                Referer: 'https://stream.crichd.vip/',
            },
        });
        const finalUrlRegex = /return\s*\(\s*\[([^\]]*)\]/;
        const finalUrl = JSON.parse(`[${res2.data.match(finalUrlRegex)[1]}]`)
            .join('')
            .replace('////', '//');
        const quality = await (0, utils_1.getResolutionFromM3u8)(finalUrl, true);
        return {
            server: 'Crichd',
            source: {
                url: finalUrl,
            },
            quality,
            type: 'm3u8',
            proxySettings: {
                type: 'm3u8',
                referer: 'https://lovesomecommunity.com/',
            },
        };
    }
    async extractDlhd(url) {
        const res = await axios_1.axiosInstance.get(url, {
            headers: {
                Referer: this.referer,
            },
        });
        const $ = (0, cheerio_1.load)(res.data);
        const iframeUrl = $('iframe').attr('src');
        //this.logger.debug(iframeUrl);
        if (!iframeUrl)
            throw new Error('No iframe url found');
        const iframeRes = await axios_1.axiosInstance.get(iframeUrl, {
            headers: {
                Referer: 'https://dlhd.sx/',
            },
        });
        const source = this.getNonCommentedSource(iframeRes.data);
        //this.logger.debug(source);
        if (!source)
            throw new Error('No source url found');
        const m3u8File = await axios_1.axiosInstance.get(source, {
            headers: {
                Referer: 'https://weblivehdplay.ru/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0',
            },
        });
        //this.logger.debug(m3u8File.data);
        if (m3u8File.data.includes('Unable to find the specified'))
            throw new Error('Unable to find the specified');
        const quality = await (0, utils_1.getResolutionFromM3u8)(m3u8File.data, false);
        return {
            server: 'Dlhd',
            source: {
                url: m3u8File.request.res.responseUrl,
            },
            quality,
            type: 'm3u8',
            proxySettings: {
                type: 'm3u8',
                origin: 'https://weblivehdplay.ru',
                referer: 'https://weblivehdplay.ru/',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            },
        };
    }
    async extractOlaliveHdPlay(url) {
        const res = await axios_1.axiosInstance.get(url, {
            headers: {
                Referer: 'https://daddylivehd.com/',
            },
        });
        const source = this.getNonCommentedSource(res.data);
        if (!source)
            throw new Error('No source url found');
        return source;
    }
    async extractDaddyLiveHD(url) {
        const res = await axios_1.axiosInstance.get(url, {
            headers: {
                Referer: 'https://daddylivehd.com/',
            },
        });
        const $ = (0, cheerio_1.load)(res.data);
        const iframeUrl = $('iframe').attr('src');
        if (!iframeUrl)
            throw new Error('No iframe url found');
        const source = await this.extractOlaliveHdPlay(iframeUrl);
        const quality = await (0, utils_1.getResolutionFromM3u8)(source, true);
        return {
            server: 'DaddyLiveHD',
            source: {
                url: source,
            },
            quality,
            type: 'm3u8',
            proxySettings: {
                type: 'm3u8',
                referer: 'https://livehdplay.ru/',
            },
        };
    }
    async extract1StreamBuzz(url) {
        const res = await axios_1.axiosInstance.get(url, {
            headers: {
                Referer: this.mainPageUrl,
            },
        });
        const $ = (0, cheerio_1.load)(res.data);
        const iframeUrl = $('iframe').attr('src');
        if (!iframeUrl)
            throw new Error('No iframe url found');
        const source = await this.extractAbolishStand(iframeUrl);
        const quality = await (0, utils_1.getResolutionFromM3u8)(source, true);
        return {
            server: '1StreamBuzz',
            source: {
                url: source,
            },
            quality,
            type: 'm3u8',
            proxySettings: {
                type: 'm3u8',
                referer: 'https://abolishstand.net/',
            },
        };
    }
    async extractAbolishStand(url) {
        const res = await axios_1.axiosInstance.get(url, {
            headers: {
                Referer: 'https://1stream.buzz/',
            },
        });
        const $ = (0, cheerio_1.load)(res.data);
        const script = $('script')
            .filter((_, el) => $(el).html()?.includes('eval') ?? false)
            .first()
            .html();
        //this.logger.debug(script);
        if (!script)
            throw new Error('No script found');
        const sandbox = {
            src: '',
            $: () => {
                return {
                    ready: () => { },
                };
            },
            document: {},
        };
        (0, vm_1.runInContext)(script, vm_1.default.createContext(sandbox));
        return sandbox.src;
    }
    getNonCommentedSource(data) {
        const regex = /\/\/.*?(?=\n|$)|source\s*:\s*'([^']+)'/g;
        const matches = data.match(regex);
        const nonCommentedSources = matches?.filter((match) => !match.startsWith('//'));
        const firstNonCommentedSource = nonCommentedSources?.[0].match(/source\s*:\s*'([^']+)'/)?.[1];
        if (!firstNonCommentedSource)
            throw new Error('No source url found');
        return firstNonCommentedSource;
    }
}
exports.CricFoot2Extractor = CricFoot2Extractor;
//# sourceMappingURL=cricfoot2.js.map