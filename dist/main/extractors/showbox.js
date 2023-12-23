"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowBoxExtractor = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = require("../utils/axios");
const utils_1 = require("./utils");
class ShowBoxExtractor {
    name = 'ShowBox';
    //logger = log.scope(this.name);
    //url = 'https://showbox.media/';
    url = 'https://www.showbox.media/';
    referer = 'https://showbox.media/';
    async extractFebBox(url, contentType, season, episode) {
        const shareKey = url.split('share/')[1];
        const streams = await axios_1.axiosInstance.get(`https://febbox.com/file/file_share_list?share_key=${shareKey}&pwd=''`);
        let showData = streams.data.data.file_list.reduce((prev, curr) => (prev.file_size > curr.file_size ? prev : curr));
        if (contentType === 'tv' && season && episode) {
            const seasonFid = streams.data.data.file_list.find((file) => file.file_name.includes(`season ${season}`))?.fid;
            const fileShareListResponse = await axios_1.axiosInstance.get(`https://febbox.com/file/file_share_list?share_key=${shareKey}&pwd=''&parent_id=${seasonFid}`);
            showData = fileShareListResponse.data.data.file_list.find((file) => file.file_name.includes(`e${(0, utils_1.addLeadingZero)(episode)}`) || file.file_name.includes(`episode ${episode}`));
        }
        const playerResponse = await axios_1.axiosInstance.post('https://www.febbox.com/file/player', `fid=${showData.fid}&share_key=${shareKey}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        });
        const subtitleRegex = /var\s+srt\s+=\s+(\[[^\]]*\])/;
        const subtitles = JSON.parse(playerResponse.data.match(subtitleRegex)[1]);
        const qualityMap = ['4k', '1080p%252B'];
        for (const quality of qualityMap) {
            const streamUrl = `https://febbox.com/hls/main/${showData.oss_fid}.m3u8?q=${quality}`;
            // eslint-disable-next-line no-await-in-loop
            const m3u8Response = await axios_1.axiosInstance.get(streamUrl);
            if (m3u8Response.data) {
                return {
                    url: streamUrl,
                    subtitles: subtitles.map((subtitle) => ({
                        file: subtitle.file,
                        kind: subtitle.kind,
                        label: subtitle.label,
                    })),
                };
            }
        }
    }
    async extractUrls(showName, contentType, season, episode) {
        try {
            const searchResult = await axios_1.axiosInstance.get(`${this.url}/search?keyword=${encodeURIComponent(showName)}`);
            const searchResult$ = (0, cheerio_1.load)(searchResult.data);
            const showLink = searchResult$('.film-name a').attr('href');
            console.log("showLink", showLink);
            const showId = showLink?.split('/')[3];
            console.log("showId", showId);
            const febBoxResult = await axios_1.axiosInstance.get(`${this.url}/index/share_link?id=${showId}&type=${contentType === 'movie' ? '1' : '2'}`);
            if (febBoxResult.data.msg === 'success') {
                const febBoxData = await this.extractFebBox(febBoxResult.data.data.link, contentType, season, episode);
                console.log(febBoxData);
                if (!febBoxData)
                    return [];
                const quality = await (0, utils_1.getResolutionFromM3u8)(febBoxData.url, true, {
                    referer: this.referer,
                });
                //if (quality === 'Unknown') throw new Error('No quality found, so the stream is probably invalid');
                if (quality === 'Unknown') {
                    quality == "Unknown";
                }
                console.log(febBoxData);
                return [
                    {
                        server: this.name,
                        source: {
                            url: febBoxData.url,
                        },
                        quality,
                        type: 'm3u8',
                        subtitles: febBoxData.subtitles,
                    },
                ];
            }
            return [];
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return [];
        }
    }
}
exports.ShowBoxExtractor = ShowBoxExtractor;
//# sourceMappingURL=showbox.js.map