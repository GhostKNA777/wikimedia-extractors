declare module 'm3u8-parser';
import { TwoEmbedExtractor } from './src/main/extractors/2embed';
import { Source, Subtitle } from './src/main/types/sources';
import { VidSrcExtractor } from './src/main/extractors/vidsrc';
import { VidSrcToExtractor } from './src/main/extractors/vidsrcto';
import { VidPlayExtractor } from './src/main/extractors/vidplay';

export { TwoEmbedExtractor, VidSrcExtractor, Source, Subtitle, VidSrcToExtractor, VidPlayExtractor };
