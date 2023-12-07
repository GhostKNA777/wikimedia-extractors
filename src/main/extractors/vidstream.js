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
exports.VidstreamExtractor = void 0;
var electron_log_1 = require("electron-log");
var axios_1 = require("../utils/axios");
var utils_1 = require("./utils");
var VidstreamExtractor = /** @class */ (function () {
    function VidstreamExtractor() {
        this.logger = electron_log_1.default.scope('Vidstream');
        this.url = 'https://vidstream.pro/';
        this.referer = 'https://vidstream.pro/';
        this.eltikUrl = 'https://9anime.eltik.net/';
    }
    VidstreamExtractor.prototype.getFuToken = function (referer) {
        return __awaiter(this, void 0, void 0, function () {
            var res, fuTokenWithoutComments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.axiosInstance.get("".concat(this.url, "futoken"), {
                            headers: {
                                referer: encodeURIComponent(referer),
                            },
                        })];
                    case 1:
                        res = _a.sent();
                        fuTokenWithoutComments = res.data.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
                        return [2 /*return*/, fuTokenWithoutComments];
                }
            });
        });
    };
    VidstreamExtractor.prototype.getFileUrl = function (sourceUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var futoken, id, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFuToken(sourceUrl)];
                    case 1:
                        futoken = _a.sent();
                        id = sourceUrl.split('e/')[1].split('?')[0];
                        return [4 /*yield*/, axios_1.axiosInstance.post("".concat(this.eltikUrl, "rawVizcloud?query=").concat(id, "&apikey=lagrapps"), {
                                query: id,
                                futoken: futoken,
                            })];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, "".concat(res.data.rawURL, "?").concat(sourceUrl.split('?')[1])];
                }
            });
        });
    };
    VidstreamExtractor.prototype.extractUrl = function (url) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var fileUrl, res, source, quality, thumbnail, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getFileUrl("".concat(url, "&autostart=true"))];
                    case 1:
                        fileUrl = _c.sent();
                        return [4 /*yield*/, axios_1.axiosInstance.get(fileUrl, {
                                headers: {
                                    referer: url,
                                },
                            })];
                    case 2:
                        res = _c.sent();
                        source = res.data.result.sources[0].file;
                        return [4 /*yield*/, (0, utils_1.getResolutionFromM3u8)(source, true)];
                    case 3:
                        quality = _c.sent();
                        thumbnail = (_b = (_a = res.data.result) === null || _a === void 0 ? void 0 : _a.tracks) === null || _b === void 0 ? void 0 : _b.find(function (track) { return track.kind === 'thumbnails'; });
                        return [2 /*return*/, {
                                server: 'Vidstream',
                                source: {
                                    url: source,
                                },
                                type: 'm3u8',
                                quality: quality,
                                thumbnails: {
                                    url: thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.file,
                                },
                            }];
                    case 4:
                        error_1 = _c.sent();
                        if (error_1 instanceof Error)
                            this.logger.error(error_1.message);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return VidstreamExtractor;
}());
exports.VidstreamExtractor = VidstreamExtractor;
