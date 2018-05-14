require('dotenv').config();

let config = module.exports = {};

// Dependencies
const language = require('@google-cloud/language');

config.PORT = process.env.PORT;
config.webhoseTOKEN = process.env.WEBHOSETOKEN;
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  config.sentimentDBHost = 'http://localhost:3000';
  config.host = 'http://localhost:4000'
} else {  
  config.sentimentDBHost = 'https://cryptoserver.now.sh';
  config.host = 'https://cryptonewsagency.com'
}
// Instantiate google natural language client
config.googleClient = new language.LanguageServiceClient({
  credentials: {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: Buffer.from(process.env.PRIVATE_KEY_ID, 'base64').toString(),
    private_key: Buffer.from(process.env.PRIVATE_KEY, 'base64').toString(),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CERT_URL
  }
});