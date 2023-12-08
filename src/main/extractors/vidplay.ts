import { Source } from '../types/sources';
//import log from 'electron-log';
import { createCipheriv } from 'crypto';
import { axiosInstance } from '../utils/axios';
import { IExtractor } from './types';
import { getResolutionFromM3u8 } from './utils';

export class VidPlayExtractor implements IExtractor {
  name = 'VidPlay';

  //logger = log.scope(this.name);

  url = 'https://vidplay.site';

  referer = 'https://vidplay.site/';

  private async getKeys(): Promise<string[]> {
    // Thanks to @Claudemirovsky for the keys :D
    const res = await axiosInstance.get('https://raw.githubusercontent.com/Claudemirovsky/worstsource-keys/keys/keys.json');
    return res.data;
  }

  /*function encodeId(vId) {
    const response = await fetch('https://raw.githubusercontent.com/Claudemirovsky/worstsource-keys/keys/keys.json');
    const [key1, key2] = await response.json();
    const decodedId = keyPermutation(key1, vId).encode('Latin_1');
    const encodedResult = keyPermutation(key2, decodedId).encode('Latin_1');
    const encodedBase64 = btoa(encodedResult);

    return encodedBase64.replace('/', '_');
}*/

  private key_Permutation2(key: string, data: any) {
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
      } else if (typeof data[char] === 'number') {
        final_key += String.fromCharCode(data[char] ^ state[(state[index_1] + state[index_2]) % 256]);
      }
    }
    return final_key;
  }

  private async getEncodedId(sourceUrl: string): Promise<string> {
    const id = sourceUrl.split('/e/')[1].split('?')[0];
    //console.log("getEncodedId:" + id);
    const keyList = await this.getKeys();
    //console.log("keyList:" + id);

    const decodedId = this.key_Permutation2(keyList[0], id);
    const encodedResult = this.key_Permutation2(keyList[1], decodedId);
    const encodedBase64 = btoa(encodedResult);
    /*const c1 = createCipheriv('rc4', Buffer.from(keyList[0]), '');
    const c2 = createCipheriv('rc4', Buffer.from(keyList[1]), '');

    let input = Buffer.from(id);
    input = Buffer.concat([c1.update(input), c1.final()]);
    input = Buffer.concat([c2.update(input), c2.final()]);*/

    //return input.toString('base64').replace('/', '_');
    return encodedBase64.replace('/', '_');
  }





  private async getFuTokenKey(sourceUrl: string) {
    //console.log("sourceUrl:" + sourceUrl);
    const id = await this.getEncodedId(sourceUrl);
    //console.log("id:" + id);
    const res = await axiosInstance.get(`${this.url}/futoken`, {
      headers: {
        referer: /*encodeURIComponent(*/sourceUrl/*)*/,
      },
    });
    //console.log("res.data:" + res.data);
    const fuKey = res.data.match(/var\s+k\s*=\s*'([^']+)'/)[1];
    const a = [];
    for (let i = 0; i < id.length; i += 1) a.push(fuKey.charCodeAt(i % fuKey.length) + id.charCodeAt(i));
    return `${fuKey},${a.join(',')}`;
  }

  private async getFileUrl(sourceUrl: string) {
    //console.log("getFileUrl:" + sourceUrl);
    const futoken = await this.getFuTokenKey(sourceUrl);
    //console.log("futoken:" + futoken);
    //console.log("split:" + sourceUrl.split('?')[1]);
    const url = `${this.url}/mediainfo/${futoken}?${sourceUrl.split('?')[1]}`;
    //console.log("Final" + url);
    return url;
  }

  async extractUrl(url: string): Promise<Source | undefined> {
    try {
      const fileUrl = await this.getFileUrl(`${url}&autostart=true`);
      //console.info("src:" + fileUrl);
      const res = await axiosInstance.get(fileUrl, {
        headers: {
          referer: url,
        },
      });
      //console.info("src2:" + res.data.result[0]);
      const source = res.data.result.sources[0].file;
      console.info("src2:" + source);

      const quality = await getResolutionFromM3u8(source, true);

      const thumbnail = res.data.result?.tracks?.find((track: any) => track.kind === 'thumbnails');
      return {
        server: this.name,
        source: {
          url: source,
        },
        type: 'm3u8',
        quality,
        thumbnails: {
          url: thumbnail?.file,
        },
      };
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      return undefined;
    }
  }
}