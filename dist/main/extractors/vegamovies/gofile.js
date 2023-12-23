"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoFileExtractor = void 0;
const axios_1 = require("../../utils/axios");
const utils_1 = require("../utils");
class GoFileExtractor {
    name = 'GoFile';
    url = 'https://gofile.io';
    apiUrl = 'https://api.gofile.io';
    //logger = log.scope(this.name);
    async getGoFileWebsiteToken() {
        const res = await axios_1.axiosInstance.get(`${this.url}/dist/js/alljs.js`);
        const regex = /fetchData.websiteToken\s*=\s*"([^']+)"/;
        const websiteToken = res.data.match(regex)[1];
        return websiteToken;
    }
    async getGoFileAccountToken() {
        const res = await axios_1.axiosInstance.get(`${this.apiUrl}/createAccount`);
        if (res.data.status === 'ok') {
            return res.data.data.token;
        }
    }
    async extractUrl(url) {
        try {
            const linkData = await axios_1.axiosInstance.get(url);
            const contentId = linkData.request.res.responseUrl.split('/d')[1];
            const websiteToken = await this.getGoFileWebsiteToken();
            const accountToken = await this.getGoFileAccountToken();
            const goFileDownloadLink = await axios_1.axiosInstance.get(`${this.apiUrl}/getContent?contentId=${contentId}&token=${websiteToken}&websiteToken=${accountToken}`);
            if (goFileDownloadLink.data.status === 'ok') {
                return {
                    server: 'VegaMovies',
                    source: {
                        url: `${goFileDownloadLink.data.data.contents[goFileDownloadLink.data.data.childs[0]].link}?accountToken=${accountToken}`,
                    },
                    type: 'mp4',
                    proxySettings: {
                        type: 'mp4',
                    },
                    quality: (0, utils_1.getResolution)(goFileDownloadLink.data.data.contents[goFileDownloadLink.data.data.childs[0]].name),
                    isVlc: true,
                };
            }
        }
        catch (err) {
            if (err instanceof Error)
                console.error(err.message);
            return undefined;
        }
    }
}
exports.GoFileExtractor = GoFileExtractor;
//# sourceMappingURL=gofile.js.map