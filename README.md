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

### Application settings

| Setting                | Description                                      | Default           |
|:-----------------------|:-------------------------------------------------|:-----------------:|
| `NODE_ENV`             | Operating modes `string`                         | `unknown`         |
| `FST_PORT`             | Listening port `integer`                         | `3000`            |
| `FST_ADDRESS`          | Listening interface  `string`                    | `0.0.0.0`         |
| `FST_LOG_LEVEL`        | Logging level `string`                           | `info` or `debug` |

### Additional package settings

| Setting          | Description                                                                   | Default |
|:-----------------|:------------------------------------------------------------------------------|:-------:|
| `FST_ACCEPTS`    | [fastify-accepts](https://github.com/fastify/fastify-accepts)                 | `true`  |
| `FST_COMPRESS`   | [fastify-compress](https://github.com/fastify/fastify-compress)               | `false` |
| `FST_CORS`       | [fastify-cors](https://github.com/fastify/fastify-cors)                       | `false` |
| `FST_HELMET`     | [fastify-helmet](https://github.com/fastify/fastify-helmet)                   | `true`  |
| `FST_MULTIPART`  | [fastify-multipart](https://github.com/fastify/fastify-multipart)             | `true`  |
| `FST_RATE_LIMIT` | [fastify-rate-limit](https://github.com/fastify/fastify-rate-limit)           | `true`  |
| `FST_CONTEXT`    | [fastify-request-context](https://github.com/fastify/fastify-request-context) | `true`  |
| `FST_SENSIBLE`   | [fastify-sensible](https://github.com/fastify/fastify-sensible)               | `true`  |
| `FST_STATIC`     | [fastify-static](https://github.com/fastify/fastify-static)                   | `true`  |
| `FST_RENDER`     | [point-of-view](https://github.com/fastify/point-of-view)                     | `true`  |

## Documentation

`<coming soon>`

## License

Licensed under [MIT](https://github.com/goodvir/fastify-box/blob/master/LICENSE).
