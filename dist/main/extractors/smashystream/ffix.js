"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmashyFFixExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class SmashyFFixExtractor {
    name = 'Smashy (FFix)';
    //logger = log.scope(this.name);
    url = 'https://embed.smashystream.com/ffix1.php';
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
exports.SmashyFFixExtractor = SmashyFFixExtractor;
//# sourceMappingURL=ffix.js.map