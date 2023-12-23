import { Source } from '../types/sources';
import { IExtractor } from './types';
export declare class RabbitStreamExtractor implements IExtractor {
    url: string;
    referer: string;
    private decryptionKeyUrl;
    private md5;
    private generateKey;
    private decryptSourceUrl;
    private decrypt;
    private getDecryptionKey;
    private extractSourceUrl;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=rabbitstream.d.ts.map