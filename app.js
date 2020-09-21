'use strict'

/*
 * Application launch file
 * Файл запуска приложения
 *
 * Fastify: https://www.fastify.io
 * Extend your server: https://www.fastify.io/ecosystem
 */

const config = require('./config')
const autoLoad = require('fastify-autoload')

// Basic server settings
// Основные настройки сервера
// https://www.fastify.io/docs/latest/Server
// noinspection JSUnusedGlobalSymbols
const opts = Object.assign(
  {
    maxParamLength: 300,
    pluginTimeout: 15000,
    requestIdHeader: 'X-Trace-Id',
    genReqId: require('hyperid')({fixedLength: true, urlSaf: true}),
    logger: {
      level: config.logLevel,
      prettyPrint: config.debug ? {translateTime: 'HH:MM:ss.l'} : false,
      base: null
    }
  },
  config.opts
)

// Create server
// Создание сервера
const fastify = require('fastify')(opts)
require('make-promises-safe')

// To have accepts in your request object
// Плагин управления заголовками запроса
// https://github.com/fastify/fastify-accepts
if (config.plugins.accepts) fastify.register(require('fastify-accepts'))

// Supports gzip, deflate
// Поддержка gzip сжатия ответов
// https://github.com/fastify/fastify-compress
if (config.plugins.compress)
  fastify.register(require('fastify-compress'), {
    global: true,
    encodings: ['gzip', 'deflate']
  })

// Enables the use of CORS
// Поддержка CORS запросов
// https://github.com/fastify/fastify-cors
if (config.plugins.cors) fastify.register(require('fastify-cors'))

// Important security headers
// Настройка заголовков безопасности
// https://github.com/fastify/fastify-helmet
if (config.plugins.helmet)
  fastify.register(require('fastify-helmet'), {
    referrerPolicy: {policy: 'no-referrer'}
  })

// Multipart support
// Поддержка обработки HTML форм
// https://github.com/fastify/fastify-multipart
if (config.plugins.multipart)
  fastify.register(require('fastify-multipart'), {
    addToBody: true,
    sharedSchemaId: 'multipart'
  })

// A low overhead rate limiter for your routes
// Ограничение количества запросов для пользователя
// https://github.com/fastify/fastify-rate-limit
if (config.plugins.rateLimit)
  fastify.register(require('fastify-rate-limit'), {
    max: 300
  })

// Request-scoped storage, based on AsyncLocalStorage
// Создание хранилища привязанного к контексту запроса
// https://github.com/fastify/fastify-request-context
if (config.plugins.context) {
  const {fastifyRequestContextPlugin} = require('fastify-request-context')
  fastify.register(fastifyRequestContextPlugin)
}

// Adds some useful decorators such as http errors and assertions
// Полезные декораторы HTTP ошибок
// https://github.com/fastify/fastify-sensible
if (config.plugins.sensible)
  fastify.register(require('fastify-sensible'), {
    errorHandler: !config.debug
  })

// Plugin for serving static files as fast as possible
// Обслуживание файлов из папки статики
// https://github.com/fastify/fastify-static
if (config.plugins.static) {
  fastify.register(require('fastify-static'), {
    root: config.path.static,
    prefix: '/static',
    prefixAvoidTrailingSlash: false,
    wildcard: true,
    index: false,
    etag: false,
    maxAge: config.debug ? 0 : '180s',
    list: false
  })
  // noinspection JSCheckFunctionSignatures
  fastify.route({
    method: 'GET',
    url: '/favicon.ico',
    schema: {hide: true},
    handler: function (req, reply) {
      reply.sendFile('favicon.ico')
    }
  })
}

// Templates rendering plugin support
// Настройка плагина ejs для шаблонов
// https://github.com/fastify/point-of-view
if (config.plugins.render) {
  const minifier = require('html-minifier')
  const minifierOpts = {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true
  }
  fastify.register(require('point-of-view'), {
    engine: {ejs: require('ejs')},
    root: config.path.templates,
    options: config.debug
      ? {}
      : {
          useHtmlMinifier: minifier,
          htmlMinifierOptions: minifierOpts
        }
  })
}

// Registering a decorator to access settings
// Регистрация декоратора конфигурации
fastify.decorate('config', config)

// Adding an identifier to the response header
// Добавление в заголовки ответа уникального идентификатора
fastify.addHook('onRequest', (req, reply, done) => {
  reply.header('X-Trace-Id', req.id)
  done()
})

// Logging the content of requests
// Печать параметров запроса в режиме FST_LOG_LEVEL='debug'
fastify.addHook('preHandler', (req, reply, done) => {
  const log = {}
  if (req.raw.headers && Object.keys(req.raw.headers).length) log['headers'] = req.raw.headers
  ;['params', 'query', 'body'].forEach((x) => {
    if (req[x] && Object.keys(req[x]).length) log[x] = req[x]
  })
  req.log.debug(log, `parsed request`)
  done()
})

// Logging the content of response
// Печать параметров ответа в режиме FST_LOG_LEVEL='debug'
fastify.addHook('onSend', (req, reply, payload, done) => {
  const log = {}
  log['headers'] = reply.getHeaders()
  log['payload'] = !payload ? null : typeof payload
  if (!!payload && typeof payload === 'string') {
    if (payload.length <= 300) {
      try {
        log['payload'] = JSON.parse(payload.toString())
      } catch (ex) {
        log['payload'] = payload
      }
    } else log['payload'] = payload.toString().slice(0, 300) + '...'
  }
  req.log.debug(log, `parsed response`)
  done(null, payload)
})

// Loading your custom plugins [./core/plugins]
// Загрузка пользовательских плагинов
fastify.register(autoLoad, {
  dir: config.path.plugins,
  ignorePattern: /^_.*/
})

// Loading your custom services [./core/services]
// Загрузка пользовательских сервисов
fastify.register(autoLoad, {
  dir: config.path.services,
  ignorePattern: /^_.*/
})

// Start server
// Запуск сервера
fastify.listen(Number(config.port), String(config.address), function (err) {
  if (err) {
    // noinspection JSUnresolvedFunction
    fastify.log.error(err)
    process.exit(1)
  }
})
