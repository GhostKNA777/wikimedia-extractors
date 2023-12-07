import { TwoEmbedExtractor } from './src/main/extractors/2embed';
import { Source, Subtitle } from './src/main/types/sources';
import { VidSrcExtractor } from './src/main/extractors/vidsrc';

export async function sayHello() {

    const vidSrcExtractor = new VidSrcExtractor();
    const src = await vidSrcExtractor.extractUrls("tt28797183", "movie", 0, 0) as Source[];
    console.log("SRC:" + JSON.stringify(src));
    console.log("###############################");
    console.log("SRC URL:" + JSON.stringify(src[0].source.url));
    console.log("###############################");
    console.log("SRC SUB:" + JSON.stringify(src[0].subtitles));
    console.log("###############################");



    // const twoEmbedExtractor = new TwoEmbedExtractor();
    // const src = await twoEmbedExtractor.extractUrls("tt28797183", "movie", 0, 0) as Source[];

    // const result = {
    //     url: src[0].source.url,
    //     subtitles: src[0].subtitles
    // };

    // console.log(JSON.stringify(result));





    // const vidSrcToExtractor = new VidSrcToExtractor();
    // const src = await vidSrcToExtractor.extractUrls("872585","movie", 0, 0);
    // //const src = await vidSrcToExtractor.extractUrls("tt28797183","movie", 0, 0);
    // console.log("FINAL:"+ src);

    //const vidPlayExtractor = new VidPlayExtractor();
    //const vidPlayUrl = vidPlayExtractor.extractUrl("https://vidplay.site/e/7ZPNNVDX2P02?sub.info=https://vidsrc.to/ajax/embed/episode/o_RiMs1k/subtitles&t=4xjQCPwkBFEIzQ==&ads=0&src=vidsrc");
    //console.log(vidPlayUrl);
}

sayHello();
