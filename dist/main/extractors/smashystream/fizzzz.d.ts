import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class SmashyFizzzzExtractor implements IExtractor {
    name: string;
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=fizzzz.d.ts.map