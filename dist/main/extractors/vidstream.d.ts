import { Source } from '../types/sources';
import { IExtractor } from './types';
export declare class VidstreamExtractor implements IExtractor {
    url: string;
    referer: string;
    private eltikUrl;
    private getFuToken;
    private getFileUrl;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=vidstream.d.ts.map