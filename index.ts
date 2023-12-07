const { TwoEmbedExtractor } = require('./src/main/extractors/2embed');
const { Source, Subtitle } = require('./src/main/types/sources');
const { VidSrcExtractor } = require('./src/main/extractors/vidsrc');
const { VidSrcToExtractor } = require('./src/main/extractors/vidsrcto');
const { VidPlayExtractor } = require('./src/main/extractors/vidplay');

module.exports = { TwoEmbedExtractor, VidSrcExtractor, Source, Subtitle, VidSrcToExtractor, VidPlayExtractor };
