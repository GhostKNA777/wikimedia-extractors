"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VidSrcToExtractor = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = require("../utils/axios");
const filemoon_1 = require("./filemoon");
const vidplay_1 = require("./vidplay");
const vidstream_1 = require("./vidstream");
class VidSrcToExtractor {
    //logger = log.scope('VidSrcTo');
    url = 'https://vidsrc.to/embed/';
    mainUrl = 'https://vidsrc.to/';
    vidStreamExtractor = new vidstream_1.VidstreamExtractor();
    fileMoonExtractor = new filemoon_1.FileMoonExtractor();
    vidPlayExtractor = new vidplay_1.VidPlayExtractor();
    key = '8z5Ag5wgagfsOuhz';
    decodeBase64UrlSafe(str) {
        const standardizedInput = str.replace(/_/g, '/').replace(/-/g, '+');
        const binaryData = Buffer.from(standardizedInput, 'base64').toString('binary');
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < bytes.length; i += 1) {
            bytes[i] = binaryData.charCodeAt(i);
        }
        return bytes;
    }
    decode(str) {
        const keyBytes = new TextEncoder().encode(this.key);
        let j = 0;
        const s = new Uint8Array(256);
        for (let i = 0; i < 256; i += 1) {
            s[i] = i;
        }
        for (let i = 0, k = 0; i < 256; i += 1) {
            j = (j + s[i] + keyBytes[k % keyBytes.length]) & 0xff;
            [s[i], s[j]] = [s[j], s[i]];
            k += 1;
        }
        const decoded = new Uint8Array(str.length);
        let i = 0;
        let k = 0;
        for (let index = 0; index < str.length; index += 1) {
            i = (i + 1) & 0xff;
            k = (k + s[i]) & 0xff;
            [s[i], s[k]] = [s[k], s[i]];
            const t = (s[i] + s[k]) & 0xff;
            decoded[index] = str[index] ^ s[t];
        }
        return decoded;
    }
    decryptSourceUrl(sourceUrl) {
        const encoded = this.decodeBase64UrlSafe(sourceUrl);
        const decoded = this.decode(encoded);
        const decodedText = new TextDecoder().decode(decoded);
        return decodeURIComponent(decodeURIComponent(decodedText));
    }
    async extractUrls(imdbId, type, season, episode) {
        try {
            const mainUrl = type === 'movie' ? `${this.url}movie/${imdbId}` : `${this.url}tv/${imdbId}/${season}/${episode}`;
            const res = await axios_1.axiosInstance.get(mainUrl);
            const $ = (0, cheerio_1.load)(res.data);
            const dataId = $('a[data-id]').attr('data-id');
            console.log(dataId);
            const sources = await axios_1.axiosInstance.get(`${this.mainUrl}ajax/embed/episode/${dataId}/sources`);
            if (sources.data.status !== 200)
                throw new Error('No sources found');
            const sourceUrlsPromise = sources.data.result.map(async (source) => {
                const encryptedUrl = await axios_1.axiosInstance.get(`${this.mainUrl}ajax/embed/source/${source.id}`);
                //console.log(encryptedUrl);
                const decryptedUrl = this.decryptSourceUrl(encryptedUrl.data.result.url);
                console.log("decypt:" + decryptedUrl);
                /* if (source.title === 'Vidstream') {
                   const vidStreamUrl = await this.vidStreamExtractor.extractUrl(decryptedUrl);
                   console.log("vidStreamUrl:"+vidStreamUrl);
                   //return vidStreamUrl;
                 }
                 if (source.title === 'Filemoon') {
                   const fileMoonUrl = await this.fileMoonExtractor.extractUrl(decryptedUrl);
                   console.log("Filemoon:"+fileMoonUrl?.source.url);
                 //  return fileMoonUrl;
                 }*/
                if (source.title === 'Vidplay') {
                    const vidPlayUrl = await this.vidPlayExtractor.extractUrl(decryptedUrl);
                    console.log("vidPlayUrl:" + vidPlayUrl?.source.url);
                    return vidPlayUrl;
                }
                return undefined;
            });
            const sourceUrls = (await Promise.all(sourceUrlsPromise)).filter((it) => it !== undefined);
            const subtitles = await axios_1.axiosInstance.get(`${this.mainUrl}ajax/embed/episode/${dataId}/subtitles`);
            console.log("sources:" + sourceUrls[0]);
            console.log("subtitles:" + subtitles.data);
            // Modificar cada objeto en el array subtitles.data
            subtitles.data.forEach((subtitle) => {
                // Cambiar el nombre de la propiedad label a url
                subtitle.url = subtitle.file;
                //subtitle.label = subtitle.lang;
                // Eliminar la propiedad kind
                //delete subtitle.kind;
                // Puedes eliminar la propiedad label si no la necesitas más
                //delete subtitle.label;
            });
            // Puedes imprimir el array modificado si lo deseas
            console.log("subtitles (modified):", subtitles.data);
            // Asignar el array modificado a la propiedad subtitles de cada sourceUrl
            sourceUrls.forEach((sourceUrl) => {
                sourceUrl.subtitles = subtitles.data;
            });
            return sourceUrls;
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return [];
        }
    }
}
exports.VidSrcToExtractor = VidSrcToExtractor;
//# sourceMappingURL=vidsrcto.js.map