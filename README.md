# google-home-notifier
Send notifications to Google Home devices

#### Installation

**These installation instructions are currently not valid, as this will install the original google-home-notifier, not this fork!**

```sh
$ npm install google-home-notifier
```

For now, the best way to install is to clone the git repo.


#### Usage

To use the notifier from your own node.js project:

```javascript
var googlehome = require('google-home-notifier');

googlehome.device('Google Home'); // Change to your Google Home name
googlehome.notify('Hey Foo', function(res) {
  console.log(res);
});
googlehome.play('http://kcrw.streamguys1.com/kcrw_192k_mp3_on_air_internet_radio', function(res) {
  console.log(res);
}
```

#### Web Service

google-home-notifier-service.js is a simple web service that uses google-home-notifier.js to play speech or media files
(e.g. .mp3 or other supported media) on Google Home. It is very handy for use with home automation controllers, IFTTT,
etc.

You can run this from a Raspberry Pi, pc or mac. The web service can register with ngrok so the server can be reached
from outside your network without any router configuration. For example, this can be used with ifttt.com Maker channel.

```sh
$ git clone https://github.com/watusi/google-home-notifier
$ cd google-home-notifier
$ npm install
$ node google-home-notifier-service.js
POST "text=Hello Google Home" | "file=path/to/file" | "url=http[s]://example.com/path" to:
    http://192.168.1.10:8080/google-home-notifier
    https://192.168.1.10:8443/google-home-notifier
example:
curl -X POST -d "text=Hello Google Home" http://192.168.1.10:2222/google-home-notifier
example:
curl -X POST -d "text=Hello Google Home" https://xxxxx.ngrok.io/google-home-notifier
```

#### Demo

There is a simple demo page included that you can access though the service. Just navigate to the server root. For
example:

   `http://192.168.1.10:8080/`

#### Local static files ####
The web service can serve static files from the `/public` directory. The primary use for this
is to play local media files on the Google Home Device.

To play a local media file on the Google Home device, use `file=` in the request body. Do not include
the URL - only the local file name.

You can also place other incidental static files in `/public`. For example, this might include some
simple form-based notifier web page that can be used from a browser.

If accessing these resources independently (e.g. from a web server to test) do NOT include
/public in the URL. They are accessed from the `/media` path. For example, to try the included sample file from a browser:

    http://localhost:8080/media/Woof-woof-woof.mp3


#### Play from URL ###
The web service can play resources from URL on your local network or the Internet. You can play any compatible file or stream.

To play from a URL, use `url=` in the request body. You must include the full URL including protocol.

For example, to play a live stream from KCRW in Santa Monica, California:

    http://kcrw.streamguys1.com/kcrw_192k_mp3_on_air_internet_radio

#### SSL ####
For SSL, you need a certificate. For instructions on creating a self-signed certificate, see:

  https://aghassi.github.io/ssl-using-express-4/

If your certificate has a passphrase, you can supply it in the configuration (see below). Obviously, this is less than secure, as now you have the certificate passphrase sitting in an unencrypted. As well, you will need to use the cURL --insecure option in order to accept the self-signed certificate when testing. If you are accessing the service from home automation equipment, etc. see if there is an option to accept self-signed certificates.

Of course, it is better to use a certificate signed by a certificate authority trusted by browsers and operating systems!

#### SSL and local static files ####
Google Home Assistant will not play media files from an SSL server that has a self-signed SSL certificate, or one signed by a certificate
authority that it does not trust.

Currently, you can only play local files using http:

(Todo: add a trusted certificate, modify code and test...)

#### Configuration

Configuration is read from optional `*.json` files located in the `config` directory. The base name of the configuration file should
match your current `NODE_ENV`. If `NODE_ENV` is not set, it defaults to `production`. This allows you to have separate configuration files
for `production`, `development`, and `test` environments.

If no configuration file is found, defaults are used. Defaults can be found in `config.js`. You should not normally edit this file!

A sample configuration file is provided in `config/example.js`. It has the same configuration as defaults. You can copy this file to
e.g. `config/production.json` and then edit with your local configuration settings.


| key | description |
 ---------- | ----------------------------------------
ip | IP address to bind http server, defaults to 0.0.0.0 (all)
port | port to bind http server, defaults to 8080, 0 to disable
sslIp | IP address to bind https server, defaults to 0.0.0.0 (all)
sslPort | port to bind https server, defaults to 8443, 0 to disable
sslPassphrase | passphrase for access to SSL certificate
sslCertPath | path to SSL certificate file
sslKeyPath | path to SSL key file
mediaIP | IP address of media server, defaults to 0.0.0.0 (first external IP address)
mediaPort | Port for media server, defaults to value of `port`. Set to 0 or omit to default.
ngrok | true to register with ngrok
publicPath | defaults to ./public

#### Media Server
The web service includes a simple static server that can be used to serve static media files to the
Google Home device. Alternately, you can use a different media server, perhaps a different server
on the same computer, or a different computer on your local network or on the Internet.

The media server must be accessible from the Google Home device, as the Google Home device will
actually request files from the server.

Note that if you access the web service using an address that is inaccessible to the Google Home device
(such as the loopback address, `127.0.0.1`) that in itself will not prevent access to the media server from
the Google Home device, as by default the media server IP will be set to the first external IP address
bound to the web service.

If your host is bound to multiple IP addresses, and the first configured interface is not accessible
to the Google Home device, you will need to set `mediaIP` and `mediaPort`.


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

## After "npm install"

(I believe only needed if host OS does not support IPV6.)

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
