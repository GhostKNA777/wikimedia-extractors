import { LiveMainPage, Source } from '../../types/sources';
import { ILiveExtractor } from '../types';
export declare class CricFoot2Extractor implements ILiveExtractor {
    name: string;
    mainPageUrl: string;
    referer: string;
    getMainPage(): Promise<LiveMainPage[]>;
    extractUrls(url: string): Promise<Source[]>;
    private extractTVpLiveUrl;
    private extractCrichdUrl;
    private extractDlhd;
    private extractOlaliveHdPlay;
    private extractDaddyLiveHD;
    private extract1StreamBuzz;
    private extractAbolishStand;
    private getNonCommentedSource;
}
//# sourceMappingURL=cricfoot2.d.ts.map