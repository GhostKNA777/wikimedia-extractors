import { Source } from '../../types/sources';
import { ContentType } from '../../types/tmbd';
import { IExtractor } from '../types';
export declare class VegaMoviesExtractor implements IExtractor {
    name: string;
    url: string;
    private goFileExtractor;
    private getTitleUrl;
    private mapWrongShowTitles;
    private extractVCloud;
    private extractFastDl;
    extractUrls(title: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=vegamovies.d.ts.map