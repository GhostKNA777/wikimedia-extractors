import { Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
import { IExtractor } from './types';
export declare class ShowBoxExtractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    private extractFebBox;
    extractUrls(showName: string, contentType: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=showbox.d.ts.map