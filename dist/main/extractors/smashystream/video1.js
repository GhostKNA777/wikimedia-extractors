"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyVideo1Extractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyVideo1Extractor {
    name = 'Smashy (V1)';
    // logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/video1.php';
    referer = 'https://embed.smashystream.com/playere.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: this.referer,
                },
            });
            const vttArray = res.data.subtitleUrls.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g).map((entry) => {
                const [, name, link] = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
                return { name, link: link.replace(',', '') };
            });
            const quality = await (0, utils_1.getResolutionFromM3u8)(res.data.sourceUrls[0], true, {
                referer: this.referer,
            });
            return {
                server: this.name,
                source: {
                    url: res.data.sourceUrls[0],
                },
                type: 'm3u8',
                quality,
                subtitles: vttArray
                    .filter((it) => !it.link.includes('thumbnails'))
                    .map((subtitle) => ({
                    file: subtitle.link,
                    label: subtitle.name,
                    kind: 'captions',
                })),
            };
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return undefined;
        }
    }
}
exports.SmashyVideo1Extractor = SmashyVideo1Extractor;
//# sourceMappingURL=video1.js.map