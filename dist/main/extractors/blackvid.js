"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackvidExtractor = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = require("../utils/axios");
const utils_1 = require("./utils");
class BlackvidExtractor {
    name = 'Blackvid';
    //logger = log.scope(this.name);
    //url = 'https://prod.api.blackvid.space/v3';
    url = 'https://blackvid.space/';
    apiKey = 'b6055c533c19131a638c3d2299d525d5ec08a814';
    decryptionKey = '2378f8e4e844f2dc839ab48f66e00acc2305a401';
    getCurrentUTCDateString() {
        const dateFormat = new Date().toUTCString();
        return dateFormat;
    }
    generateKeyAndIv() {
        const datePart = this.getCurrentUTCDateString().slice(0, 16);
        const hexString = datePart + this.decryptionKey;
        const byteArray = Buffer.from(hexString, 'utf8');
        const digest = crypto_1.default.createHash('sha256').update(byteArray).digest();
        const key = digest.slice(0, digest.length / 2);
        const iv = digest.slice(-(digest.length / 2));
        return { key, iv };
    }
    decrypt(byteArray) {
        const { key, iv } = this.generateKeyAndIv();
        const cipher = crypto_1.default.createCipheriv('aes-128-gcm', key, iv);
        let decrypted = cipher.update(byteArray);
        decrypted = Buffer.concat([decrypted, cipher.final()]);
        return decrypted.slice(0, -16).toString('utf8');
    }
    async extractUrls(tmdbId, type, season, episode) {
        try {
            const url = type === 'movie' ? `${this.url}/movie/sources/${tmdbId}?key=${this.apiKey}` : `${this.url}/tv/sources/${tmdbId}/${season}/${episode}?key=${this.apiKey}`;
            const { data } = await axios_1.axiosInstance.get(url, {
                responseType: 'arraybuffer',
            });
            const decrypted = JSON.parse(this.decrypt(data));
            const subtitles = decrypted.subtitles.map((s) => ({
                file: s.url,
                label: s.language,
                kind: 'captions',
            }));
            const sources = decrypted.sources.map(async (s, index) => {
                const highestQualitySource = s.sources[0];
                // Same url as SuperStream
                if (highestQualitySource.url.includes('shegu'))
                    return null;
                const quality = highestQualitySource?.quality !== 'auto' ? (0, utils_1.getResolution)(highestQualitySource.quality) : await (0, utils_1.getResolutionFromM3u8)(highestQualitySource.url, true);
                return {
                    server: `${this.name} ${index}`,
                    quality,
                    type: highestQualitySource.url.includes('.m3u8') ? 'm3u8' : 'mp4',
                    source: {
                        url: highestQualitySource.url,
                    },
                    subtitles,
                };
            });
            const filteredSources = (await Promise.all(sources)).filter((source) => source !== null);
            return filteredSources;
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return [];
        }
    }
}
exports.BlackvidExtractor = BlackvidExtractor;
//# sourceMappingURL=blackvid.js.map