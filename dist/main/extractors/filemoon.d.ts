import { Source } from '../types/sources';
import { IExtractor } from './types';
export declare class FileMoonExtractor implements IExtractor {
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=filemoon.d.ts.map