"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyFxExtractor = void 0;
const axios_1 = require("../../utils/axios");
class SmashyFxExtractor {
    name = 'Smashy (Fx)';
    // logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/fx555.php';
    referer = 'https://remotestre.am/';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const file = res.data.match(/file:\s*"([^"]+)"/)[1];
            return {
                server: this.name,
                source: {
                    url: file,
                },
                type: file.includes('.m3u8') ? 'm3u8' : 'mp4',
                quality: 'Unknown',
                proxySettings: {
                    type: file.includes('.m3u8') ? 'm3u8' : 'mp4',
                    referer: this.referer,
                },
            };
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return undefined;
        }
    }
}
exports.SmashyFxExtractor = SmashyFxExtractor;
//# sourceMappingURL=fx.js.map