"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitStreamExtractor = void 0;
//import * as m3u8Parser from 'm3u8-parser';
const crypto_1 = __importDefault(require("crypto"));
//import log from 'electron-log';
const axios_1 = require("../utils/axios");
class RabbitStreamExtractor {
    //logger = log.scope('VidCloud');
    url = 'https://rabbitstream.net/';
    referer = 'https://rabbitstream.net/';
    decryptionKeyUrl = 'https://raw.githubusercontent.com/enimax-anime/key/e4/key.txt';
    md5(input) {
        return crypto_1.default.createHash('md5').update(input).digest();
    }
    generateKey(salt, secret) {
        let key = this.md5(Buffer.concat([secret, salt]));
        let currentKey = key;
        while (currentKey.length < 48) {
            key = this.md5(Buffer.concat([key, secret, salt]));
            currentKey = Buffer.concat([currentKey, key]);
        }
        return currentKey;
    }
    decryptSourceUrl(decryptionKey, sourceUrl) {
        const cipherData = Buffer.from(sourceUrl, 'base64');
        const encrypted = cipherData.slice(16);
        const algorithm = 'aes-256-cbc';
        const iv = decryptionKey.slice(32);
        const decryptionKeyWithoutIv = decryptionKey.slice(0, 32);
        const decipher = crypto_1.default.createDecipheriv(algorithm, decryptionKeyWithoutIv, iv);
        const decryptedData = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decryptedData.toString('utf8');
    }
    decrypt(input, key) {
        const decryptionKey = this.generateKey(Buffer.from(input, 'base64').slice(8, 16), Buffer.from(key, 'utf8'));
        return this.decryptSourceUrl(decryptionKey, input);
    }
    async getDecryptionKey() {
        const res = await axios_1.axiosInstance.get(this.decryptionKeyUrl);
        return res.data;
    }
    async extractSourceUrl(url) {
        const id = url.split('/').pop().split('?')[0];
        const apiUrl = `${this.url}ajax/embed-5/getSources?id=${id}`;
        const res = await axios_1.axiosInstance.get(apiUrl);
        const sources = res.data.sources;
        const subtitles = res.data.tracks;
        const isDecrypted = !sources.includes('https://');
        let source;
        if (isDecrypted) {
            const decryptionKey = await this.getDecryptionKey();
            const decryptedSourceUrl = this.decrypt(sources, decryptionKey);
            const json = JSON.parse(decryptedSourceUrl);
            source = json[0];
        }
        else {
            source = sources[0];
        }
        return {
            sourceUrl: source.file,
            subtitles,
            isHls: source.type === 'hls',
        };
    }
    async extractUrl(url) {
        try {
            const { sourceUrl, subtitles, isHls } = await this.extractSourceUrl(url);
            const m3u8Manifest = await axios_1.axiosInstance.get(sourceUrl);
            /*const parser = new m3u8Parser.Parser();
            parser.push(m3u8Manifest.data);
            parser.end();
      
            const parsedManifest = parser.manifest;
            const highestQuality = parsedManifest.playlists.reduce((prev: any, current: any) => {
              return prev.attributes.BANDWIDTH > current.attributes.BANDWIDTH ? prev : current;
            });*/
            return undefined;
            /*return {
              server: 'VidCloud',
              source: {
                url: sourceUrl,
              },
              type: isHls ? 'm3u8' : 'mp4',
              quality: getResolutionName(highestQuality.attributes.RESOLUTION.height),
              subtitles,
            };*/
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            return undefined;
        }
    }
}
exports.RabbitStreamExtractor = RabbitStreamExtractor;
//# sourceMappingURL=rabbitstream.js.map