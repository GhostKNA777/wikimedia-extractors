"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var cheerio_1 = require("cheerio");
//import log from 'electron-log';
//import fs from 'fs';
var axios_1 = require("../utils/axios");
var VidSrcExtractor = /** @class */ (function () {
    function VidSrcExtractor() {
        //logger = log.scope('VidSrc');
        this.url = 'https://vidsrc.me/';
        this.referer = 'https://vidsrc.stream/';
        this.origin = 'https://vidsrc.stream';
        this.embedUrl = this.url + "embed/";
        this.subtitleUrl = 'https://rest.opensubtitles.org/search/imdbid-';
    }
    VidSrcExtractor.prototype.getHashBasedOnIndex = function (hash, index) {
        var result = '';
        for (var i = 0; i < hash.length; i += 2) {
            var j = hash.substring(i, i + 2);
            result += String.fromCharCode(parseInt(j, 16) ^ index.charCodeAt((i / 2) % index.length));
        }
        return result;
    };
    VidSrcExtractor.prototype.extractUrls = function (imdbId, type, season, episode) {
        return __awaiter(this, void 0, Promise, function () {
            var url, res, $, activeSourceUrl, srcRcpRes, srcRcpRes$, id, hash, sourceUrl, script, match, finalUrl, subtitleData, reducedSubtitles, finalSubtitles, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        url = type === 'movie' ? this.embedUrl + "movie?imdb=" + imdbId : this.embedUrl + "tv?imdb=" + imdbId + "&season=" + season + "&episode=" + episode;
                        return [4 /*yield*/, axios_1.axiosInstance.get(url)];
                    case 1:
                        res = _a.sent();
                        $ = cheerio_1.load(res.data);
                        activeSourceUrl = "https:" + $('#player_iframe').attr('src');
                        return [4 /*yield*/, axios_1.axiosInstance.get(activeSourceUrl, {
                                headers: {
                                    referer: url
                                }
                            })];
                    case 2:
                        srcRcpRes = _a.sent();
                        srcRcpRes$ = cheerio_1.load(srcRcpRes.data);
                        id = srcRcpRes$('body').attr('data-i');
                        hash = srcRcpRes$('#hidden').attr('data-h');
                        if (!id || !hash)
                            throw new Error('No id or hash found');
                        sourceUrl = this.getHashBasedOnIndex(hash, id);
                        return [4 /*yield*/, axios_1.axiosInstance.get("https:" + sourceUrl, {
                                headers: {
                                    referer: url
                                }
                            })];
                    case 3:
                        script = _a.sent();
                        match = script.data
                            .match(/file:"(.*?)"/)[1]
                            .replace(/(\/\/\S+?=)/g, '')
                            .replace('#2', '');
                        finalUrl = Buffer.from(match, 'base64').toString();
                        //this.logger.debug(finalUrl);
                        if (!finalUrl.includes('list.m3u8'))
                            throw new Error('Something went wrong during url decoding');
                        return [4 /*yield*/, axios_1.axiosInstance.get("" + this.subtitleUrl + imdbId + "/sublanguageid-spa", {
                                headers: {
                                    'X-User-Agent': 'trailers.to-UA'
                                }
                            })];
                    case 4:
                        subtitleData = _a.sent();
                        reducedSubtitles = subtitleData.data.reduce(function (accumulator, subtitle) {
                            var languageName = subtitle.LanguageName;
                            accumulator[languageName] = accumulator[languageName] || [];
                            if (accumulator[languageName].length < 5) {
                                accumulator[languageName].push({
                                    url: subtitle.SubDownloadLink,
                                    lang: subtitle.LanguageName
                                });
                            }
                            return accumulator;
                        }, {});
                        finalSubtitles = Object.values(reducedSubtitles).flat();
                        return [2 /*return*/, [
                                {
                                    server: 'VidSrc Pro',
                                    source: {
                                        url: finalUrl
                                    },
                                    type: 'm3u8',
                                    quality: 'Unknown',
                                    subtitles: finalSubtitles
                                },
                            ]];
                    case 5:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error)
                            console.error(error_1.message);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return VidSrcExtractor;
}());
exports["default"] = VidSrcExtractor;
