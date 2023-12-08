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
exports.FileMoonExtractor = void 0;
/* eslint-disable max-classes-per-file */
//var electron_log_1 = require("electron-log");
var axios_1 = require("../utils/axios");
var utils_1 = require("./utils");
var FileMoonExtractor = /** @class */ (function () {
    function FileMoonExtractor() {
        //this.logger = electron_log_1.default.scope('FileMoon');
        this.url = 'https://filemoon.sx/';
    }
    FileMoonExtractor.prototype.extractUrl = function (url) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, regex, evalCode, extractSource_1, extractionPromise, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, axios_1.axiosInstance.get(url)];
                    case 1:
                        res = _b.sent();
                        regex = /eval\((.*)\)/g;
                        evalCode = (_a = regex.exec(res.data)) === null || _a === void 0 ? void 0 : _a[0];
                        if (!evalCode)
                            throw new Error('No eval code found');
                        extractSource_1 = function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var quality;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, utils_1.getResolutionFromM3u8)(file, true)];
                                    case 1:
                                        quality = _a.sent();
                                        return [2 /*return*/, {
                                                server: 'FileMoon',
                                                source: {
                                                    url: file,
                                                },
                                                type: file.includes('.m3u8') ? 'm3u8' : 'mp4',
                                                quality: quality,
                                            }];
                                }
                            });
                        }); };
                        extractionPromise = new Promise(function (resolve, reject) {
                            var sandbox = {
                                jwplayer: function () { return ({
                                    setup: function (config) { return __awaiter(_this, void 0, void 0, function () {
                                        var firstSource;
                                        return __generator(this, function (_a) {
                                            if (config.sources && Array.isArray(config.sources)) {
                                                firstSource = config.sources[0];
                                                if (firstSource && firstSource.file) {
                                                    resolve(extractSource_1(firstSource.file));
                                                }
                                                else {
                                                    reject(new Error('No file found'));
                                                }
                                            }
                                            else {
                                                reject(new Error('No sources found'));
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); },
                                    on: function () { },
                                    addButton: function () { },
                                    getButton: function () { },
                                    seek: function () { },
                                    getPosition: function () { },
                                    addEventListener: function () { },
                                    setCurrentCaptions: function () { },
                                    pause: function () { },
                                }); },
                                document: {
                                    addEventListener: function (event, callback) {
                                        if (event === 'DOMContentLoaded') {
                                            callback();
                                        }
                                    },
                                },
                                fetch: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, ({
                                                json: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                    return [2 /*return*/, ({})];
                                                }); }); },
                                            })];
                                    });
                                }); },
                                $: function () { return ({
                                    hide: function () { },
                                    get: function () { },
                                    detach: function () { return ({
                                        insertAfter: function () { },
                                    }); },
                                }); },
                                p2pml: {
                                    hlsjs: {
                                        Engine: /** @class */ (function () {
                                            function Engine() {
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                this.on = function () { };
                                            }
                                            Engine.prototype.createLoaderClass = function () { };
                                            return Engine;
                                        }()),
                                    },
                                },
                            };
                        });
                        return [4 /*yield*/, extractionPromise];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error)
                            console.error(error_1.message);
                        return [2 /*return*/, undefined];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return FileMoonExtractor;
}());
exports.FileMoonExtractor = FileMoonExtractor;
