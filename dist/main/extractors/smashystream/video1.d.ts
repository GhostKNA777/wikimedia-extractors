import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyVideo1Extractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=video1.d.ts.map