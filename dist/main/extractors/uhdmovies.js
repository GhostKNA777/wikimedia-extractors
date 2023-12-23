"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UHDMoviesExtractor = void 0;
//import log from 'electron-log';
const cheerio_1 = require("cheerio");
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = require("../utils/axios");
class UHDMoviesExtractor {
    name = 'UHDMovies';
    url = 'https://uhdmovies.zip';
    //public logger = log.scope(this.name);
    async extractOddFirmDriveLeechUrl(url) {
        const result = await axios_1.axiosInstance.get(url);
        const result$ = (0, cheerio_1.load)(result.data);
        const continuePage = await axios_1.axiosInstance.post(result$('form').attr('action'), new URLSearchParams({
            _wp_http: result$('input[name="_wp_http"]').attr('value'),
        }));
        const continuePage$ = (0, cheerio_1.load)(continuePage.data);
        const goToDownloadPage = await axios_1.axiosInstance.post(continuePage$('form').attr('action'), new URLSearchParams({
            _wp_http2: continuePage$('input[name="_wp_http2"]').attr('value'),
            token: continuePage$('input[name="token"]').attr('value'),
        }));
        const regex = /s_343\(([^,]+),\s*([^,]+)/g;
        let match;
        let redirectId;
        let token;
        // eslint-disable-next-line no-cond-assign
        while ((match = regex.exec(goToDownloadPage.data)) !== null) {
            redirectId = match[1].trim();
            token = match[2].trim();
        }
        const driveLeechUrl = await axios_1.axiosInstance.get(`https://oddfirm.com/?go=${redirectId?.replace("'", '').replace("'", '')}`, {
            headers: {
                cookie: `${redirectId?.replace("'", '').replace("'", '')}=${token?.replace("'", '')};path=/`,
            },
        });
        const driveLeechUrl$ = (0, cheerio_1.load)(driveLeechUrl.data);
        const finalUrl = driveLeechUrl$('meta[http-equiv=refresh]').attr('content');
        return finalUrl;
    }
    async extractDriveLeech(url) {
        const driveResult = await axios_1.axiosInstance.get(url);
        const regex = /window\.location\.replace\("([^"]+)"\)/;
        const driveLeechPath = driveResult.data.match(regex)[1];
        const driveLeechResult = await axios_1.axiosInstance.get(new URL(url).origin + driveLeechPath, {
            headers: {
                cookie: driveResult.headers['set-cookie'],
            },
        });
        const driveLeechResult$ = (0, cheerio_1.load)(driveLeechResult.data);
        const instantDownload = driveLeechResult$('a:contains("Instant Download")').attr('href');
        if (!instantDownload)
            throw new Error('Instant download link not found');
        return instantDownload;
    }
    async extractVideoCdn(url) {
        const formData = new form_data_1.default();
        formData.append('keys', url.split('url=')[1]);
        const apiData = await axios_1.axiosInstance.post(`${new URL(url).origin}/api`, formData, {
            headers: {
                'x-token': new URL(url).hostname,
            },
        });
        if (apiData.data.error)
            throw new Error(apiData.data.message);
        return apiData.data.url;
    }
    async extractUrls(showName, type, season, episode) {
        try {
            const searchResult = await axios_1.axiosInstance.get(`${this.url}?s=${encodeURIComponent(showName)}`);
            const searchResult$ = (0, cheerio_1.load)(searchResult.data);
            const detailLink = searchResult$('.row.gridlove-posts .layout-masonry article:first-child .box-inner-p a').attr('href');
            if (!detailLink)
                throw new Error('Show page not found');
            const detailResult = await axios_1.axiosInstance.get(detailLink);
            const detailResult$ = (0, cheerio_1.load)(detailResult.data);
            let driveLink = detailResult$(`a[title="Download From Google Drive"]`).attr('href');
            if (type === 'tv' && season && episode) {
                // TODO: Extract tv show
            }
            if (!driveLink)
                throw new Error('Drive link not found');
            if (driveLink.includes('oddfirm') || driveLink.includes('unblockedgames')) {
                const driveLeechUrl = await this.extractOddFirmDriveLeechUrl(driveLink);
                if (!driveLeechUrl)
                    throw new Error('Drive leech link not found in oddfirm');
                driveLink = driveLeechUrl.split('url=')[1];
            }
            const videoCdnLink = await this.extractDriveLeech(driveLink);
            const finalUrl = await this.extractVideoCdn(videoCdnLink);
            return [
                {
                    server: this.name,
                    source: {
                        url: finalUrl,
                    },
                    quality: '4k',
                    type: 'mkv',
                    isVlc: true,
                },
            ];
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return [];
        }
    }
}
exports.UHDMoviesExtractor = UHDMoviesExtractor;
//# sourceMappingURL=uhdmovies.js.map