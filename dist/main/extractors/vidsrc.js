"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
//import log from 'electron-log';
//import fs from 'fs';
const axios_1 = require("../utils/axios");
class VidSrcExtractor {
    //logger = log.scope('VidSrc');
    url = 'https://vidsrc.me/';
    referer = 'https://vidsrc.stream/';
    origin = 'https://vidsrc.stream';
    embedUrl = `${this.url}embed/`;
    subtitleUrl = 'https://rest.opensubtitles.org/search/imdbid-';
    getHashBasedOnIndex(hash, index) {
        let result = '';
        for (let i = 0; i < hash.length; i += 2) {
            const j = hash.substring(i, i + 2);
            result += String.fromCharCode(parseInt(j, 16) ^ index.charCodeAt((i / 2) % index.length));
        }
        return result;
    }
    async extractUrls(imdbId, type, season, episode) {
        try {
            const url = type === 'movie' ? `${this.embedUrl}movie?imdb=${imdbId}` : `${this.embedUrl}tv?imdb=${imdbId}&season=${season}&episode=${episode}`;
            const res = await axios_1.axiosInstance.get(url);
            const $ = (0, cheerio_1.load)(res.data);
            const activeSourceUrl = `https:${$('#player_iframe').attr('src')}`;
            const srcRcpRes = await axios_1.axiosInstance.get(activeSourceUrl, {
                headers: {
                    referer: url,
                },
            });
            const srcRcpRes$ = (0, cheerio_1.load)(srcRcpRes.data);
            const id = srcRcpRes$('body').attr('data-i');
            const hash = srcRcpRes$('#hidden').attr('data-h');
            if (!id || !hash)
                throw new Error('No id or hash found');
            const sourceUrl = this.getHashBasedOnIndex(hash, id);
            const script = await axios_1.axiosInstance.get(`https:${sourceUrl}`, {
                headers: {
                    referer: url,
                },
            });
            const match = script.data
                .match(/file:"(.*?)"/)[1]
                .replace(/(\/\/\S+?=)/g, '')
                .replace('#2', '');
            const finalUrl = Buffer.from(match, 'base64').toString();
            //this.logger.debug(finalUrl);
            if (!finalUrl.includes('list.m3u8'))
                throw new Error('Something went wrong during url decoding');
            const subtitleData = await axios_1.axiosInstance.get(`${this.subtitleUrl}${imdbId}/sublanguageid-spa`, {
                headers: {
                    'X-User-Agent': 'trailers.to-UA',
                },
            });
            const reducedSubtitles = subtitleData.data.reduce((accumulator, subtitle) => {
                const languageName = subtitle.LanguageName;
                accumulator[languageName] = accumulator[languageName] || [];
                if (accumulator[languageName].length < 5) {
                    accumulator[languageName].push({
                        url: subtitle.SubDownloadLink,
                        lang: subtitle.LanguageName,
                        // kind: 'captions',
                    });
                }
                return accumulator;
            }, {});
            const finalSubtitles = Object.values(reducedSubtitles).flat();
            return [
                {
                    server: 'VidSrc Pro',
                    source: {
                        url: finalUrl,
                    },
                    type: 'm3u8',
                    quality: 'Unknown',
                    subtitles: finalSubtitles,
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
exports.default = VidSrcExtractor;
//# sourceMappingURL=vidsrc.js.map