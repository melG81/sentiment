let config = module.exports = {};

config.PORT = process.env.PORT;
config.webhoseTOKEN = process.env.WEBHOSETOKEN;
config.sentimentDBHost = 'http://localhost:4201';
if (process.env.NODE_ENV === 'development') {
  config.sentimentDBHost = 'http://localhost:4201';
} else {
  config.sentimentDBHost = 'https://cryptoserver.now.sh';
}
