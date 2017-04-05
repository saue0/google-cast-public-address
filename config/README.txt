To configure the web service, you need a file in this directory called "<environment>.json",
where <environment> is the value of NODE_ENV. (NODE_ENV defaults to 'production'). So, for
production environment, you would need a file:

  production.json

There is a sample file in example.json that you can copy and modify.

If the <environment>.json file is omitted, defaults will be used. Note that the example file
provided just uses the defaults. It will be no different from defaults unless you modify it.

Possible environment values are production | development | test.

