import { VidSrcToExtractor } from './src/main/extractors/vidsrcto';
import { VidPlayExtractor } from './src/main/extractors/vidplay';
import { TwoEmbedExtractor } from './src/main/extractors/2embed';
import { EmbedsitoExtractor } from './src/main/extractors/embedsito';
import { MoviesApiExtractor } from './src/main/extractors/moviesapi';
import { MyFileStorageExtractor } from './src/main/extractors/myfilestorage';
import { RemoteStreamExtractor } from './src/main/extractors/remotestream';
import { ShowBoxExtractor } from './src/main/extractors/showbox'; //4k
import { formatToJSON } from './src/main/extractors/utils';

async function sayHello() {
    
    const twoEmbedExtractor = new ShowBoxExtractor();
    const src = await twoEmbedExtractor.extractUrls("Monarch%3A+Legacy+of+Monsters","tv", 1, 1);
    console.log(JSON.stringify(src));

     //const vidPlayExtractor = new VidPlayExtractor();
     //const vidPlayUrl = vidPlayExtractor.extractUrl("https://vidplay.site/e/7ZPNNVDX2P02?sub.info=https://vidsrc.to/ajax/embed/episode/o_RiMs1k/subtitles&t=4xjQCPwkBFEIzQ==&ads=0&src=vidsrc");
     //console.log(vidPlayUrl);
  }

  sayHello();
  