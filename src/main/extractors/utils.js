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
exports.formatToJSON = exports.resolveRelativePaths = exports.addLeadingZero = exports.getResolution = exports.findHighestResolutionStream = exports.getResolutionFromM3u8 = exports.getResolutionName = exports.randomString = exports.getCaptchaToken = void 0;
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
//import * as m3u8Parser from 'm3u8-parser';
var getCaptchaToken = function (siteKey, url) { return __awaiter(void 0, void 0, void 0, function () {
    var uri, domain, domainEncoded, res, vToken, $, recapToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uri = new URL(url);
                domain = new TextEncoder().encode("".concat(uri.protocol, "//").concat(uri.hostname, ":443"));
                domainEncoded = Buffer.from(domain).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                return [4 /*yield*/, axios_1.default.get("https://www.google.com/recaptcha/api.js?render=".concat(siteKey))];
            case 1:
                res = _a.sent();
                vToken = res.data.split('releases/')[1].split('/')[0];
                return [4 /*yield*/, axios_1.default.get("https://www.google.com/recaptcha/api2/anchor?ar=1&hl=en&size=invisible&cb=cs3&k=".concat(siteKey, "&co=").concat(domainEncoded, "&v=").concat(vToken))];
            case 2:
                res = _a.sent();
                $ = (0, cheerio_1.load)(res.data);
                recapToken = $('#recaptcha-token').attr('value');
                return [4 /*yield*/, axios_1.default.post("https://www.google.com/recaptcha/api2/reload?k=".concat(siteKey), {
                        v: vToken,
                        k: siteKey,
                        c: recapToken,
                        co: domainEncoded,
                        sa: '',
                        reason: 'q',
                    }, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })];
            case 3:
                res = _a.sent();
                return [2 /*return*/, JSON.parse(res.data.split('\n')[1])[1]];
        }
    });
}); };
exports.getCaptchaToken = getCaptchaToken;
var randomString = function (length) {
    var chars = '0123456789abcdef';
    var result = '';
    for (var i = length; i > 0; i -= 1)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};
exports.randomString = randomString;
var getResolutionName = function (resolution) {
    switch (resolution) {
        case 2160:
            return '4k';
        case 1440:
            return '1440p';
        case 1080:
            return '1080p';
        case 808:
            return '1080p';
        case 720:
            return '720p';
        case 534:
            return '720p';
        case 480:
            return '480p';
        case 360:
            return '360p';
        default:
            return 'Unknown';
    }
};
exports.getResolutionName = getResolutionName;
var getResolutionFromM3u8 = function (m3u8, shouldRequest, headers) {
    if (headers === void 0) { headers = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var m3u8Manifest, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    m3u8Manifest = m3u8;
                    if (!shouldRequest) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1.default.get(m3u8, {
                            headers: headers,
                        })];
                case 1:
                    res = _b.sent();
                    m3u8Manifest = res.data;
                    _b.label = 2;
                case 2: 
                /*const parser = new m3u8Parser.Parser();
                parser.push(m3u8Manifest);
                parser.end();
            
                const parsedManifest = parser.manifest;*/
                return [2 /*return*/, 'Unknown'];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, 'Unknown'];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getResolutionFromM3u8 = getResolutionFromM3u8;
var findHighestResolutionStream = function (m3u8Content) {
    var streamEntries = m3u8Content.split('#EXT-X-STREAM-INF').slice(1);
    var highestResolution = '';
    var maxResolution = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (var _i = 0, streamEntries_1 = streamEntries; _i < streamEntries_1.length; _i++) {
        var entry = streamEntries_1[_i];
        var resolutionMatch = entry.match(/RESOLUTION=(\d+)x(\d+)/);
        if (resolutionMatch) {
            var width = parseInt(resolutionMatch[1], 10);
            var height = parseInt(resolutionMatch[2], 10);
            var resolution = width * height;
            if (resolution > maxResolution) {
                maxResolution = resolution;
                highestResolution = entry.split('\n')[1].trim(); // Get the URL
            }
        }
    }
    return highestResolution;
};
exports.findHighestResolutionStream = findHighestResolutionStream;
var getResolution = function (fileName) {
    var fileNameLower = fileName.toString().toLowerCase();
    if (fileNameLower.includes('2160p') || fileNameLower.includes('2160') || fileNameLower.includes('4K'))
        return '4k';
    if (fileNameLower.includes('1440p') || fileNameLower.includes('1440'))
        return '1440p';
    if (fileNameLower.includes('1080p') || fileNameLower.includes('1080'))
        return '1080p';
    if (fileNameLower.includes('808p') || fileNameLower.includes('808'))
        return '808p';
    if (fileNameLower.includes('720p') || fileNameLower.includes('720'))
        return '720p';
    if (fileNameLower.includes('480p') || fileNameLower.includes('480'))
        return '480p';
    if (fileNameLower.includes('360p') || fileNameLower.includes('360'))
        return '360p';
    return 'Unknown';
};
exports.getResolution = getResolution;
var addLeadingZero = function (number) {
    return number.toString().padStart(2, '0');
};
exports.addLeadingZero = addLeadingZero;
var resolveRelativePaths = function (m3u8Content, baseUrl) {
    return m3u8Content.replace(/^(.*\.jpg)$/gm, "".concat(baseUrl, "$1"));
};
exports.resolveRelativePaths = resolveRelativePaths;
var formatToJSON = function (str) {
    return str.replace(/([{,])(\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$3":');
};
exports.formatToJSON = formatToJSON;
