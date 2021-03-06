'use strict'

/*
 * Create application
 * Файл создания экземпляра приложения
 *
 * Fastify: https://www.fastify.io
 * Extend your server: https://www.fastify.io/ecosystem
 */

const config = require('./config')

module.exports = function (options = {}) {
  // Basic server settings
  // Основные настройки сервера
  // https://www.fastify.io/docs/latest/Server
  // noinspection JSUnusedGlobalSymbols
  const opts = Object.assign(
    {
      maxParamLength: 300,
      pluginTimeout: 15000,
      requestIdHeader: 'x-trace-id',
      genReqId: require('hyperid')({fixedLength: true, urlSaf: true}),
      logger: {
        level: config.logLevel,
        prettyPrint: config.debug ? {translateTime: 'HH:MM:ss.l'} : false,
        base: null
      },
      ajv: {
        // https://ajv.js.org/#options
        customOptions: {
          unknownFormats: ['binary'],
          removeAdditional: true,
          useDefaults: true,
          coerceTypes: true,
          allErrors: false,
          nullable: true
        }
      }
    },
    config.opts,
    options
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
      referrerPolicy: {policy: 'no-referrer'},
      contentSecurityPolicy: false
    })

  // Multipart support
  // Поддержка обработки HTML форм
  // https://github.com/fastify/fastify-multipart
  if (config.plugins.multipart) fastify.register(require('fastify-multipart'))

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
      },
      logLevel: 'warn'
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

  // Loading custom JSON schemas
  // Загрузка пользовательских JSON схем
  // https://www.fastify.io/docs/latest/Validation-and-Serialization
  const glob = require('glob')
  const searchSchemas = glob.sync(config.path.schemas, {nonull: false, debug: false})
  for (const schemaPath of searchSchemas) fastify.addSchema(require(schemaPath))

  // Logging the content of requests
  // Печать параметров запроса в режиме FST_LOG_LEVEL='debug'
  fastify.addHook('preValidation', (req, reply, done) => {
    if (config.logDebugPayload) {
      const log = {}
      if (req.raw.headers && Object.keys(req.raw.headers).length) log['headers'] = req.raw.headers
      ;['params', 'query', 'body'].forEach((x) => {
        if (req[x] && Object.keys(req[x]).length) log[x] = req[x]
      })
      req.log.debug(log, `parsed request`)
    }
    done()
  })

  // Autoload plugin
  // Плагин автозагрузки
  const autoLoad = require('fastify-autoload')

  // Loading your custom plugins [./core/plugins]
  // Загрузка пользовательских плагинов
  fastify.register(
    autoLoad,
    Object.assign(
      {
        dir: config.path.plugins,
        ignorePattern: /^(?:_|lib\.).*/i
      },
      config.autoLoad
    )
  )

  // Loading your custom services [./core/services]
  // Загрузка пользовательских сервисов
  fastify.register(
    autoLoad,
    Object.assign(
      {
        dir: config.path.services,
        ignorePattern: /^(?:_|lib\.).*/i
      },
      config.autoLoad
    )
  )

  // Logging the content of response
  // Печать параметров ответа в режиме FST_LOG_LEVEL='debug'
  fastify.addHook('onSend', (req, reply, payload, done) => {
    if (config.logDebugPayload) {
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
    }
    done(null, payload)
  })

  return fastify
}
