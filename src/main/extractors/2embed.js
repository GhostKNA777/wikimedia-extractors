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
exports.TwoEmbedExtractor = void 0;
var cheerio_1 = require("cheerio");
var electron_log_1 = require("electron-log");
var axios_1 = require("../utils/axios");
var utils_1 = require("./utils");
var TwoEmbedExtractor = /** @class */ (function () {
    function TwoEmbedExtractor() {
        this.name = '2Embed';
        this.logger = electron_log_1.default.scope(this.name);
        this.url = 'https://www.2embed.cc/';
        this.referer = 'https://www.2embed.cc/';
    }
    TwoEmbedExtractor.prototype.extractUrls = function (imdbId, type, season, episode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var url, res, $, iframeUrl, id, sources, tracks, quality, thumbnails, thumbnailContent, subtitles, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        url = 
                        // eslint-disable-next-line no-nested-ternary
                        type === 'movie' ? "".concat(this.url, "embed/").concat(imdbId) : type === 'tv' ? "".concat(this.url, "embedtv").concat(imdbId, "&s=").concat(season, "&e=").concat(episode, "/") : '';
                        return [4 /*yield*/, axios_1.axiosInstance.get(url)];
                    case 1:
                        res = _b.sent();
                        $ = (0, cheerio_1.load)(res.data);
                        iframeUrl = $('iframe').attr('data-src');
                        id = (_a = iframeUrl === null || iframeUrl === void 0 ? void 0 : iframeUrl.match(/\?id=(.*?)&/)) === null || _a === void 0 ? void 0 : _a[1];
                        if (!id)
                            throw new Error('No id found');
                        return [4 /*yield*/, axios_1.axiosInstance.get("https://wishfast.top/e/".concat(id), {
                                headers: {
                                    referer: this.referer,
                                },
                            })];
                    case 2:
                        res = _b.sent();
                        this.logger.debug((0, utils_1.formatToJSON)(res.data.match(/sources:\s*(\[.*?\])/)[1]), (0, utils_1.formatToJSON)(res.data.match(/tracks:\s*(\[.*?\])/)[1]));
                        sources = JSON.parse((0, utils_1.formatToJSON)(res.data.match(/sources:\s*(\[.*?\])/)[1]));
                        tracks = JSON.parse((0, utils_1.formatToJSON)(res.data.match(/tracks:\s*(\[.*?\])/)[1]));
                        return [4 /*yield*/, (0, utils_1.getResolutionFromM3u8)(sources[0].file, true)];
                    case 3:
                        quality = _b.sent();
                        thumbnails = tracks.find(function (t) { return t.kind === 'thumbnails'; }).file;
                        if (thumbnails) {
                            thumbnails = "https://wishfast.top".concat(thumbnails);
                        }
                        return [4 /*yield*/, axios_1.axiosInstance.get(thumbnails, {
                                headers: {
                                    referer: 'https://wishfast.top/',
                                },
                            })];
                    case 4:
                        thumbnailContent = _b.sent();
                        subtitles = tracks
                            .filter(function (t) { return t.kind === 'captions'; })
                            .map(function (subtitle) { return ({
                            file: subtitle.file,
                            label: subtitle.label,
                            kind: 'captions',
                        }); });
                        return [2 /*return*/, [
                                {
                                    server: this.name,
                                    quality: quality,
                                    source: {
                                        url: sources[0].file,
                                    },
                                    type: 'm3u8',
                                    thumbnails: {
                                        url: thumbnailContent.data,
                                        requiresBlob: true,
                                    },
                                    subtitles: subtitles,
                                },
                            ]];
                    case 5:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error)
                            this.logger.error(error_1.message);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return TwoEmbedExtractor;
}());
exports.TwoEmbedExtractor = TwoEmbedExtractor;
