"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamlareExtractor = void 0;
//import log from 'electron-log';
const axios_1 = require("../utils/axios");
class StreamlareExtractor {
    //logger = log.scope('Streamlare');
    url = 'https://streamlare.com/';
    referer = 'https://sltube.org/';
    async extractUrl(url) {
        try {
            const id = url.split('/').pop();
            // Streamlare endpoint requires the same userAgent that is used in the API request
            //const userAgent = app.userAgentFallback;
            const res = await axios_1.axiosInstance.post(`${this.url}api/video/stream/get`, {
                id,
            }, {
                headers: {
                    //'User-Agent': userAgent,
                    'User-Agent': "userAgent",
                },
            });
            if (res.data.result?.Original?.file) {
                return {
                    server: 'Streamlare',
                    source: {
                        url: res.data.result.Original.file,
                    },
                    type: res.data.type.includes('mp4') ? 'mp4' : 'm3u8',
                    quality: 'Unknown',
                };
            }
            return undefined;
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return undefined;
        }
    }
}
exports.StreamlareExtractor = StreamlareExtractor;
//# sourceMappingURL=streamlare.js.map