import { Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
import { IExtractor } from './types';
export declare class UHDMoviesExtractor implements IExtractor {
    name: string;
    url: string;
    private extractOddFirmDriveLeechUrl;
    private extractDriveLeech;
    private extractVideoCdn;
    extractUrls(showName: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=uhdmovies.d.ts.map