"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyDudMovieExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyDudMovieExtractor {
    name = 'Smashy (DM)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/dud_movie.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const config = JSON.parse(res.data.match(/new\s+Playerjs\((\{[^]*?\})\);/)[1].replace(/'/g, '"'));
            const fileUrl = config.file.find((it) => it.title === 'English').file;
            const quality = await (0, utils_1.getResolutionFromM3u8)(fileUrl, true);
            return {
                server: this.name,
                source: {
                    url: fileUrl,
                },
                type: fileUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
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
exports.SmashyDudMovieExtractor = SmashyDudMovieExtractor;
//# sourceMappingURL=dudmovie.js.map