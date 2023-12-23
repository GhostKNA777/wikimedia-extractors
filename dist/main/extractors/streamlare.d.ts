import { Source } from '../types/sources';
import { IExtractor } from './types';
export declare class StreamlareExtractor implements IExtractor {
    url: string;
    referer: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=streamlare.d.ts.map