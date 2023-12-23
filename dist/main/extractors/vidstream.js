"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VidstreamExtractor = void 0;
//import log from 'electron-log';
const axios_1 = require("../utils/axios");
const utils_1 = require("./utils");
class VidstreamExtractor {
    //logger = log.scope('Vidstream');
    url = 'https://vidstream.pro/';
    referer = 'https://vidstream.pro/';
    eltikUrl = 'https://9anime.eltik.net/';
    async getFuToken(referer) {
        const res = await axios_1.axiosInstance.get(`${this.url}futoken`, {
            headers: {
                referer: encodeURIComponent(referer),
            },
        });
        const fuTokenWithoutComments = res.data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
        return fuTokenWithoutComments;
    }
    async getFileUrl(sourceUrl) {
        const futoken = await this.getFuToken(sourceUrl);
        const id = sourceUrl.split('e/')[1].split('?')[0];
        const res = await axios_1.axiosInstance.post(`${this.eltikUrl}rawVizcloud?query=${id}&apikey=lagrapps`, {
            query: id,
            futoken,
        });
        return `${res.data.rawURL}?${sourceUrl.split('?')[1]}`;
    }
    async extractUrl(url) {
        try {
            const fileUrl = await this.getFileUrl(`${url}&autostart=true`);
            const res = await axios_1.axiosInstance.get(fileUrl, {
                headers: {
                    referer: url,
                },
            });
            const source = res.data.result.sources[0].file;
            const quality = await (0, utils_1.getResolutionFromM3u8)(source, true);
            const thumbnail = res.data.result?.tracks?.find((track) => track.kind === 'thumbnails');
            return {
                server: 'Vidstream',
                source: {
                    url: source,
                },
                type: 'm3u8',
                quality,
                thumbnails: {
                    url: thumbnail?.file,
                },
            };
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return undefined;
        }
    }
}
exports.VidstreamExtractor = VidstreamExtractor;
//# sourceMappingURL=vidstream.js.map