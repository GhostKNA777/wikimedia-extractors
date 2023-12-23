import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyImExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=im.d.ts.map