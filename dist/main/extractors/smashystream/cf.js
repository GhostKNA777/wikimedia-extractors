"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyCfExtractor = void 0;
const axios_1 = require("../../utils/axios");
class SmashyCfExtractor {
    name = 'Smashy (CF)';
    // logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/cf.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const file = res.data.match(/file:\s*"([^"]+)"/)[1];
            const fileRes = await axios_1.axiosInstance.head(file);
            if (fileRes.status !== 200 || fileRes.data.includes('404'))
                return undefined;
            return {
                server: this.name,
                source: {
                    url: file,
                },
                type: file.includes('.m3u8') ? 'm3u8' : 'mp4',
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
exports.SmashyCfExtractor = SmashyCfExtractor;
//# sourceMappingURL=cf.js.map