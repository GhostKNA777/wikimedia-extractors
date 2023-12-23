"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyNFlimExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyNFlimExtractor {
    name = 'Smashy (NF)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/nflim.php';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url, {
                headers: {
                    referer: url,
                },
            });
            const config = JSON.parse(res.data.match(/var\s+config\s*=\s*({.*?});/)[1]);
            const fileUrl = config.file.split(',')[0];
            const vttArray = config.subtitle.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g).map((entry) => {
                const [, name, link] = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
                return { name, link: link.replace(',', '') };
            });
            const fileUrlRes = await axios_1.axiosInstance.head(fileUrl.split(']')[1]);
            if (fileUrlRes.status !== 200)
                return undefined;
            return {
                server: this.name,
                source: {
                    url: fileUrl.split(']')[1],
                },
                type: fileUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
                quality: (0, utils_1.getResolutionName)(parseInt(fileUrl.split(']')[0].split('[')[1], 10)),
                subtitles: vttArray
                    .filter((it) => !it.link.includes('thumbnails'))
                    .map((subtitle) => ({
                    file: subtitle.link,
                    label: subtitle.name,
                    kind: 'captions',
                })),
                thumbnails: {
                    url: vttArray.find((it) => it.link.includes('thumbnails'))?.link,
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
exports.SmashyNFlimExtractor = SmashyNFlimExtractor;
//# sourceMappingURL=nflim.js.map