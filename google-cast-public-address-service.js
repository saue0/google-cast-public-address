'use strict';
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var conf = require('./config.js');
const useNgrok = conf.get('ngrok');
if (useNgrok) var ngrok = require('ngrok');
var ngrokUrl;
var pa = require('./google-cast-public-address');
const port = conf.get('port');
const ip = conf.get('ip');
const useHttp = port > 0;
if (useHttp) var http = require('http');
const sslIp = conf.get('sslIp');
const sslPort = conf.get('sslPort');
const servicePath = 'google-cast-public-address';
const publicPath = conf.get('publicPath');
const useHttps = sslPort > 0;
if (useHttps) var https = require('https');
const howTo = 'POST "text=Hello Google Cast" | "file=path/to/file" | "url=http[s]://example.com/path"';
const ipZero = '0.0.0.0';

var deviceName = 'Google Home';
var lastdeviceName = 'Google Home';
pa.device(deviceName);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(publicPath));

// IP address used to fetch (file) media.
// In case server is bound to multiple addresses, you can specify the address to fetch from
// If omitted, and bound to multiple addresses, the first bound external address will be used
// You can actually load media from a completely different server, as well, it saves having to
// repeat protocol/address/port to do that using url=
var mediaIp = conf.get('mediaIp');
var mediaPort = conf.get('mediaPort');
if (mediaPort < 1) {
  mediaPort = port;
}
const boundAddresses = getBoundAddresses();
if (mediaIp === ipZero) {
  mediaIp = boundAddresses.external[0];  // first bound external IPv4 address
}

const serviceUrl = mkServiceUrl(ip);
const mediaUrl = `http://${mediaIp}:${mediaPort}/media/`;
console.log('mediaUrl:', mediaUrl);
const serviceSslUrl = mkServiceSslUrl(sslIp);

app.post('/google-cast-public-address', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  var text = req.body.text;
  var file = req.body.file;
  var url = req.body.url;
  var currdeviceName = req.body.device || deviceName;
  var language = req.body.language || 'en';
  
  if (lastdeviceName != currdeviceName) {
    lastdeviceName = currdeviceName;
    pa.device(lastdeviceName);
  }
  
  if (text) {
    res.send(deviceName + ' will say: ' + text + '\n');
    pa.notify(text, function(res) {
      console.log(res);
    });
  } else if (file) {
    var path = mediaUrl + file;
    res.send(deviceName + ' will play: ' + path + '\n');
    pa.play(path, function(res) {
      console.log(res);
    });
  } else if (url) {
    res.send(deviceName + ' will play: ' + url + '\n');
    pa.play(url, function(res) {
      console.log(res);
    });
  } else {
    res.send('Please ' + howto);
  }

});

startHttp();

function startHttp() {
  if (useHttp) {
    http.createServer(app).listen(port, ip, function() {
      startHttps();
    });
  } else {
    startHttps();
  }
}

function startHttps() {
  if (useHttps) {
    var sslOptions = {
      key: fs.readFileSync(conf.get('sslKeyPath')),
      cert: fs.readFileSync(conf.get('sslCertPath')),
      passphrase: conf.get('sslPassphrase')
    };
    https.createServer(sslOptions, app).listen(sslPort, sslIp, function() {
      registerNgrok();
    });
  } else {
    registerNgrok();
  }
}

function registerNgrok() {
  if (useNgrok) {
    ngrok.connect(port, function (err, url) {
      ngrokUrl = url;
      usage();
    });
  } else {
    usage();
  }
}

function usage() {
  const addresses = boundAddresses.all.sort();
  console.log(`${howTo} to:`);
  if (useHttp) {
    for (var i in addresses) console.log('    ' + mkServiceUrl(addresses[i]));
  }
  if (useHttps) {
    for (var i in addresses) console.log('    ' + mkServiceSslUrl(addresses[i]));
  }
  if (useNgrok) {
    console.log(`    ${ngrokUrl}/google-cast-public-address`);
  }
  console.log('example:');
  console.log(`curl -X POST -d "text=Hello Google Cast" ${mkServiceUrl(boundAddresses.external[0])}`);
}

function getBoundAddresses() {
  var addresses = {internal:[], external:[], all:[]};
  const os = require('os');
  var interfaces = os.networkInterfaces();
  for (let i in interfaces) {
    for (let j in interfaces[i]) {
      let a = interfaces[i][j];
      if (a.family === 'IPv4') {
        addresses.all.push(a.address);
        addresses[a.internal ? 'internal' : 'external'].push(a.address);
      }
    }
  }
  return addresses;
}

function mkServiceUrl(ipAddr='0.0.0.0', isSsl=false) {
  const _port = isSsl ? sslPort : port;
  const base = `http${isSsl ? 's' : ''}://${ipAddr}:${_port}/`;
  const url = base + servicePath;
  return url;
}

function mkServiceSslUrl(ipAddr) {
  return mkServiceUrl(ipAddr, true);
}
