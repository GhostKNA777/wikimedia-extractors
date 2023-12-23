import { Source } from '../../types/sources';
import { ContentType } from '../../types/tmbd';
import { IExtractor } from '../types';
export declare class SmashyStreamExtractor implements IExtractor {
    url: string;
    referer: string;
    private imExtractor;
    private ffixExtractor;
    private watchXExtractor;
    private nflimExtractor;
    private fxExtractor;
    private cfExtractor;
    private eeMovieExtractor;
    private fizzzzExtractor;
    private fm22Extractor;
    private dudMovieExtractor;
    private seguExtractor;
    private emsExtractor;
    private video1Extractor;
    private video3mExtractor;
    extractUrls(imdbId: string, type: ContentType, season?: number, episode?: number): Promise<Source[]>;
}
//# sourceMappingURL=smashystream.d.ts.map