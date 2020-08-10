<!--suppress ALL -->
<p align="center">
<img src="https://github.com/goodvir/fastify-box/raw/master/core/static/logo.png" width="500" height="auto" alt="Fastify-Box">
</p>
<br>
<p align="center">
<a href="https://github.com/goodvir/fastify-box/releases/latest">
<img src="https://badgen.net/github/release/goodvir/fastify-box/latest" alt="release">
</a>
<a href="https://github.com/goodvir/fastify-box/blob/master/LICENSE">
<img src="https://badgen.net/github/license/goodvir/fastify-box" alt="license">
</a>
<a href="https://github.com/goodvir/fastify-box/commits">
<img src="https://badgen.net/github/last-commit/goodvir/fastify-box" alt="last commit">
</a>
<a href="https://github.com/goodvir/fastify-box/commits">
<img src="https://badgen.net/github/commits/goodvir/fastify-box" alt="commits">
</a>
<a href="https://github.com/goodvir/fastify-box/branches">
<img src="https://badgen.net/github/branches/goodvir/fastify-box" alt="branches">
</a>
</p>
<br>

[Fastify-Box](https://github.com/goodvir/fastify-box)
web application template based on `fastify`, with customized extensions supported by the community.

[Fastify](https://www.fastify.io) is a web framework highly focused on providing the best developer experience 
with the least overhead and a powerful plugin architecture. It is inspired by Hapi and Express and 
as far as we know, it is one of the fastest web frameworks in town.

## Quick start

Create a folder and make it your current working directory:

```sh
mkdir example
cd example
```

Download the [latest release](https://github.com/goodvir/fastify-box/releases/latest) of the `fastify-box` template or:

```sh
git clone -b master --single-branch https://github.com/goodvir/fastify-box.git .
```

Install dependencies:

```sh
npm install
```

To start the app in dev mode:

```sh
npm run dev
```

For production mode:

```sh
npm start
```

## Settings

You can use environment variables to control the state of the template, 
note that during start the application tries to access the `.env` file to load the settings.

The settings from the file `config.js` are available in the decorator `fastify.config`.

### Application settings

| Setting                | Description                                      | Default           |
|:-----------------------|:-------------------------------------------------|:-----------------:|
| `NODE_ENV`             | Operating modes `string`                         | `unknown`         |
| `FST_PORT`             | Listening port `integer`                         | `3000`            |
| `FST_ADDRESS`          | Listening interface  `string`                    | `0.0.0.0`         |
| `FST_LOG_LEVEL`        | Logging level `string`                           | `info` or `debug` |

### Additional package settings

| Setting          | Description                                         | Default |
|:-----------------|:----------------------------------------------------|:-------:|
| `FST_ACCEPTS`    | [fastify-accepts](#fastify-accepts)                 | `true`  |
| `FST_COMPRESS`   | [fastify-compress](#fastify-compress)               | `false` |
| `FST_CORS`       | [fastify-cors](#fastify-cors)                       | `false` |
| `FST_HELMET`     | [fastify-helmet](#fastify-helmet)                   | `true`  |
| `FST_MULTIPART`  | [fastify-multipart](#fastify-multipart)             | `true`  |
| `FST_RATE_LIMIT` | [fastify-rate-limit](#fastify-rate-limit)           | `true`  |
| `FST_CONTEXT`    | [fastify-request-context](#fastify-request-context) | `true`  |
| `FST_SENSIBLE`   | [fastify-sensible](#fastify-sensible)               | `true`  |
| `FST_STATIC`     | [fastify-static](#fastify-static)                   | `true`  |
| `FST_RENDER`     | [point-of-view](#point-of-view)                     | `true`  |

## Documentation

### Directory content

```
├── core/
│   ├── plugins/        - registering global plugins
│   ├── services/       - registering services
│   ├── static/         - files available at URL "/static/**/*"
│   └── templates/      - page templates
├── .editorconfig       - https://editorconfig.org
├── .env                - variable environment settings
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettiererrc       - https://prettier.io
├── app.js              - application launch file
├── config.js           - application settings 
├── LICENSE
├── package.json        - package definition and dependencies
├── package-lock.json   - pinned dependency versions
└── README.md            
```

### Pre-installed plugins

If you want to transfer custom settings, disable the plugin and register it in the folder `./core/plugins`.  
You can find detailed information on configuring and using in the plugin documentation.

#### fastify-accepts

Default: :white_check_mark:  
Documentation: https://github.com/fastify/fastify-accepts

To have accepts in your request object.  
Plugin enabled by default, to deactivate it set: `FST_ACCEPTS = false`.

**Example:**
```js
fastify.get('/', (req, reply) => {
  const accepts = req.accepts()
  reply.code(200).send(accepts)
})
```

#### fastify-compress

Default: :x:  
Documentation: https://github.com/fastify/fastify-compress

Supports gzip, deflate.  
Plugin disabled by default, to activate it set: `FST_COMPRESS=true`.

**Settings:**
```json
{
  "global": true,
  "encodings": ["gzip", "deflate"]
}
```

_It is not recommended to use `fastify-compress` in production, `nginx` is better suited for this purpose._

#### fastify-cors

Default: :x:  
Documentation: https://github.com/fastify/fastify-cors

Enables the use of CORS.  
Plugin disabled by default, to activate it set: `FST_CORS=true`.

#### fastify-helmet

Default: :white_check_mark:  
Documentation: https://github.com/fastify/fastify-helmet

Important security headers.  
Plugin enabled by default, to deactivate it set: `FST_HELMET=false`.

**Settings:**
```json
{
  "referrerPolicy": {"policy": "no-referrer"}
}
```

#### fastify-multipart

Default: :white_check_mark:  
Documentation: https://github.com/fastify/fastify-multipart

Multipart support.  
Plugin enabled by default, to deactivate it set: `FST_MULTIPART=false`.

**Settings:**
```json
{
  "addToBody": true,
  "sharedSchemaId": "multipart"
}
```

**Example:**
```js
fastify.get('/', (req, reply) => {
  console.log(req.body)
  // This will print out:
  // {
  //   myStringField: 'example',
  //   anotherOne: 'example',
  //   myFilenameField: [{
  //     data: <Buffer>,
  //     encoding: '7bit',
  //     filename: 'README.md',
  //     limit: false,
  //     mimetype: 'text/markdown'
  //   }]
  // }
  reply.code(200).send()
})
```

#### fastify-rate-limit

Default: :white_check_mark:  
Documentation: https://github.com/fastify/fastify-rate-limit

A low overhead rate limiter for your routes.  
Plugin enabled by default, to deactivate it set: `FST_RATE_LIMIT=false`.

**Settings:**
```json
{
  "max": 300
}
```

#### fastify-request-context

Default: :white_check_mark:  
Documentation: https://github.com/fastify/fastify-request-context

Request-scoped storage, based on AsyncLocalStorage.  
Plugin enabled by default, to deactivate it set: `FST_CONTEXT=false`.

**Example:**
```js
fastify.addHook('onRequest', (req, reply, done) => {
  req.requestContext.set('user', {id: '000000'})
  done()
})

fastify.get('/', (req, reply) => {
  const user = req.requestContext.get('user')
  reply.code(200).send(user)
})
```

#### fastify-sensible

Default: :white_check_mark:  
Documentation: https://github.com/fastify/fastify-sensible

Adds some useful decorators such as http errors and assertions.  
Plugin enabled by default, to deactivate it set: `FST_SENSIBLE=false`.

**Settings:**
```json
{
  "errorHandler": "!config.debug"
}
```

**Example:**
```js
fastify.get('/', (req, reply) => {
  reply.notFound()
})

fastify.get('/async', async (req, reply) => {
  throw fastify.httpErrors.notFound()
})
```

#### fastify-static

Default: :white_check_mark:  
Documentation: https://github.com/fastify/fastify-static

Plugin for serving static files as fast as possible.  
Plugin enabled by default, to deactivate it set: `FST_STATIC=false`.

**Settings:**
```json
{
  "root": "config.path.static",
  "prefix": "/static",
  "prefixAvoidTrailingSlash": false,
  "wildcard": true,
  "index": false,
  "etag": false,
  "maxAge": "config.debug ? 0 : '180s'",
  "list": false
}
```

**Default route `favicon.ico`:**
```js
fastify.route({
  method: 'GET',
  url: '/favicon.ico',
  schema: {hide: true},
  handler: function (req, reply) {
    reply.sendFile('favicon.ico')
  }
})
```

_By default, URLs for all files located in `./core/static/**/*` are registered._ 

**Example:**
```js
// Serving a file from a different root location
fastify.get('/root', (req, reply) => {
  return reply.sendFile('index.html', path.join(__dirname, 'build'))
})
```

#### point-of-view

Default: :white_check_mark:  
Documentation: https://github.com/fastify/point-of-view

Templates rendering plugin support.  
Plugin enabled by default, to deactivate it set: `FST_RENDER=false`.

**Settings:**
```json
{
  "engine": {
   "ejs": "require('ejs')"
  },
  "root": "config.path.templates"
}
```

_In production mode, templates processed by `html-minifier`._

**Example:**
```js
fastify.get('/', (req, reply) => {
  reply.view('main.html', {text: 'text'})
})

// With async handler be sure to return the result of reply.view
fastify.get('/', async (req, reply) => {
  const t = await something()
  return reply.view('main.html', {text: 'text'})
})
```

## License

Licensed under [MIT](https://github.com/goodvir/fastify-box/blob/master/LICENSE).
