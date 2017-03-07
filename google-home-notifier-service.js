var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
var conf = require('./config.js');
var ngrokUrl;
var googlehome = require('./google-home-notifier');

const port = conf.get('port');
const ip = conf.get('ip');
const useHttp = port > 0;
const sslIp = conf.get('sslIp');
const sslPort = conf.get('sslPort');
const localUrl = 'http://' + ip + ':' + port + '/google-home-notifier';
const localSslUrl = 'https://' + sslIp + ':' + sslPort + '/google-home-notifier';
const useHttps = sslPort > 0;
const useNgrok = conf.get('ngrok');

var deviceName = 'Google Home';
googlehome.device(deviceName);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/google-home-notifier', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  console.log(req.body);
  var text = req.body.text;
  if (text){
    res.send(deviceName + ' will say: ' + text + '\n');
    googlehome.notify(text, function(res) {
      console.log(res);
    });
  }else{
    res.send('Please POST "text=Hello Google Home"');
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
  console.log('POST "text=Hello Google Home" to:');

  if (useHttp) {
    console.log('    ' + localUrl);
  }

  if (useHttps) {
    console.log('    ' + localSslUrl);
  }

  if (useNgrok) {
    console.log('    ' + ngrokUrl + '/google-home-notifier');
  }
  console.log('example:');
  console.log('curl -X POST -d "text=Hello Google Home" ' + localUrl + '/google-home-notifier');
}
