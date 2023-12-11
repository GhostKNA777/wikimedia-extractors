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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VidSrcToExtractor = void 0;
var cheerio_1 = require("cheerio");
var axios_1 = require("../utils/axios");
var filemoon_1 = require("./filemoon");
var vidplay_1 = require("./vidplay");
var vidstream_1 = require("./vidstream");
var VidSrcToExtractor = /** @class */ (function () {
    function VidSrcToExtractor() {
        //logger = log.scope('VidSrcTo');
        this.url = 'https://vidsrc.to/embed/';
        this.mainUrl = 'https://vidsrc.to/';
        this.vidStreamExtractor = new vidstream_1.VidstreamExtractor();
        this.fileMoonExtractor = new filemoon_1.FileMoonExtractor();
        this.vidPlayExtractor = new vidplay_1.VidPlayExtractor();
        this.key = '8z5Ag5wgagfsOuhz';
    }
    VidSrcToExtractor.prototype.decodeBase64UrlSafe = function (str) {
        var standardizedInput = str.replace(/_/g, '/').replace(/-/g, '+');
        var binaryData = Buffer.from(standardizedInput, 'base64').toString('binary');
        var bytes = new Uint8Array(binaryData.length);
        for (var i = 0; i < bytes.length; i += 1) {
            bytes[i] = binaryData.charCodeAt(i);
        }
        return bytes;
    };
    VidSrcToExtractor.prototype.decode = function (str) {
        var _a, _b;
        var keyBytes = new TextEncoder().encode(this.key);
        var j = 0;
        var s = new Uint8Array(256);
        for (var i_1 = 0; i_1 < 256; i_1 += 1) {
            s[i_1] = i_1;
        }
        for (var i_2 = 0, k_1 = 0; i_2 < 256; i_2 += 1) {
            j = (j + s[i_2] + keyBytes[k_1 % keyBytes.length]) & 0xff;
            _a = [s[j], s[i_2]], s[i_2] = _a[0], s[j] = _a[1];
            k_1 += 1;
        }
        var decoded = new Uint8Array(str.length);
        var i = 0;
        var k = 0;
        for (var index = 0; index < str.length; index += 1) {
            i = (i + 1) & 0xff;
            k = (k + s[i]) & 0xff;
            _b = [s[k], s[i]], s[i] = _b[0], s[k] = _b[1];
            var t = (s[i] + s[k]) & 0xff;
            decoded[index] = str[index] ^ s[t];
        }
        return decoded;
    };
    VidSrcToExtractor.prototype.decryptSourceUrl = function (sourceUrl) {
        var encoded = this.decodeBase64UrlSafe(sourceUrl);
        var decoded = this.decode(encoded);
        var decodedText = new TextDecoder().decode(decoded);
        return decodeURIComponent(decodeURIComponent(decodedText));
    };
    VidSrcToExtractor.prototype.extractUrlss = function (imdbId, type, season, episode, server) {
        return __awaiter(this, void 0, void 0, function () {
            var sourcesData, mainUrl, res, $, dataId, sources, subtitles_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourcesData = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        console.log("imdbId:" + imdbId);
                        mainUrl = type === 'movie' ? "".concat(this.url, "movie/").concat(imdbId) : "".concat(this.url, "tv/").concat(imdbId, "/").concat(season, "/").concat(episode);
                        return [4 /*yield*/, axios_1.axiosInstance.get(mainUrl)];
                    case 2:
                        res = _a.sent();
                        $ = (0, cheerio_1.load)(res.data);
                        dataId = $('a[data-id]').attr('data-id');
                        return [4 /*yield*/, axios_1.axiosInstance.get("".concat(this.mainUrl, "ajax/embed/episode/").concat(dataId, "/sources"))];
                    case 3:
                        sources = _a.sent();
                        if (sources.data.status !== 200)
                            throw new Error('No sources found');
                        /*const sourceUrlsPromise = sources.data.result.map(async (source: any) => {
                          const encryptedUrl = await axiosInstance.get(`${this.mainUrl}ajax/embed/source/${source.id}`);
                          //console.log(encryptedUrl);
                          const decryptedUrl = this.decryptSourceUrl(encryptedUrl.data.result.url);
                          //console.log("decypt:" +decryptedUrl);
                          if (source.title === 'Vidstream') {
                            const vidStreamUrl = await this.vidStreamExtractor.extractUrl(decryptedUrl);
                            //console.log("vidStreamUrl:"+vidStreamUrl);
                            return vidStreamUrl;
                          }
                          if (source.title === 'Filemoon') {
                            const fileMoonUrl = await this.fileMoonExtractor.extractUrl(decryptedUrl);
                            console.log("FilemoonUrl:"+fileMoonUrl?.source.url);
                            return fileMoonUrl;
                          }
                          if (source.title === 'Vidplay') {
                            const vidPlayUrl = await this.vidPlayExtractor.extractUrl(decryptedUrl);
                            console.log("vidPlayUrl:"+vidPlayUrl?.source.url);
                            return vidPlayUrl;
                          }
                  
                        
                          console.log("START:"+sourceUrlsPromise);
                          return sourceUrlsPromise;
                        });*/
                        sources.data.result.forEach(function (source) { return __awaiter(_this, void 0, void 0, function () {
                            var encryptedUrl, decryptedUrl, vidPlayUrl, filemoon;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log(source.title);
                                        return [4 /*yield*/, axios_1.axiosInstance.get("".concat(this.mainUrl, "ajax/embed/source/").concat(source.id))];
                                    case 1:
                                        encryptedUrl = _a.sent();
                                        decryptedUrl = this.decryptSourceUrl(encryptedUrl.data.result.url);
                                        if (!(source.title === 'Vidplay')) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.vidPlayExtractor.extractUrl(decryptedUrl)];
                                    case 2:
                                        vidPlayUrl = _a.sent();
                                        console.log("vidPlayUrl:" + (vidPlayUrl === null || vidPlayUrl === void 0 ? void 0 : vidPlayUrl.source.url));
                                        sourcesData.push(vidPlayUrl);
                                        _a.label = 3;
                                    case 3:
                                        if (source.title === 'Filemoon') {
                                            filemoon = void 0;
                                            filemoon = {
                                                server: 'Filemoon',
                                                source: {
                                                    url: decryptedUrl,
                                                },
                                                type: 'mp4',
                                                quality: '1080p',
                                                thumbnails: {
                                                    url: "No Found",
                                                },
                                            };
                                            sourcesData.push(filemoon);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, axios_1.axiosInstance.get("".concat(this.mainUrl, "ajax/embed/episode/").concat(dataId, "/subtitles"))];
                    case 4:
                        subtitles_1 = _a.sent();
                        //console.log("sources:"+sourceUrls[0]);
                        //console.log("subtitles:"+subtitles.data);
                        sourcesData.forEach(function (sourceUrl) {
                            sourceUrl.subtitles = subtitles_1.data;
                        });
                        return [2 /*return*/, sourcesData];
                    case 5:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error)
                            console.error(error_1.message);
                        return [2 /*return*/, sourcesData];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return VidSrcToExtractor;
}());
exports.VidSrcToExtractor = VidSrcToExtractor;
