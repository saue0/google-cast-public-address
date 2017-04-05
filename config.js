/*
  You should not normally edit this file. Use a .json file to set local configuration,
  i.e. config/production.json, config/development.json, config/test.json (depending on NODE_ENV)
  Any settings in the .json file will override settings made here.
*/

var convict = require('convict');

var conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'production',
    env: 'NODE_ENV',
    arg: 'node-env'
  },
  ip: {
    doc: 'The IP address to bind. 0.0.0.0 to bind to all',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'IP',
    arg: 'ip'
  },
  port: {
    doc: 'The http port to bind. 0 to disable',
    format: 'port',
    default: 8080,
    env: 'PORT',
    arg: 'port'
  },
  mediaIp: {
    doc: 'The address to fetch file media from, 0.0.0.0 to use first external IP',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'MEDIAIP',
    arg: 'media-ip'
  },
  mediaPort: {
    doc: 'the port to fetch file media from, 0 to disable',
    format: 'port',
    default: 0,
    env: 'MEDIAPORT',
    arg: 'media-port'
  },
  sslIp: {
    doc: 'The https address to bind. 0.0.0.0 or empty to bind to all',
    format: '*',
    default: '0.0.0.0',
    env: 'SSLIP',
    arg: 'ssl-ip'
  },
  sslPort: {
    doc: 'The https port to bind. 0 to disable.',
    format: 'port',
    default: 8443,
    env: 'SSLPORT',
    arg: 'ssl-port'
  },
  sslCertPath: {
    doc: 'SSL certificate file path.',
    format: '*',
    default: './ssl/default_cert.pem',
    env: 'SSL_CERT_PATH',
    arg: 'ssl-cert-path'
  },
  sslKeyPath: {
    doc: 'SSL key file path.',
    format: '*',
    default: './ssl/default_key.pem',
    env: 'SSL_KEY_PATH',
    arg: 'ssl-key-path'
  },
  sslPassphrase: {
    doc: 'Passphrase for access to the SSL certificate.',
    format: '*',
    default: 'google-home-notifier',
    env: 'SSL_PASSPHRASE',
    arg: 'ssl-passphrase',
    sensitive: true
  },
  ngrok: {
    doc: 'true to register with ngrok',
    format: 'Boolean',
    default: false,  // if no config file, better safe than sorry
    env: 'NGROK',
    arg: 'ngrok'
  },
  publicPath: {
    doc: 'path in local filesystem to /public',
    format: '*',
    default: './public',
    env: 'PUBLIC_PATH',
    arg: 'public-path'
  }
});

// Load environment dependent configuration
var fs = require('fs');
const configPathBase = './config/';
const env = conf.get('env');
const configPath = `${configPathBase}${env}.json`;
if (fs.existsSync(configPath)) conf.loadFile(configPath);

// Perform validation
conf.validate({strict: true});

module.exports = conf;
