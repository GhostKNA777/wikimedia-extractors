/* rappidcloud.js
 * @Phantom_KNA
 */
const axiosInstance = require("axios");
const cheerio = require("cheerio");
const CryptoJS = require("crypto-js");
//const FileMoonExtractor = require("../class/extractor/filemoon.ts");

//import { FileMoonExtractor } from '../class/extractor/filemoon';
//import { VidPlayExtractor } from '../class/extractor/vidplay';
//import { VidstreamExtractor } from '../class/extractor/vidstream';

module.exports = async (req, res) => {

    async function rabbit_stream(embed_id, referer) {


        const encrypted_res = await axiosInstance.get(`https://megacloud.tv/embed-1/ajax/e-1/getSources?id=${embed_id}`, {
            headers: {
                "Miru-Url": `https://megacloud.tv/embed-2/ajax/e-1/getSources?id=${embed_id}`,
                "X-Requested-With": "XMLHttpRequest",
                "Referer": `https://megacloud.tv/embed-2/e-1/${embed_id}?k=1`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
            }
        });


        console.log(encrypted_res.data);
        const encrypted_res_data = JSON.parse(JSON.stringify(encrypted_res.data));
        //console.log(encrypted_res_data);

        encrypted_res_data.tracks.forEach(element => {
            if (element.label) {
                /*this.subs.push({
                    title: element.label,
                    url: element.file
                })*/
            }
        });
        if (encrypted_res_data.encrypted) {
            //console.log("encrypted_res_data:" + encrypted_res_data.sources)
            const fileUrl = 'https://megacloud.tv/js/player/m/prod/e1-player.min.js?v=1702269662';
            const { data } = await axiosInstance.default.get(fileUrl);
            const pairs = getPairs(data);
            console.log(pairs);
            //const decryptKey = await start(encrypted_res_data.sources);
            //console.log("key:" + decryptKey)
            //console.log("key:" + key[1])
            const sourcesArray = encrypted_res_data.sources.split('');
            let extractedKey = '';
            let currentIndex = 0;
            for (const index of pairs) {
                let start = index[0] + currentIndex;
                let end = start + index[1];
                for (let i = start; i < end; i++) {
                    extractedKey += encrypted_res_data.sources[i];
                    sourcesArray[i] = '';
                }
                currentIndex += index[1];
            }
            key = extractedKey;
            encrypted_res_data.sources = sourcesArray.join('');
            console.log(encrypted_res_data.sources);
            var decryptedVal = JSON.parse(CryptoJS.AES.decrypt(encrypted_res_data.sources, key).toString(CryptoJS.enc.Utf8));
            console.log(decryptedVal);
            //var decryptedVal = CryptoJS.AES.decrypt(key[1], key[0]).toString(CryptoJS.enc.Utf8);
        }
        else {
            decryptedVal = JSON.stringify(encrypted_res_data.sources[0])
        }
        //const m3u8_link = decryptedVal.match(/https:\/\/.+m3u8/)[0]
        return decryptedVal
    }
    async function get_server(url) {
        const ep_id = url.match(/ep=(\d+)/)[1]
        const res = await this.request(`/ajax/v2/episode/servers?episodeId=${ep_id}`, {
        });
        const res_html = JSON.parse(JSON.stringify(res)).html
        const playlist = res_html.match(/<div class="item server-item"[\s\S]+?<\/div>/g)
        const episode_res_html = JSON.parse(JSON.stringify(res)).html;
        const sub_dub = (episode_res_html.includes("sub") ? ["sub"] : []).concat(episode_res_html.includes("dub") ? ['dub'] : []);
        const available_servers = (episode_res_html.includes("Vidstreaming") ? ['Vidstreaming'] : []).concat(episode_res_html.includes("MegaCloud") ? ['MegaCloud'] : []);
        return [sub_dub, available_servers]
    }
    async function get_key(cipher) {
        const res = await axiosInstance.get("https://megacloud.tv/js/player/a/prod/e1-player.min.js");/*, {
            headers: {
                "Miru-Url": "https://megacloud.tv/js/player/a/prod/e1-player.min.js?v=1699711377",
            }*/

        const filt = res.data.match(/case 0x\d{1,2}:\w{1,2}=\w{1,2},\w{1,2}=\w{1,2}/g).map(element => {
            return element.match(/=(\w{1,2})/g).map(element => {
                return element.substring(1)
            })
        })
        const filt_area = res.data.match(/\w{1,2}=0x\w{1,2},\w{1,2}=0x\w{1,2},\w{1,2}=0x\w{1,2},\w{1,2}=0x\w{1,2},.+?;/)[0]
        const objectFromVars = filt_area.split(",").reduce((acc, pair) => {
            const [key, value] = pair.split("=");
            acc[key] = parseInt(value);
            return acc;
        }, {});
        const P = filt.length
        let C = cipher
        let I = ''
            , C9 = C
            , CC = 0x0;

        for (let CW = 0x0; CW < P; CW++) {
            let CR, CJ;
            switch (CW) {
                case 0x0:
                    CR = objectFromVars[filt[0][0]],
                        CJ = objectFromVars[filt[0][1]];
                    break;
                case 0x1:
                    CR = objectFromVars[filt[1][0]],
                        CJ = objectFromVars[filt[1][1]];
                    break;
                case 0x2:
                    CR = objectFromVars[filt[2][0]],
                        CJ = objectFromVars[filt[2][1]];
                    break;
                case 0x3:
                    CR = objectFromVars[filt[3][0]],
                        CJ = objectFromVars[filt[3][1]];
                    break;
                case 0x4:
                    CR = objectFromVars[filt[4][0]],
                        CJ = objectFromVars[filt[4][1]];
                    break;
                case 0x5:
                    CR = objectFromVars[filt[5][0]],
                        CJ = objectFromVars[filt[5][1]];
                    break;
                case 0x6:
                    CR = objectFromVars[filt[6][0]],
                        CJ = objectFromVars[filt[6][1]];
                    break;
                case 0x7:
                    CR = objectFromVars[filt[7][0]],
                        CJ = objectFromVars[filt[7][1]];
                    break;
                case 0x8:
                    CR = objectFromVars[filt[8][0]],
                        CJ = objectFromVars[filt[8][1]];
            }
            var CI = CR + CC
                , CN = CI + CJ;
            I += C.slice(CI, CN),
                C9 = C9.replace(C.substring(CI, CN), ''),
                CC += CJ;
        }
        return [I, C9]

    }


    const getPairs = (scriptText) => {
        const script = scriptText.toString();
        const startOfSwitch = script.lastIndexOf('switch');
        const endOfCases = script.indexOf('partKeyStartPosition');
        const switchBody = script.slice(startOfSwitch, endOfCases);
        const matches = switchBody.matchAll(/:[a-zA-Z0-9]+=([a-zA-Z0-9]+),[a-zA-Z0-9]+=([a-zA-Z0-9]+);/g);
        const nums = [];
        for (const match of matches) {
            const innerNumbers = [];
            for (const varMatch of [match[1], match[2]]) {
                const regex = new RegExp(`${varMatch}=0x([a-zA-Z0-9]+)`, 'g');
                const varMatches = [...script.matchAll(regex)];
                const lastMatch = varMatches[varMatches.length - 1];
                if (!lastMatch) return null;
                const number = parseInt(lastMatch[1], 16);
                innerNumbers.push(number);
            }

            nums.push([innerNumbers[0], innerNumbers[1]]);
        }

        return nums;
    }

    const getPairss = (scriptText) => {
        const script = scriptText.toString();
        const startOfSwitch = script.lastIndexOf('switch');
        const endOfCases = script.indexOf('partKeyStartPosition');
        const switchBody = script.slice(startOfSwitch, endOfCases);
        const matches = switchBody.matchAll(/:[a-zA-Z0-9]+=([a-zA-Z0-9]+),[a-zA-Z0-9]+=([a-zA-Z0-9]+);/g);
        const nums = [];
        for (const match of matches) {
            const innerNumbers = [];
            for (const varMatch of [match[1], match[2]]) {
                const regex = new RegExp(`${varMatch}=0x([a-zA-Z0-9]+)`, 'g');
                const varMatches = [...script.matchAll(regex)];
                const lastMatch = varMatches[varMatches.length - 1];
                if (!lastMatch) return null;
                const number = parseInt(lastMatch[1], 16);
                innerNumbers.push(number);
            }

            nums.push([innerNumbers[0], innerNumbers[1]]);
        }

        return nums;
    }

    async function start() {
        //const key = await get_key(cipher)
        //console.log("key:" + key)
        const fileUrl = 'https://megacloud.tv/js/player/a/prod/e1-player.min.js';
        const { data } = await axiosInstance.get(fileUrl);
        const pairs = getPairs(data);
        return key
    }





    const url = rabbit_stream('QRvLFZRcrndJ');
    console.log(url);

    res.json(url);

};


