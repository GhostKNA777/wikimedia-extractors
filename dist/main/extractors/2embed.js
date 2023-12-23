"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoEmbedExtractor = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = require("../utils/axios");
const utils_1 = require("./utils");
class TwoEmbedExtractor {
    name = '2Embed';
    url = 'https://www.2embed.cc/';
    referer = 'https://www.2embed.cc/';
    async extractUrls(imdbId, type, season, episode) {
        try {
            const url = 
            // eslint-disable-next-line no-nested-ternary
            type === 'movie' ? `${this.url}embed/${imdbId}` : type === 'tv' ? `${this.url}embedtv${imdbId}&s=${season}&e=${episode}/` : '';
            let res = await axios_1.axiosInstance.get(url);
            const $ = (0, cheerio_1.load)(res.data);
            const iframeUrl = $('iframe').attr('data-src');
            const id = iframeUrl?.match(/\?id=(.*?)&/)?.[1];
            console.log("IDok:", id);
            if (!id)
                throw new Error('No id found');
            res = await axios_1.axiosInstance.get(`https://wishfast.top/e/${id}`, {
                headers: {
                    referer: this.referer,
                },
            });
            //this.logger.debug(formatToJSON(res.data.match(/sources:\s*(\[.*?\])/)[1]), formatToJSON(res.data.match(/tracks:\s*(\[.*?\])/)[1]));
            const sources = JSON.parse((0, utils_1.formatToJSON)(res.data.match(/sources:\s*(\[.*?\])/)[1]));
            const tracks = JSON.parse((0, utils_1.formatToJSON)(res.data.match(/tracks:\s*(\[.*?\])/)[1]));
            const quality = await (0, utils_1.getResolutionFromM3u8)(sources[0].file, true);
            let thumbnails = tracks.find((t) => t.kind === 'thumbnails').file;
            if (thumbnails) {
                thumbnails = `https://wishfast.top${thumbnails}`;
            }
            const thumbnailContent = await axios_1.axiosInstance.get(thumbnails, {
                headers: {
                    referer: 'https://wishfast.top/',
                },
            });
            const subtitles = tracks
                .filter((t) => t.kind === 'captions')
                .map((subtitle) => ({
                file: subtitle.file,
                label: subtitle.label,
                kind: 'captions',
            }));
            return [
                {
                    server: this.name,
                    quality,
                    source: {
                        url: sources[0].file,
                    },
                    type: 'm3u8',
                    thumbnails: {
                        url: thumbnailContent.data,
                        requiresBlob: true,
                    },
                    subtitles,
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
exports.TwoEmbedExtractor = TwoEmbedExtractor;
//# sourceMappingURL=2embed.js.map