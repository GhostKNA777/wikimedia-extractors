import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyEeMovieExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=ee.d.ts.map