"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedsitoExtractor = void 0;
//import log from 'electron-log';
const axios_1 = require("../utils/axios");
class EmbedsitoExtractor {
    //logger = log.scope('Embedsito');
    url = 'https://embedsito.com/api/source/';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.post(`https://embedsito.com/api/source/${url}`);
            const file = res.data.data[res.data.data.length - 1];
            const redirectUrl = file.file;
            const quality = file.label;
            const fileType = file.type;
            const finalUrl = await axios_1.axiosInstance.get(redirectUrl, {
                maxRedirects: 0,
                validateStatus: (status) => {
                    return status >= 200 && status < 400;
                },
            });
            return {
                server: 'Embedsito',
                source: {
                    url: finalUrl.headers.location,
                },
                type: fileType === 'mp4' ? 'mp4' : 'm3u8',
                quality,
            };
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return undefined;
        }
    }
}
exports.EmbedsitoExtractor = EmbedsitoExtractor;
//# sourceMappingURL=embedsito.js.map