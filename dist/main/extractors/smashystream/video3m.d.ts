import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyVideo3MExtractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=video3m.d.ts.map