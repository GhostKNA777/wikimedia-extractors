import { Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
import { IExtractor } from './types';
export declare class RemoteStreamExtractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    private apiKey;
    extractUrls(imdbId: string, type: ContentType, season?: number | undefined, episode?: number | undefined): Promise<Source[]>;
}
//# sourceMappingURL=remotestream.d.ts.map