import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyFxExtractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=fx.d.ts.map