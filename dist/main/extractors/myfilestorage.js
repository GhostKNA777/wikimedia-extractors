"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyFileStorageExtractor = void 0;
const axios_1 = require("../utils/axios");
const utils_1 = require("./utils");
class MyFileStorageExtractor {
    name = 'MyFileStorage';
    //logger = log.scope('MyFileStorage');
    url = 'https://myfilestorage.xyz';
    referer = 'https://bflix.gs/';
    async extractUrls(tmdbId, type, season, episode) {
        try {
            let url = `${this.url}/${tmdbId}.mp4`;
            if (type === 'tv' && season && episode) {
                url = `${this.url}/tv/${tmdbId}/s${season}e${(0, utils_1.addLeadingZero)(episode)}.mp4`;
            }
            const res = await axios_1.axiosInstance.head(url, {
                validateStatus: () => true,
                headers: {
                    referer: this.referer,
                },
            });
            //this.logger.debug(res.status, res.statusText);
            if (res.status !== 200)
                throw new Error('No sources found');
            return [
                {
                    server: this.name,
                    source: {
                        url,
                    },
                    type: 'mp4',
                    quality: '720p/1080p',
                    proxySettings: {
                        type: 'mp4',
                        referer: this.referer,
                    },
                },
            ];
        }
        catch (e) {
            if (e instanceof Error)
                console.error(e.message);
            return [];
        }
    }
}
exports.MyFileStorageExtractor = MyFileStorageExtractor;
//# sourceMappingURL=myfilestorage.js.map