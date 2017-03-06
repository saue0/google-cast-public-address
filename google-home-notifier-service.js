var express = require('express');
var googlehome = require('./google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var app = express();
var conf = require('./config.js');
var ngrokUrl;

const serverPort = conf.get('port');
const serverIp = conf.get('ip');
const localUrl = 'http://' + serverIp + ':' + serverPort + '/google-home-notifier';
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

app.listen(serverPort, serverIp, function () {
  if (useNgrok) {
    ngrok.connect(serverPort, function (err, url) {
      ngrokUrl = url;
      usage();
    });
  } else {
    usage();
  }
});

function usage() {
  console.log('POST "text=Hello Google Home" to:');
  console.log('    ' + localUrl);
  if (useNgrok) {
    console.log('    ' + ngrokUrl + '/google-home-notifier');
  }
  console.log('example:');
  console.log('curl -X POST -d "text=Hello Google Home" ' + localUrl + '/google-home-notifier');
}
