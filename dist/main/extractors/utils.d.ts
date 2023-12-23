import { RawAxiosRequestHeaders } from 'axios';
import { Source } from '../types/sources';
export declare const getCaptchaToken: (siteKey: string, url: string) => Promise<any>;
export declare const randomString: (length: number) => string;
export declare const getResolutionName: (resolution: number) => Source['quality'];
export declare const getResolutionFromM3u8: (m3u8: string, shouldRequest: boolean, headers?: RawAxiosRequestHeaders) => Promise<Source['quality']>;
export declare const findHighestResolutionStream: (m3u8Content: string) => string;
export declare const getResolution: (fileName: string | number) => Source['quality'];
export declare const addLeadingZero: (number: number) => string;
export declare const resolveRelativePaths: (m3u8Content: string, baseUrl: string) => string;
export declare const formatToJSON: (str: string) => string;
//# sourceMappingURL=utils.d.ts.map