"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyImExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyImExtractor {
    name = 'Smashy (Im)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/im.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const config = JSON.parse(res.data.match(/new\s+Playerjs\((\{.*?\})\);/)[1]);
            const fileUrl = config.file;
            const subtitleArray = config.subtitle
                .split(',')
                .map((entry) => {
                const nameRegex = /\[([^\]]*)\]/;
                const urlRegex = /https:\/\/cc\.2cdns\.com\/.*?\/(\w+-\d+)\.vtt/;
                const nameMatch = nameRegex.exec(entry);
                const urlMatch = urlRegex.exec(entry);
                const name = nameMatch && nameMatch[1].trim() ? nameMatch[1].trim() : urlMatch && urlMatch[1];
                const subtitleUrl = urlMatch && urlMatch[0].trim();
                return {
                    file: subtitleUrl,
                    label: name,
                    kind: 'captions',
                };
            })
                .filter((subtitle) => subtitle.file !== null);
            const quality = await (0, utils_1.getResolutionFromM3u8)(fileUrl, true);
            return {
                server: this.name,
                source: {
                    url: fileUrl,
                },
                type: fileUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
                quality,
                subtitles: subtitleArray,
            };
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return undefined;
        }
    }
}
exports.SmashyImExtractor = SmashyImExtractor;
//# sourceMappingURL=im.js.map