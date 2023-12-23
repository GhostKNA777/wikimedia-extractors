import { ContentType } from '../types/tmbd';
import { Source } from '../types/sources';
import { IExtractor } from './types';
export declare class MoviesApiExtractor implements IExtractor {
    url: string;
    referer: string;
    private getKey;
    extractUrls(tmdbId: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=moviesapi.d.ts.map