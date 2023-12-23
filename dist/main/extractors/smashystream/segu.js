"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashySeguExtractor = void 0;
const axios_1 = require("../../utils/axios");
class SmashySeguExtractor {
    name = 'Smashy (Se)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/segu.php';
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
            return {
                server: this.name,
                source: {
                    url: fileUrl,
                },
                type: fileUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
                quality: quality.includes('K') ? quality : quality.toLowerCase(),
            };
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return undefined;
        }
    }
}
exports.SmashySeguExtractor = SmashySeguExtractor;
//# sourceMappingURL=segu.js.map