var convict = require('convict');

var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
    arg: "node-env"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP",
    arg: "ip"
  },
  port: {
    doc: "The http port to bind. 0 to disable",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port"
  },
  sslIp: {
    doc: "The https address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "SSLIP",
    arg: "ssl-ip"
  },
  sslPort: {
    doc: "The https port to bind. 0 to disable.",
    format: "port",
    default: 8443,
    env: "SSLPORT",
    arg: "ssl-port"
  },
  sslCertPath: {
    doc: "SSL certificate file path.",
    format: "*",
    default: "./ssl/default_cert.pem",
    env: "SSL_CERT_PATH",
    arg: "ssl-cert-path"
  },
  sslKeyPath: {
    doc: "SSL key file path.",
    format: "*",
    default: "./ssl/default_key.pem",
    env: "SSL_KEY_PATH",
    arg: "ssl-key-path"
  },
  sslPassphrase: {
    doc: "Passphrase for access to the SSL certificate.",
    format: "*",
    default: 'google-home-notifier',
    env: "SSL_PASSPHRASE",
    arg: "ssl-passphrase"
  },
  ngrok: {
    doc: "true to register with ngrok",
    format: "Boolean",
    default: false,
    env: "NGROK",
    arg: "ngrok"
  }
});

// Load environment dependent configuration
conf.loadFile('./config/config.json', './config/' + conf.get('env') + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;
