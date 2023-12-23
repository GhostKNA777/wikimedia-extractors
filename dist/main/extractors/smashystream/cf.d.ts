import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyCfExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=cf.d.ts.map