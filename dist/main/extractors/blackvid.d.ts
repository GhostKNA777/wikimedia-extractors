import { Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
import { IExtractor } from './types';
export declare class BlackvidExtractor implements IExtractor {
    name: string;
    url: string;
    private apiKey;
    private decryptionKey;
    private getCurrentUTCDateString;
    private generateKeyAndIv;
    private decrypt;
    extractUrls(tmdbId: string, type: ContentType, season?: number | undefined, episode?: number | undefined): Promise<Source[]>;
}
//# sourceMappingURL=blackvid.d.ts.map