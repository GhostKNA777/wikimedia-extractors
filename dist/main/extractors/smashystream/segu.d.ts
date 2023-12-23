import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashySeguExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=segu.d.ts.map