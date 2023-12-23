"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMoonExtractor = void 0;
const axios_1 = require("../utils/axios");
const utils_1 = require("./utils");
class FileMoonExtractor {
    //logger = log.scope('FileMoon');
    url = 'https://filemoon.sx/';
    async extractUrl(url) {
        try {
            const res = await axios_1.axiosInstance.get(url);
            const regex = /eval\((.*)\)/g;
            const evalCode = regex.exec(res.data)?.[0];
            if (!evalCode)
                throw new Error('No eval code found');
            const extractSource = async (file) => {
                const quality = await (0, utils_1.getResolutionFromM3u8)(file, true);
                return {
                    server: 'FileMoon',
                    source: {
                        url: file,
                    },
                    type: file.includes('.m3u8') ? 'm3u8' : 'mp4',
                    quality,
                };
            };
            const extractionPromise = new Promise((resolve, reject) => {
                const sandbox = {
                    jwplayer: () => ({
                        setup: async (config) => {
                            if (config.sources && Array.isArray(config.sources)) {
                                const firstSource = config.sources[0];
                                if (firstSource && firstSource.file) {
                                    resolve(extractSource(firstSource.file));
                                }
                                else {
                                    reject(new Error('No file found'));
                                }
                            }
                            else {
                                reject(new Error('No sources found'));
                            }
                        },
                        on: () => { },
                        addButton: () => { },
                        getButton: () => { },
                        seek: () => { },
                        getPosition: () => { },
                        addEventListener: () => { },
                        setCurrentCaptions: () => { },
                        pause: () => { },
                    }),
                    document: {
                        addEventListener: (event, callback) => {
                            if (event === 'DOMContentLoaded') {
                                callback();
                            }
                        },
                    },
                    fetch: async () => ({
                        json: async () => ({}),
                    }),
                    $: () => ({
                        hide: () => { },
                        get: () => { },
                        detach: () => ({
                            insertAfter: () => { },
                        }),
                    }),
                    p2pml: {
                        hlsjs: {
                            Engine: class {
                                constructor() {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    this.on = () => { };
                                }
                                createLoaderClass() { }
                            },
                        },
                    },
                };
            });
            return await extractionPromise;
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error.message);
            return undefined;
        }
    }
}
exports.FileMoonExtractor = FileMoonExtractor;
//# sourceMappingURL=filemoon.js.map