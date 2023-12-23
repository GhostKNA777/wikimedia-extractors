import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyEmsExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=ems.d.ts.map