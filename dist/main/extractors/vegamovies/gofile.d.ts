import { Source } from '../../types/sources';
import { IExtractor } from '../types';
export declare class GoFileExtractor implements IExtractor {
    name: string;
    url: string;
    apiUrl: string;
    private getGoFileWebsiteToken;
    private getGoFileAccountToken;
    extractUrl(url: string): Promise<Source | undefined>;
}
//# sourceMappingURL=gofile.d.ts.map