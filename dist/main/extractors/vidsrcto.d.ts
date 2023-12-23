import { Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
import { IExtractor } from './types';
export declare class VidSrcToExtractor implements IExtractor {
    url: string;
    private mainUrl;
    private vidStreamExtractor;
    private fileMoonExtractor;
    private vidPlayExtractor;
    private key;
    private decodeBase64UrlSafe;
    private decode;
    private decryptSourceUrl;
    extractUrls(imdbId: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=vidsrcto.d.ts.map