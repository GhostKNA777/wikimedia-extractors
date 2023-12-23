"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyEeMovieExtractor = void 0;
const axios_1 = require("../../utils/axios");
class SmashyEeMovieExtractor {
    name = 'Smashy (EE)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/cf.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const file = res.data.match(/file:\s*"([^"]+)"/)[1];
            if (file.includes('/404Found.mp4'))
                return undefined;
            const fileRes = await axios_1.axiosInstance.head(file);
            if (fileRes.status !== 200 || fileRes.data.includes('404'))
                return undefined;
            return {
                server: this.name,
                source: {
                    url: file,
                },
                type: 'mp4',
                quality: 'Unknown',
            };
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return undefined;
        }
    }
}
exports.SmashyEeMovieExtractor = SmashyEeMovieExtractor;
//# sourceMappingURL=ee.js.map