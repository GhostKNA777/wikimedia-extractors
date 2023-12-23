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
exports.ShowBoxExtractor = void 0;
var cheerio_1 = require("cheerio");
var axios_1 = require("../utils/axios");
var utils_1 = require("./utils");
var ShowBoxExtractor = /** @class */ (function () {
    function ShowBoxExtractor() {
        this.name = 'ShowBox';
        //logger = log.scope(this.name);
        //url = 'https://showbox.media/';
        this.url = 'https://www.showbox.media/';
        this.referer = 'https://showbox.media/';
    }
    ShowBoxExtractor.prototype.extractFebBox = function (url, contentType, season, episode) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var shareKey, streams, showData, seasonFid, fileShareListResponse, playerResponse, subtitleRegex, subtitles, qualityMap, _i, qualityMap_1, quality, streamUrl, m3u8Response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        shareKey = url.split('share/')[1];
                        return [4 /*yield*/, axios_1.axiosInstance.get("https://febbox.com/file/file_share_list?share_key=".concat(shareKey, "&pwd=''"))];
                    case 1:
                        streams = _b.sent();
                        showData = streams.data.data.file_list.reduce(function (prev, curr) { return (prev.file_size > curr.file_size ? prev : curr); });
                        if (!(contentType === 'tv' && season && episode)) return [3 /*break*/, 3];
                        seasonFid = (_a = streams.data.data.file_list.find(function (file) { return file.file_name.includes("season ".concat(season)); })) === null || _a === void 0 ? void 0 : _a.fid;
                        return [4 /*yield*/, axios_1.axiosInstance.get("https://febbox.com/file/file_share_list?share_key=".concat(shareKey, "&pwd=''&parent_id=").concat(seasonFid))];
                    case 2:
                        fileShareListResponse = _b.sent();
                        showData = fileShareListResponse.data.data.file_list.find(function (file) { return file.file_name.includes("e".concat((0, utils_1.addLeadingZero)(episode))) || file.file_name.includes("episode ".concat(episode)); });
                        _b.label = 3;
                    case 3: return [4 /*yield*/, axios_1.axiosInstance.post('https://www.febbox.com/file/player', "fid=".concat(showData.fid, "&share_key=").concat(shareKey), {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            },
                        })];
                    case 4:
                        playerResponse = _b.sent();
                        subtitleRegex = /var\s+srt\s+=\s+(\[[^\]]*\])/;
                        subtitles = JSON.parse(playerResponse.data.match(subtitleRegex)[1]);
                        qualityMap = ['4k', '1080p%252B'];
                        _i = 0, qualityMap_1 = qualityMap;
                        _b.label = 5;
                    case 5:
                        if (!(_i < qualityMap_1.length)) return [3 /*break*/, 8];
                        quality = qualityMap_1[_i];
                        streamUrl = "https://febbox.com/hls/main/".concat(showData.oss_fid, ".m3u8?q=").concat(quality);
                        return [4 /*yield*/, axios_1.axiosInstance.get(streamUrl)];
                    case 6:
                        m3u8Response = _b.sent();
                        if (m3u8Response.data) {
                            return [2 /*return*/, {
                                    url: streamUrl,
                                    subtitles: subtitles.map(function (subtitle) { return ({
                                        file: subtitle.file,
                                        kind: subtitle.kind,
                                        label: subtitle.label,
                                    }); }),
                                }];
                        }
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ShowBoxExtractor.prototype.extractUrls = function (showName, contentType, season, episode) {
        return __awaiter(this, void 0, void 0, function () {
            var searchResult, searchResult$, showLink, showId, febBoxResult, febBoxData, quality, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, axios_1.axiosInstance.get("".concat(this.url, "/search?keyword=").concat(encodeURIComponent(showName)))];
                    case 1:
                        searchResult = _a.sent();
                        searchResult$ = (0, cheerio_1.load)(searchResult.data);
                        showLink = searchResult$('.film-name a').attr('href');
                        console.log("showLink", showLink);
                        showId = showLink === null || showLink === void 0 ? void 0 : showLink.split('/')[3];
                        console.log("showId", showId);
                        return [4 /*yield*/, axios_1.axiosInstance.get("".concat(this.url, "/index/share_link?id=").concat(showId, "&type=").concat(contentType === 'movie' ? '1' : '2'))];
                    case 2:
                        febBoxResult = _a.sent();
                        if (!(febBoxResult.data.msg === 'success')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.extractFebBox(febBoxResult.data.data.link, contentType, season, episode)];
                    case 3:
                        febBoxData = _a.sent();
                        console.log(febBoxData);
                        if (!febBoxData)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, utils_1.getResolutionFromM3u8)(febBoxData.url, true, {
                                referer: this.referer,
                            })];
                    case 4:
                        quality = _a.sent();
                        //if (quality === 'Unknown') throw new Error('No quality found, so the stream is probably invalid');
                        if (quality === 'Unknown') {
                            quality == "Unknown";
                        }
                        console.log(febBoxData);
                        return [2 /*return*/, [
                                {
                                    server: this.name,
                                    source: {
                                        url: febBoxData.url,
                                    },
                                    quality: quality,
                                    type: 'm3u8',
                                    subtitles: febBoxData.subtitles,
                                },
                            ]];
                    case 5: return [2 /*return*/, []];
                    case 6:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error)
                            console.error(error_1.message);
                        return [2 /*return*/, []];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return ShowBoxExtractor;
}());
exports.ShowBoxExtractor = ShowBoxExtractor;
