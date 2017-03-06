# google-home-notifier
Send notifications to Google Home

#### Installation
```sh
$ npm install google-home-notifier
```

#### Usage
```javascript
var googlehome = require('google-home-notifier');

googlehome.device('Google Home'); // Change to your Google Home name
googlehome.notify('Hey Foo', function(res) {
  console.log(res);
});
```

#### Listener
If you want to run a listener, take a look at the google-home-notifier-service.js file. You can run this from a Raspberry Pi, pc or mac. The example uses ngrok so the server can be reached from outside your network. I tested with ifttt.com Maker channel and it worked like a charm.

```sh
$ git clone https://github.com/watusi/google-home-notifier
$ cd google-home-notifier
$ npm install
$ node google-home-notifier-service.js
POST "text=Hello Google Home" to:
    http://127.0.0.1:8080/google-home-notifier
    https://xxxxx.ngrok.io/google-home-notifier
example:
curl -X POST -d "text=Hello Google Home" https://xxxxx.ngrok.io/google-home-notifier
```

#### Configuration
Configuration is normally read from ./config/config.json. You can also provide environment-specific overrides in ./config/production.json, ./config/development.json, or ./config/test.json. Configuration items can also be overridden from command-line or environment variables.

See https://github.com/mozilla/node-convict for details on overriding configuration items.

| key | description |
 ---------- | ----------------------------------------
ip | IP address to bind, defaults to 127.0.0.1
port | port to bind, defaults to 8080


#### Raspberry Pi
If you are running from Raspberry Pi make sure you have the following before nunning "npm install":
Use the latest nodejs dist.
```sh
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install nodejs
```
Also install these packages:
```sh
sudo apt-get install git-core libnss-mdns libavahi-compat-libdnssd-dev
```

## After "npm install" (only needed if host OS does not support IPV6)

Modify the following file "node_modules/mdns/lib/browser.js"
```sh
vi node_modules/mdns/lib/browser.js
```
Find this line:
```javascript
Browser.defaultResolverSequence = [
  rst.DNSServiceResolve(), 'DNSServiceGetAddrInfo' in dns_sd ? rst.DNSServiceGetAddrInfo() : rst.getaddrinfo()
, rst.makeAddressesUnique()
];
```
And change to:
```javascript
Browser.defaultResolverSequence = [
  rst.DNSServiceResolve(), 'DNSServiceGetAddrInfo' in dns_sd ? rst.DNSServiceGetAddrInfo() : rst.getaddrinfo({families:[4]})
, rst.makeAddressesUnique()
];
```


