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
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port"
  }
});

// Load environment dependent configuration
conf.loadFile('./config/config.json', './config/' + conf.get('env') + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;
