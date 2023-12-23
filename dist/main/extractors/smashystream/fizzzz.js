"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyFizzzzExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyFizzzzExtractor {
    name = 'Smashy (Fiz)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/fizzzz1.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const config = JSON.parse(res.data.match(/new\s+Playerjs\((\{[^]*?\})\);/)[1].replace(/'/g, '"'));
            const fileUrl = config.file.split(',')[0].split(']')[1];
            const quality = config.file.split(',')[0].split(']')[0].split('[')[1];
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
            return {
                server: this.name,
                source: {
                    url: fileUrl,
                },
                type: fileUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
                quality: (0, utils_1.getResolutionName)(parseInt(quality, 10)),
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
exports.SmashyFizzzzExtractor = SmashyFizzzzExtractor;
//# sourceMappingURL=fizzzz.js.map