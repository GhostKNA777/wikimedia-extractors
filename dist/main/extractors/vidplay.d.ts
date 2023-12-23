import { Source } from '../types/sources';
import { IExtractor } from './types';
export declare class VidPlayExtractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    private getKeys;
    private key_Permutation2;
    private getEncodedId;
    private getFuTokenKey;
    private getFileUrl;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=vidplay.d.ts.map