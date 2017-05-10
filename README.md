# google-cast-public-address
A "public address system" for Google Cast devices. Facilitates asynchronous playing of TTS notifications, local audio
files, or remote (e.g. Internet) audio files on Google Cast devices.

The package provides a simple API that can be used in your own node.js projects. As well, an optional REST web service
is provided, which can be useful for initiating announcements or other audio from home automation apps and servers, etc.

This was originally forked from https://github.com/noelportugal/google-cast-public-address

#### Installation

For now, the best way to install is to clone the git repo. It has not yet been uploaded to NPM.

#### Usage

To use the API from your own node.js project:

```javascript
var pa = require('google-cast-public-address');

pa.device('Google Home'); // Change to your Google Cast device name
pa.notify('Hey Foo', function(res) {
  console.log(res);
});
pa.play('http://kcrw.streamguys1.com/kcrw_192k_mp3_on_air_internet_radio', function(res) {
  console.log(res);
}
```

#### Web Service

google-cast-public-address-service.js is a simple web service that uses google-cast-public-address.js to play speech or media files
(e.g. .mp3 or other supported media) on Google Cast devices. It is very handy for use with home automation controllers, IFTTT,
etc.

You can run this from a Raspberry Pi, pc, Mac, Linux-based router, etc. etc.
The web service can register with ngrok so the server can be reached
from outside your network without any router configuration.
For example, this can be used with ifttt.com Maker channel.

```sh
$ git clone https://github.com/watusi/google-cast-public-address
$ cd google-cast-public-address
$ npm install
$ node google-cast-public-address-service.js
POST "text=Hello Google Cast" | "file=path/to/file" | "url=http[s]://example.com/path" to:
    http://192.168.1.10:8080/google-cast-public-address
    https://192.168.1.10:8443/google-cast-public-address
example:
curl -X POST -d "text=Hello Google Cast" http://192.168.1.10:2222/google-cast-public-address
example:
curl -X POST -d "text=Hello Google Cast" https://xxxxx.ngrok.io/google-cast-public-address
```

#### Demo

There is a simple demo page included that you can access though the service. Just navigate to the server root. For
example:

   `http://192.168.1.10:8080/`

#### Local static files ####
The web service can serve static files from the `/public` directory. The primary use for this
is to play local media files on a Google Cast Device.

To play a local media file on a Google Cast device, use `file=` in the request body. Do not include
the URL - only the local file name.

You can also place other incidental static files in `/public`. For example, this might include some
simple form-based web page that can be used from a browser.

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
Google Cast devices will not play media files from an SSL server that has a self-signed SSL certificate, or one signed by a certificate
authority that it does not trust.

Currently, you can only play local files using http:

(Todo: add a trusted certificate, modify code and test...)

#### Configuration

Configuration is read from optional `*.json` files located in the `config` directory. The base name of the configuration file should
match your current `NODE_ENV`. If `NODE_ENV` is not set, it defaults to `production`. This allows you to have separate configuration files
for `production`, `development`, and `test` environments.

If no configuration file is found, defaults are used. Defaults can be found in `config.js`. You should not normally edit this file!

A sample configuration file is provided in `config/example.json`. It has the same configuration as defaults. You can copy this file to
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
The web service includes a simple static server that can be used to serve static media files to a
Google Cast device. Alternately, you can use a different media server, perhaps a different server
on the same computer, or a different computer on your local network or on the Internet.

The media server must be accessible from the Google Cast device, as the Google Cast device will
actually request files from the server.

Note that if you access the web service using an address that is inaccessible to the Google Cast device
(such as the loopback address, `127.0.0.1`) that in itself will not prevent access to the media server from
the Google Cast device, as by default the media server IP will be set to the first external IP address
bound to the web service.

If your host is bound to multiple IP addresses, and the first configured interface is not accessible
to the Google Cast device, you will need to set `mediaIP` and `mediaPort`.


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
