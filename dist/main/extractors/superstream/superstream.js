"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperStreamExtractor = void 0;
const crypto_1 = __importDefault(require("crypto"));
//import log from 'electron-log';
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
// This code is based on https://github.com/recloudstream/cloudstream-extensions/blob/master/SuperStream/src/main/kotlin/com/lagradost/SuperStream.kt
// Complies with the LGPL-3.0 License see: ./LICENSE and https://github.com/recloudstream/cloudstream-extensions/blob/master/LICENSE
class SuperStreamExtractor {
    //logger = log.scope('SuperStream');
    url = Buffer.from('aHR0cHM6Ly9zaG93Ym94LnNoZWd1Lm5ldC9hcGkvYXBpX2NsaWVudC9pbmRleC8=', 'base64').toString();
    secondUrl = Buffer.from('aHR0cHM6Ly9tYnBhcGkuc2hlZ3UubmV0L2FwaS9hcGlfY2xpZW50L2luZGV4Lw==', 'base64').toString();
    iv = Buffer.from('d0VpcGhUbiE=', 'base64').toString();
    key = Buffer.from('MTIzZDZjZWRmNjI2ZHk1NDIzM2FhMXc2', 'base64').toString();
    appKey = Buffer.from('bW92aWVib3g=', 'base64').toString();
    appid = Buffer.from('Y29tLnRkby5zaG93Ym94', 'base64').toString();
    secondAppid = Buffer.from('Y29tLm1vdmllYm94cHJvLmFuZHJvaWQ=', 'base64').toString();
    version = '11.5';
    versionCode = '160';
    baseData = {
        childmode: '0',
        app_version: this.version,
        appid: this.secondAppid,
        channel: 'Website',
        lang: 'en',
        platform: 'android',
    };
    baseHeaders = {
        platform: 'android',
        Accept: 'charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    getExpireDate() {
        const date = new Date();
        date.setHours(date.getHours() + 12);
        return date.getTime();
    }
    md5(input) {
        const hash = crypto_1.default.createHash('md5').update(input).digest();
        return hash.toString('hex').toLowerCase();
    }
    encryptQuery(query) {
        const cipher = crypto_1.default.createCipheriv('des-ede3-cbc', this.key, this.iv);
        cipher.setAutoPadding(true);
        const encrypted = cipher.update(query, 'utf-8', 'base64') + cipher.final('base64');
        return encrypted;
    }
    getVerify(encryptedQuery) {
        const md5Hash = crypto_1.default.createHash('md5');
        md5Hash.update(this.appKey);
        const hash1 = md5Hash.digest('hex');
        const hash2 = crypto_1.default.createHash('md5');
        hash2.update(hash1 + this.key + encryptedQuery);
        return hash2.digest('hex');
    }
    async executeApiCall(queryData, useSecondaryApi) {
        let apiUrl = this.url;
        if (useSecondaryApi)
            apiUrl = this.secondUrl;
        const encryptedQuery = this.encryptQuery(JSON.stringify({
            ...this.baseData,
            ...queryData,
        }).trim());
        const appKeyHash = this.md5(this.appKey);
        const newBody = {
            app_key: appKeyHash,
            verify: this.getVerify(encryptedQuery),
            encrypt_data: encryptedQuery,
        };
        const base64Body = Buffer.from(JSON.stringify(newBody)).toString('base64');
        const data = {
            data: base64Body,
            appid: '27',
            version: this.versionCode,
            medium: `Website&token${(0, utils_1.randomString)(32)}`,
        };
        const response = await axios_1.axiosInstance.post(apiUrl, data, {
            headers: this.baseHeaders,
        });
        return response.data;
    }
    async extractUrls(searchQuery, type, season, episode) {
        try {
            const searchData = {
                ...this.baseData,
                appid: this.secondAppid,
                module: 'Search4',
                page: '1',
                keyword: searchQuery,
                pagelimit: '1',
                expired_date: this.getExpireDate(),
                type: 'all',
            };
            const searchDataResponse = await this.executeApiCall(searchData, false);
            const superStreamId = searchDataResponse.data.list[0].id;
            const linkData = {
                ...this.baseData,
                uid: '',
                app_version: '11.5',
                appid: this.appid,
                module: type === 'movie' ? 'Movie_downloadurl_v3' : 'TV_downloadurl_v3',
                ...(type === 'movie' ? { mid: superStreamId } : { tid: superStreamId }),
                ...(type === 'tv' && { season, episode }),
                expired_date: this.getExpireDate(),
                oss: '1',
                group: '1',
                type: 'all',
            };
            const linkDataResponse = await this.executeApiCall(linkData, false);
            const link = linkDataResponse.data.list.find((item) => item.path !== '');
            if (!link)
                return [];
            const subtitleData = {
                ...this.baseData,
                uid: '',
                app_version: '11.5',
                appid: this.appid,
                module: type === 'movie' ? 'Movie_srt_list_v2' : 'TV_srt_list_v2',
                ...(type === 'movie' ? { mid: superStreamId } : { tid: superStreamId }),
                ...(type === 'tv' && { season, episode }),
                fid: link.fid,
                expired_date: this.getExpireDate(),
            };
            const subtitleDataResponse = await this.executeApiCall(subtitleData, false);
            return [
                {
                    source: {
                        url: link.path,
                    },
                    server: 'SuperStream',
                    type: 'mp4',
                    quality: link.real_quality,
                    subtitles: subtitleDataResponse.data.list.flatMap((subtitleList) => {
                        const subtitles = subtitleList.subtitles.slice(0, 10);
                        return subtitles.map((superStreamSubtitle) => ({
                            file: superStreamSubtitle.file_path,
                            label: superStreamSubtitle.language,
                            kind: 'captions',
                        }));
                    }),
                },
            ];
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return [];
        }
    }
}
exports.SuperStreamExtractor = SuperStreamExtractor;
//# sourceMappingURL=superstream.js.map