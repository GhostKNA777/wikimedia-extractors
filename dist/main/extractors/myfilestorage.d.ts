import { Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
import { IExtractor } from './types';
export declare class MyFileStorageExtractor implements IExtractor {
    name: string;
    url: string;
    referer: string;
    extractUrls(tmdbId: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=myfilestorage.d.ts.map