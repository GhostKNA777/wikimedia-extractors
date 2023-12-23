"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyEmsExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyEmsExtractor {
    name = 'Smashy (EMS)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/ems.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const config = JSON.parse(res.data.match(/new\s+Playerjs\((\{[^]*?\})\);/)[1].replace(/'/g, '"'));
            const fileUrl = config.file;
            const subtitleArray = config.subtitle
                .split(',')
                .map((entry) => {
                const nameRegex = /\[([^\]]*)\]/;
                const urlRegex = /(https:\/\/[^\s,]+)/;
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
            const hlsResponse = await axios_1.axiosInstance.get(fileUrl, {
                headers: {
                    referer: url,
                },
            });
            if (hlsResponse.data === '')
                return;
            const quality = await (0, utils_1.getResolutionFromM3u8)(hlsResponse.data, false);
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
exports.SmashyEmsExtractor = SmashyEmsExtractor;
//# sourceMappingURL=ems.js.map