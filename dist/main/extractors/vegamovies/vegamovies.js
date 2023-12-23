"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VegaMoviesExtractor = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
const gofile_1 = require("./gofile");
const aiotechnical_1 = require("./aiotechnical");
class VegaMoviesExtractor {
    name = 'VegaMovies';
    url = 'https://m.vegamovies.boo/';
    //logger = log.scope(this.name);
    goFileExtractor = new gofile_1.GoFileExtractor();
    async getTitleUrl(title) {
        const res = await axios_1.axiosInstance.get(`${this.url}search/${encodeURIComponent(title)}`);
        const $ = (0, cheerio_1.load)(res.data);
        const pageTitle = $('head title').text();
        if (pageTitle.includes('Download')) {
            return res.request.res.responseUrl;
        }
        const pageUrl = $(`.blog-items article`).first().find('a').attr('href');
        return pageUrl;
    }
    mapWrongShowTitles(title) {
        if (title.includes('Guardians of the Galaxy Vol. 3'))
            title.replace('Vol.', 'Volume');
        return title;
    }
    async extractVCloud(url) {
        const vcloudPage = await axios_1.axiosInstance.get(url);
        const vCloudPage$ = (0, cheerio_1.load)(vcloudPage.data);
        const vCloudPageCookies = vcloudPage.headers['set-cookie'];
        let vCloudDownloadLink = vCloudPage$('a.btn.btn-primary.h6').attr('href');
        if (!vCloudDownloadLink) {
            const redirectLinkRegex = /var\s+url\s*=\s*'([^']+)'/;
            const redirectLinkData = vcloudPage.data.match(redirectLinkRegex)[1];
            vCloudDownloadLink = Buffer.from(redirectLinkData.split('r=')[1], 'base64').toString();
        }
        const redirectLinkData = await axios_1.axiosInstance.get(vCloudDownloadLink, {
            headers: {
                cookie: vCloudPageCookies,
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36',
            },
        });
        const $redirectLinkData = (0, cheerio_1.load)(redirectLinkData.data);
        let finalDownloadLink = $redirectLinkData('a.btn-success.btn-lg.h6').attr('href');
        if (!finalDownloadLink) {
            finalDownloadLink = $redirectLinkData('.btn.btn-success.btn-lg.h6').attr('href');
        }
        //this.logger.debug(finalDownloadLink);
        if (!finalDownloadLink)
            throw new Error('No download link found');
        if (finalDownloadLink.includes('gofile')) {
            const source = await this.goFileExtractor.extractUrl(finalDownloadLink);
            if (!source)
                throw new Error('Invalid gofile link');
            return source;
        }
        return {
            server: this.name,
            source: {
                url: finalDownloadLink,
            },
            type: 'mkv',
            quality: (0, utils_1.getResolution)(finalDownloadLink),
            isVlc: true,
        };
    }
    async extractFastDl(url) {
        const redirectPage = await axios_1.axiosInstance.get(url);
        let fastDlUrl = '';
        if (redirectPage.data.includes('aiotechnical.com')) {
            fastDlUrl = await (0, aiotechnical_1.extractAioTechnical)(redirectPage.data);
        }
        if (!fastDlUrl)
            throw new Error('FastDL link was not redirected through aiotechnical');
        const fastDlPage = await axios_1.axiosInstance.get(fastDlUrl);
        throw new Error('FastDL link not implemented yet');
        return {
            server: this.name,
            source: {
                url: '',
            },
            type: 'mp4',
            quality: (0, utils_1.getResolution)(''),
            isVlc: true,
        };
    }
    async extractUrls(title, type, season, episode) {
        try {
            const findMovieUrl = await this.getTitleUrl(this.mapWrongShowTitles(title));
            if (!findMovieUrl)
                throw new Error('Movie not found');
            const moviePage = await axios_1.axiosInstance.get(findMovieUrl);
            const moviePage$ = (0, cheerio_1.load)(moviePage.data);
            let downloadLink = moviePage$('.dwd-button').last().parent().attr('href');
            if (type === 'tv') {
                const seasonTitleContainer = moviePage$('h3:has(span) span')
                    .filter((_, el) => moviePage$(el).text().includes(`Season ${season}`))
                    .last();
                const seasonButtonContainer = seasonTitleContainer.parentsUntil('h3').parent().next();
                const vCloudUrl = seasonButtonContainer
                    .find('button')
                    .filter((_, el) => moviePage$(el).text().includes('V-Cloud') || moviePage$(el).text().includes('Episode Links') || moviePage$(el).text().includes('Single Episode'))
                    .parent()
                    .attr('href');
                downloadLink = vCloudUrl;
            }
            //this.logger.debug(downloadLink);
            const formData = new URLSearchParams();
            formData.append('link', downloadLink);
            const downloadLinkWithToken = await axios_1.axiosInstance.post(`${new URL(downloadLink).origin}/red.php`, formData.toString(), {
                headers: {
                    referer: this.url,
                },
            });
            const urlRegex = /window\.location\.href\s*=\s*"([^"]+)"/;
            const downloadPageUrl = downloadLinkWithToken.data.match(urlRegex)[1];
            const downloadPage = await axios_1.axiosInstance.get(downloadPageUrl);
            const downloadPage$ = (0, cheerio_1.load)(downloadPage.data);
            let vcloudUrl = downloadPage$('a')
                .toArray()
                .find((a) => downloadPage$(a).attr('href')?.includes('v-cloud.bio') || downloadPage$(a).attr('href')?.includes('fast-dl.pro'));
            if (type === 'tv') {
                const episodesContainer = downloadPage$('h4 > span strong span').filter((_, el) => downloadPage$(el).text().includes(`-:Episodes: ${episode}:-`));
                const episodeButtonContainer = episodesContainer.parent().parent().parent().next();
                vcloudUrl = episodeButtonContainer
                    .find('a')
                    .toArray()
                    .find((a) => downloadPage$(a).attr('href')?.includes('v-cloud.bio') || downloadPage$(a).attr('href')?.includes('fast-dl.pro'));
            }
            //this.logger.debug(vcloudUrl?.attribs.href);
            if (vcloudUrl?.attribs.href.includes('v-cloud.bio')) {
                return [await this.extractVCloud(vcloudUrl.attribs.href)];
            }
            if (vcloudUrl?.attribs.href.includes('fast-dl.pro')) {
                return [await this.extractFastDl(vcloudUrl.attribs.href)];
            }
            throw new Error('No download link found');
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return [];
        }
    }
}
exports.VegaMoviesExtractor = VegaMoviesExtractor;
//# sourceMappingURL=vegamovies.js.map