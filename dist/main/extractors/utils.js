"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToJSON = exports.resolveRelativePaths = exports.addLeadingZero = exports.getResolution = exports.findHighestResolutionStream = exports.getResolutionFromM3u8 = exports.getResolutionName = exports.randomString = exports.getCaptchaToken = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
//import * as m3u8Parser from 'm3u8-parser';
const getCaptchaToken = async (siteKey, url) => {
    const uri = new URL(url);
    const domain = new TextEncoder().encode(`${uri.protocol}//${uri.hostname}:443`);
    const domainEncoded = Buffer.from(domain).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    let res = await axios_1.default.get(`https://www.google.com/recaptcha/api.js?render=${siteKey}`);
    const vToken = res.data.split('releases/')[1].split('/')[0];
    res = await axios_1.default.get(`https://www.google.com/recaptcha/api2/anchor?ar=1&hl=en&size=invisible&cb=cs3&k=${siteKey}&co=${domainEncoded}&v=${vToken}`);
    const $ = (0, cheerio_1.load)(res.data);
    const recapToken = $('#recaptcha-token').attr('value');
    res = await axios_1.default.post(`https://www.google.com/recaptcha/api2/reload?k=${siteKey}`, {
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
    });
    return JSON.parse(res.data.split('\n')[1])[1];
};
exports.getCaptchaToken = getCaptchaToken;
const randomString = (length) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = length; i > 0; i -= 1)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};
exports.randomString = randomString;
const getResolutionName = (resolution) => {
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
const getResolutionFromM3u8 = async (m3u8, shouldRequest, headers = {}) => {
    try {
        let m3u8Manifest = m3u8;
        if (shouldRequest) {
            const res = await axios_1.default.get(m3u8, {
                headers,
            });
            m3u8Manifest = res.data;
        }
        /*const parser = new m3u8Parser.Parser();
        parser.push(m3u8Manifest);
        parser.end();
    
        const parsedManifest = parser.manifest;*/
        return 'Unknown';
        /*const highestQuality = parsedManifest.playlists.reduce((prev: any, current: any) => {
          return prev.attributes.BANDWIDTH > current.attributes.BANDWIDTH ? prev : current;
        });
        return getResolutionName(highestQuality.attributes.RESOLUTION.height);*/
    }
    catch {
        return 'Unknown';
    }
};
exports.getResolutionFromM3u8 = getResolutionFromM3u8;
const findHighestResolutionStream = (m3u8Content) => {
    const streamEntries = m3u8Content.split('#EXT-X-STREAM-INF').slice(1);
    let highestResolution = '';
    let maxResolution = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const entry of streamEntries) {
        const resolutionMatch = entry.match(/RESOLUTION=(\d+)x(\d+)/);
        if (resolutionMatch) {
            const width = parseInt(resolutionMatch[1], 10);
            const height = parseInt(resolutionMatch[2], 10);
            const resolution = width * height;
            if (resolution > maxResolution) {
                maxResolution = resolution;
                highestResolution = entry.split('\n')[1].trim(); // Get the URL
            }
        }
    }
    return highestResolution;
};
exports.findHighestResolutionStream = findHighestResolutionStream;
const getResolution = (fileName) => {
    const fileNameLower = fileName.toString().toLowerCase();
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
const addLeadingZero = (number) => {
    return number.toString().padStart(2, '0');
};
exports.addLeadingZero = addLeadingZero;
const resolveRelativePaths = (m3u8Content, baseUrl) => {
    return m3u8Content.replace(/^(.*\.jpg)$/gm, `${baseUrl}$1`);
};
exports.resolveRelativePaths = resolveRelativePaths;
const formatToJSON = (str) => {
    return str.replace(/([{,])(\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$3":');
};
exports.formatToJSON = formatToJSON;
//# sourceMappingURL=utils.js.map