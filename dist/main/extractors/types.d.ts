import { LiveMainPage, Source } from '../types/sources';
import { ContentType } from '../types/tmbd';
export interface IExtractor {
    name?: string;
    url: string;
    referer?: string;
    extractUrl?: (url: string) => Promise<Source | undefined>;
    extractUrls?: (imdbId: string, type: ContentType, season?: number, episode?: number) => Promise<Source[]>;
}
export interface ILiveExtractor {
    name?: string;
    mainPageUrl: string;
    referer?: string;
    getMainPage: () => Promise<LiveMainPage[]>;
    extractUrls: (url: string) => Promise<Source[]>;
}
//# sourceMappingURL=types.d.ts.map