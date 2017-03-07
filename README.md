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

#### Web Service
If you want to run a web service, take a look at the google-home-notifier-service.js file. You can run this from a Raspberry Pi, pc or mac. The example uses ngrok so the server can be reached from outside your network. I tested with ifttt.com Maker channel and it worked like a charm.

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

#### SSL ####
For SSL, you need a certificate. For instructions on creating a self-signed certificate, see:

    https://aghassi.github.io/ssl-using-express-4/

If your certificate has a passphrase, you can supply it in the configuration (see below). Obviously, this is less than secure, as now you have the certificate passphrase sitting in an unencrypted. As well, you will need to use the cURL --insecure option in order to accept the self-signed certificate when testing. If you are accessing the service from home automation equipment, etc. see if there is an option to accept self-signed certificates.

Of course, it is better to use a certificate signed by a certificate authority trusted by browsers and operating systems!

#### Configuration
Configuration is normally read from ./config/config.json. You can also provide environment-specific overrides in ./config/production.json, ./config/development.json, or ./config/test.json. Configuration items can also be overridden from command-line or environment variables.

See https://github.com/mozilla/node-convict for details on overriding configuration items.

| key | description |
 ---------- | ----------------------------------------
ip | IP address to bind http server, defaults to 127.0.0.1
port | port to bind http server, defaults to 8080, 0 to disable
ngrok | true to register with ngrok
sslIP | IP address to bind https server, defaults to 127.0.0.1
sslPort | port to bind https server, defaults to 8443, 0 to disable
sslPassphrase | passphrase for access to SSL certificate
sslCertPath | path to SSL certificate file
sslKeyPath | path to SSL key file


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


