"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteStreamExtractor = void 0;
const axios_1 = require("../utils/axios");
const utils_1 = require("./utils");
class RemoteStreamExtractor {
    name = 'RemoteStream';
    //logger = log.scope(this.name);
    url = 'https://remotestream.cc/e/?';
    referer = 'https://remotestream.cc/';
    apiKey = 'bRR3S48MbSnqjSaYNdCrBLfTIGQQNPRo';
    async extractUrls(imdbId, type, season, episode) {
        try {
            const url = type === 'movie' ? `${this.url}imdb=${imdbId}&apikey=${this.apiKey}` : `${this.url}imdb=${imdbId}&s=${season}&e=${episode}&apikey=${this.apiKey}`;
            const res = await axios_1.axiosInstance.get(url);
            const fileRegex = /"file":"(.*?)"/;
            const match = res.data.match(fileRegex);
            if (!match || !match[1])
                throw new Error('No match found');
            console.log(match[1]);
            const quality = await (0, utils_1.getResolutionFromM3u8)(match[1], true, {
                referer: this.referer,
            });
            return [
                {
                    server: this.name,
                    source: {
                        url: match[1],
                    },
                    type: 'm3u8',
                    quality,
                    proxySettings: {
                        type: 'm3u8',
                        origin: this.referer,
                        referer: this.referer,
                        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    },
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
exports.RemoteStreamExtractor = RemoteStreamExtractor;
//# sourceMappingURL=remotestream.js.map