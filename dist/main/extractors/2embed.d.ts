import { Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
import { IExtractor } from './types';
export declare class TwoEmbedExtractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    extractUrls(imdbId: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=2embed.d.ts.map