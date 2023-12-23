"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAioTechnical = void 0;
const axios_1 = require("../../utils/axios");
const pen = (string) => {
    return string.replace(/[a-zA-Z]/g, (str) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-return-assign, no-cond-assign, no-param-reassign
        return String.fromCharCode((str <= 'Z' ? 0x5a : 0x7a) >= (str = str.charCodeAt(0x0) + 0xd) ? str : str - 0x1a);
    });
};
const getCookies = (data) => {
    const c = [];
    const ckRegExp = /ck\('([^']*)','([^']*)',([0-9.]+)\);/g;
    for (const match of data.matchAll(ckRegExp)) {
        const cookieName = match[1];
        const cookieValue = match[2];
        if (cookieName !== '_wp_http') {
            c.push(cookieValue);
        }
    }
    return c.join('');
};
const extractAioTechnical = async (data) => {
    const cookies = getCookies(data);
    const parsed = Buffer.from(Buffer.from(cookies, 'base64').toString(), 'base64').toString();
    const decoded = pen(parsed);
    console.log(Buffer.from(decoded, 'base64').toString());
    const redirectData = JSON.parse(Buffer.from(decoded, 'base64').toString());
    const res = await axios_1.axiosInstance.get(`${redirectData.blog_url}?re=${redirectData.data}`, {
        headers: {
            cookie: '_wp_http=null',
        },
    });
    if (res.data.includes('Invalid Request'))
        throw new Error('Failed to get aiotechnical link, redirect error');
    return res.request.res.responseUrl;
};
exports.extractAioTechnical = extractAioTechnical;
//# sourceMappingURL=aiotechnical.js.map