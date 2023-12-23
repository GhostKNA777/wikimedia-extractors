"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyFm22Extractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyFm22Extractor {
    name = 'Smashy (FM22)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/fm22.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const config = JSON.parse(res.data
                .match(/new\s+Playerjs\((\{[^]*?\})\);/)[1]
                .replace('id', '"id"')
                .replace('file', '"file"')
                .replace('subtitle', '"subtitle"')
                .replace(/,([^,]*)$/, '$1'));
            const fileUrl = config.file;
            const subtitleArray = config.subtitle
                .split(',')
                .map((entry) => {
                const nameRegex = /\[([^\]]*)\]/;
                const urlRegex = /https:\/\/s3\.bunnycdn\.ru\/[^\s,]+/g;
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
exports.SmashyFm22Extractor = SmashyFm22Extractor;
//# sourceMappingURL=fm22.js.map