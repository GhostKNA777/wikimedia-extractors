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
exports.VidPlayExtractor = void 0;
//var electron_log_1 = require("electron-log");
var axios_1 = require("../utils/axios");
var utils_1 = require("./utils");
var VidPlayExtractor = /** @class */ (function () {
    function VidPlayExtractor() {
        this.name = 'VidPlay';
        //this.logger = electron_log_1.default.scope(this.name);
        this.url = 'https://vidplay.site';
        this.referer = 'https://vidplay.site/';
    }
    VidPlayExtractor.prototype.getKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.axiosInstance.get('https://raw.githubusercontent.com/Claudemirovsky/worstsource-keys/keys/keys.json')];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    /*function encodeId(vId) {
      const response = await fetch('https://raw.githubusercontent.com/Claudemirovsky/worstsource-keys/keys/keys.json');
      const [key1, key2] = await response.json();
      const decodedId = keyPermutation(key1, vId).encode('Latin_1');
      const encodedResult = keyPermutation(key2, decodedId).encode('Latin_1');
      const encodedBase64 = btoa(encodedResult);
  
      return encodedBase64.replace('/', '_');
  }*/
    VidPlayExtractor.prototype.key_Permutation2 = function (key, data) {
        var state = Array.from(Array(256).keys());
        var index_1 = 0;
        for (var i = 0; i < 256; i++) {
            index_1 = ((index_1 + state[i]) + key.charCodeAt(i % key.length)) % 256;
            var temp = state[i];
            state[i] = state[index_1];
            state[index_1] = temp;
        }
        var index_1 = 0;
        var index_2 = 0;
        var final_key = '';
        for (var char = 0; char < data.length; char++) {
            index_1 = (index_1 + 1) % 256;
            index_2 = (index_2 + state[index_1]) % 256;
            var temp = state[index_1];
            state[index_1] = state[index_2];
            state[index_2] = temp;
            if (typeof data[char] === 'string') {
                final_key += String.fromCharCode(data[char].charCodeAt(0) ^ state[(state[index_1] + state[index_2]) % 256]);
            }
            else if (typeof data[char] === 'number') {
                final_key += String.fromCharCode(data[char] ^ state[(state[index_1] + state[index_2]) % 256]);
            }
        }
        return final_key;
    };
    VidPlayExtractor.prototype.getEncodedId = function (sourceUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var id, keyList, decodedId, encodedResult, encodedBase64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = sourceUrl.split('/e/')[1].split('?')[0];
                        return [4 /*yield*/, this.getKeys()];
                    case 1:
                        keyList = _a.sent();
                        decodedId = this.key_Permutation2(keyList[0], id);
                        encodedResult = this.key_Permutation2(keyList[1], decodedId);
                        encodedBase64 = btoa(encodedResult);
                        /*const c1 = createCipheriv('rc4', Buffer.from(keyList[0]), '');
                        const c2 = createCipheriv('rc4', Buffer.from(keyList[1]), '');
                    
                        let input = Buffer.from(id);
                        input = Buffer.concat([c1.update(input), c1.final()]);
                        input = Buffer.concat([c2.update(input), c2.final()]);*/
                        //return input.toString('base64').replace('/', '_');
                        return [2 /*return*/, encodedBase64.replace('/', '_')];
                }
            });
        });
    };
    VidPlayExtractor.prototype.getFuTokenKey = function (sourceUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var id, res, fuKey, a, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEncodedId(sourceUrl)];
                    case 1:
                        id = _a.sent();
                        return [4 /*yield*/, axios_1.axiosInstance.get("".concat(this.url, "/futoken"), {
                                headers: {
                                    referer: /*encodeURIComponent(*/ sourceUrl /*)*/,
                                },
                            })];
                    case 2:
                        res = _a.sent();
                        fuKey = res.data.match(/var\s+k\s*=\s*'([^']+)'/)[1];
                        a = [];
                        for (i = 0; i < id.length; i += 1)
                            a.push(fuKey.charCodeAt(i % fuKey.length) + id.charCodeAt(i));
                        return [2 /*return*/, "".concat(fuKey, ",").concat(a.join(','))];
                }
            });
        });
    };
    VidPlayExtractor.prototype.getFileUrl = function (sourceUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var futoken, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFuTokenKey(sourceUrl)];
                    case 1:
                        futoken = _a.sent();
                        url = "".concat(this.url, "/mediainfo/").concat(futoken, "?").concat(sourceUrl.split('?')[1]);
                        //console.log("Final" + url);
                        return [2 /*return*/, url];
                }
            });
        });
    };
    VidPlayExtractor.prototype.extractUrl = function (url) {
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
                        console.info("src2:" + source);
                        return [4 /*yield*/, (0, utils_1.getResolutionFromM3u8)(source, true)];
                    case 3:
                        quality = _c.sent();
                        thumbnail = (_b = (_a = res.data.result) === null || _a === void 0 ? void 0 : _a.tracks) === null || _b === void 0 ? void 0 : _b.find(function (track) { return track.kind === 'thumbnails'; });
                        return [2 /*return*/, {
                                server: this.name,
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
                            console.log(error_1.message);
                        return [2 /*return*/, undefined];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return VidPlayExtractor;
}());
exports.VidPlayExtractor = VidPlayExtractor;
