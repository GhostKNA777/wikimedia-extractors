"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyVideo3MExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyVideo3MExtractor {
    name = 'Smashy (3M)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/video1.php';
    referer = 'https://embed.smashystream.com/playere.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: this.referer,
                },
            });
            const sourceUrl = res.data.sourceUrls.find((s) => s.title === 'English').file;
            if (!sourceUrl)
                throw new Error('No source url found');
            const quality = await (0, utils_1.getResolutionFromM3u8)(sourceUrl, true, {
                referer: this.referer,
            });
            return {
                server: this.name,
                source: {
                    url: sourceUrl,
                },
                type: 'm3u8',
                quality,
            };
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return undefined;
        }
    }
}
exports.SmashyVideo3MExtractor = SmashyVideo3MExtractor;
//# sourceMappingURL=video3m.js.map