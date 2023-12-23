import { Source } from '../../types/sources';
import { ContentType } from '../../types/tmbd';
import { IExtractor } from '../types';
export declare class SuperStreamExtractor implements IExtractor {
    url: string;
    private secondUrl;
    private iv;
    private key;
    private appKey;
    private appid;
    private secondAppid;
    private version;
    private versionCode;
    private baseData;
    private baseHeaders;
    private getExpireDate;
    private md5;
    private encryptQuery;
    private getVerify;
    private executeApiCall;
    extractUrls(searchQuery: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=superstream.d.ts.map