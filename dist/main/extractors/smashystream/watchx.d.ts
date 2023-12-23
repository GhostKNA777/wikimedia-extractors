import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyWatchXExtractor implements IExtractor {
    name: string;
    url: string;
    private KEY;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=watchx.d.ts.map