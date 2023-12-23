import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyNFlimExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=nflim.d.ts.map