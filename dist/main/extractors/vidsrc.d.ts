import { ContentType } from '../types/tmbd';
import { Source } from '../types/sources';
import { IExtractor } from './types';
declare class VidSrcExtractor implements IExtractor {
    url: string;
    referer: string;
    origin: string;
    private embedUrl;
    private subtitleUrl;
    private getHashBasedOnIndex;
    extractUrls(imdbId: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
export default VidSrcExtractor;
//# sourceMappingURL=vidsrc.d.ts.map