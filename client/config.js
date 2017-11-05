let config = module.exports = {};

// Dependencies
const language = require('@google-cloud/language');

config.PORT = process.env.PORT;
config.webhoseTOKEN = process.env.WEBHOSETOKEN;
if (process.env.NODE_ENV === 'development') {
  config.sentimentDBHost = 'http://localhost:4201';
} else {
  config.sentimentDBHost = 'https://cryptoserver.now.sh';
}
// Instantiate google natural language client
config.googleClient = new language.LanguageServiceClient({
  credentials: {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDeUSuTRsnEfhVG\nSNO20mlkAAiJTddER1hvMqXmPns6ynbqhvANzgxI1qtL1hyFWvWsG30iysKe2hO1\nQseAegTOaxNNPU25mVMZaQDWEE0+UTj4WZmAJXOIJeu6zIch75ODUnFIcVpVBhl9\nM64l5RwBFnPSI4wQnKYrVMKhK0tWPVo/01LwVvsWrNt2yUdPcWe/GFVr+jPzBoeC\nhdWR0DBEzrpy3iHGiS/iI6ddiz66Y8nSsctKGnjKqgAxaUDQpy7dda6Bv3B4cQYu\n6TSm59Np2w9jEo7gHJX3XzRYy1kn/dEHwBMOIJ8CEI9crD8AWMyiGylx6qf1+DRT\nBi8rN4hRAgMBAAECggEAAii+qBkFZ6Oj2EFn0Pw9Ksv3SUIYx6B7wuS2iMRtlPYX\nbpKt7SxloSV4l212bHMkNK41qmtWtY0/qMCDyIMm3cxbbSIdyaIsFPCYofuZjHPk\nfkD8hSqX8ygPIIrQ+yrk/18DG6WCL5Y2FCm21MZjXb1WlaFjwFuNH5mcpE0T17wP\nLHrzVD9XtKpyUIcfKgEOp2WuDSjJckW4qELNaVp8BB07xVIKybXcW1hyugGxdZIw\nfa8EnKWJN+V2cMUgRbvR20sTKvP5+aCElQdNdpw/IH5HC4AnOTnw8QbEyMev/eTn\nmcxbiA2FDXE+PaMPbTT/m7//YNypRpyekkg6r2fLuQKBgQDwvoz7tQigjB50R9K2\new9oERgFjZ34haIsFuYh93fNGwcHZqpjYShIni0UMf2HtdMCYvAoYJa2BcEov6gt\nax3RbCnbbOqC76ixVRqBD/yDbSArqtO3y7YdWAdp8BSxcx4IUbhDQRAF4wK4npf+\n9lYqU1B/uAn6VhZ2T78VrtpDbQKBgQDsZ69kOTncP0ihHElXdy9CD5n5DuPulVfq\nz8mpfDjd/thv28/0Y+k41DrreJtnRqrlpw4i8k24I1qHUCTN312wpwRzJUOPx7rG\nDSJcv9vu9e5bD6Ton7I34Z8OXHUwOG9fDVMXbbkTzrJDyWuz91aRHUdLEIkk9831\n9Ufqxsdl9QKBgQCkP81eWdgF+TM58Fqxx2nufWMfPsydZ0cKv6DJYdZpqFv2T7RG\nU14xlUF6OtUXxxSs1yW01plcnLZ5f7FVM3THkf1IyJmDNdGpE0Ae9/I3FLfTMxx5\nlFGu2YVNYNAtdTXzRRXrRLOS4JvVq9ZVzGljPS55xO2Bz0RJ+gSL3ZzqTQKBgQCE\ni+np7rADTjQhqONyN+/2QRsaan/fwDpH/HLcJTsZNQ8TQJKLOw2DgHL8nWW8dQHS\nu2SQsXxj9uaGIahRCaDVL/+ts8H6toiBDNIsYKImjBs1UUMr7oYVENqGSc6m162S\nBL2G0E1JzsVifmd1wwL1YA4eB0ptwMbo1bqZ5xPblQKBgQDI/augCZXP1S9wF0qc\neu8yxShx4/hAaD/lfmiqOGsOPCA/osmg33/bDrTe5c6c+riQRJbPvLGzHpOEmPfb\nV3g4Fs8fNqvshpgwuhBXt46WlEAIgL75mcBqn+bSpX9lz/F99ssoCG1PPF8BjaMt\n50ieW5Rt97K0tFNb28Rq5qjnOQ==\n-----END PRIVATE KEY-----\n`,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CERT_URL
  }
});