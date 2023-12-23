"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyStreamExtractor = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = require("../../utils/axios");
const cf_1 = require("./cf");
const dudmovie_1 = require("./dudmovie");
const ee_1 = require("./ee");
const ems_1 = require("./ems");
const ffix_1 = require("./ffix");
const fizzzz_1 = require("./fizzzz");
const fm22_1 = require("./fm22");
const fx_1 = require("./fx");
const im_1 = require("./im");
const nflim_1 = require("./nflim");
const segu_1 = require("./segu");
const video1_1 = require("./video1");
const video3m_1 = require("./video3m");
const watchx_1 = require("./watchx");
class SmashyStreamExtractor {
    //logger = log.scope('SmashyStream');
    url = 'https://embed.smashystream.com/playere.php';
    referer = 'https://smashystream.com/';
    imExtractor = new im_1.SmashyImExtractor();
    ffixExtractor = new ffix_1.SmashyFFixExtractor();
    watchXExtractor = new watchx_1.SmashyWatchXExtractor();
    nflimExtractor = new nflim_1.SmashyNFlimExtractor();
    fxExtractor = new fx_1.SmashyFxExtractor();
    cfExtractor = new cf_1.SmashyCfExtractor();
    eeMovieExtractor = new ee_1.SmashyEeMovieExtractor();
    fizzzzExtractor = new fizzzz_1.SmashyFizzzzExtractor();
    fm22Extractor = new fm22_1.SmashyFm22Extractor();
    dudMovieExtractor = new dudmovie_1.SmashyDudMovieExtractor();
    seguExtractor = new segu_1.SmashySeguExtractor();
    emsExtractor = new ems_1.SmashyEmsExtractor();
    video1Extractor = new video1_1.SmashyVideo1Extractor();
    video3mExtractor = new video3m_1.SmashyVideo3MExtractor();
    async extractUrls(imdbId, type, season, episode) {
        try {
            const url = type === 'movie' ? `${this.url}?imdb=${imdbId}` : `${this.url}?imdb=${imdbId}&season=${season}&episode=${episode}`;
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: this.referer,
                },
            });
            const $ = (0, cheerio_1.load)(res.data);
            const sourceUrls = $('.dropdown-menu a[data-url]')
                .map((_, el) => $(el).attr('data-url'))
                .get();
            const sourcesPromise = sourceUrls.map(async (sourceUrl, index) => {
                if (index > 0) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
                if (sourceUrl.includes('fizzzz1.php')) {
                    return this.fizzzzExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('fm22.php')) {
                    return this.fm22Extractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('lk08.php')) {
                    return this.seguExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('dud_movie.php')) {
                    return this.dudMovieExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('segu.php')) {
                    return this.seguExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('ems.php')) {
                    return this.emsExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('im.php')) {
                    return this.imExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('ffix1.php')) {
                    return this.ffixExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('watchx.php')) {
                    return this.watchXExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('nflim.php')) {
                    return this.nflimExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('fx555.php')) {
                    return this.fxExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('cf.php')) {
                    return this.cfExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('eemovie.php')) {
                    return this.eeMovieExtractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('video1.php')) {
                    return this.video1Extractor.extractUrl(sourceUrl);
                }
                if (sourceUrl.includes('video3m.php')) {
                    return this.video3mExtractor.extractUrl(sourceUrl);
                }
                return undefined;
            });
            const sources = await Promise.all(sourcesPromise.filter((it) => it !== undefined));
            return sources.filter((it) => it !== undefined);
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err);
            return [];
        }
    }
}
exports.SmashyStreamExtractor = SmashyStreamExtractor;
//# sourceMappingURL=smashystream.js.map