import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyDudMovieExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=dudmovie.d.ts.map