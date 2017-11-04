let config = module.exports = {};

config.PORT = process.env.PORT || 3000;
config.webhoseTOKEN = process.env.WEBHOSETOKEN || 'da347ad6-b6b4-4135-839d-4308c3989db4';
if (process.env.NODE_ENV === 'development') {
  config.sentimentDBHost = 'http://localhost:4201';
} else {
  config.sentimentDBHost = 'https://cryptoserver.now.sh';
}