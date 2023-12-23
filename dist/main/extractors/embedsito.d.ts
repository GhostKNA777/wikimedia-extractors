import { Source } from '../types/sources';
import { IExtractor } from './types';
export declare class EmbedsitoExtractor implements IExtractor {
    url: string;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=embedsito.d.ts.map