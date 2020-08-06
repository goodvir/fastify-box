'use strict'

/*
 * Application launch file
 *
 * Loading order of your plugins:
 *
 *      └── plugins (from the Fastify ecosystem)
 *      └── your plugins (your custom plugins)
 *      └── decorators
 *      └── hooks
 *      └── your services
 *
 * Fastify: https://www.fastify.io
 * Extend your server: https://www.fastify.io/ecosystem
 *
 */

const config = require('./config')
const autoLoad = require('fastify-autoload')

// Basic server settings
// https://www.fastify.io/docs/latest/Server
const opts = {
  maxParamLength: config.maxParamLength,
  pluginTimeout: config.pluginTimeout,
  requestIdHeader: 'x-trace-id',
  genReqId: require('hyperid')({fixedLength: true, urlSaf: true}),
  logger: {
    level: config.logLevel,
    prettyPrint: config.debug,
    base: null
  }
}

// Create server
const fastify = require('fastify')(opts)
require('make-promises-safe')

// Loading plugins from the Fastify ecosystem
// To have accepts in your request object.
// https://github.com/fastify/fastify-accepts
if (config.plugins.accepts) fastify.register(require('fastify-accepts'))

// Supports gzip, deflate
// https://github.com/fastify/fastify-compress
if (config.plugins.compress)
  fastify.register(require('fastify-compress'), {
    encodings: ['gzip', 'deflate']
  })

// Enables the use of CORS
// https://github.com/fastify/fastify-cors
if (config.plugins.cors) fastify.register(require('fastify-cors'))

// Important security headers
// https://github.com/fastify/fastify-helmet
if (config.plugins.helmet)
  fastify.register(require('fastify-helmet'), {
    referrerPolicy: {policy: 'no-referrer'}
  })

// Multipart support
// https://github.com/fastify/fastify-multipart
if (config.plugins.multipart)
  fastify.register(require('fastify-multipart'), {
    addToBody: true,
    sharedSchemaId: 'MultipartFileType'
  })

// A low overhead rate limiter for your routes
// https://github.com/fastify/fastify-rate-limit
if (config.plugins.rateLimit)
  fastify.register(require('fastify-rate-limit'), {
    max: 300
  })

// TODO Wait for plugin update for fastify version >=3.0.0
// Request-scoped storage, based on AsyncLocalStorage
// https://github.com/fastify/fastify-request-context
// const {fastifyRequestContextPlugin} = require('fastify-request-context')
// fastify.register(fastifyRequestContextPlugin)

// Adds some useful decorators such as http errors and assertions
// https://github.com/fastify/fastify-sensible
if (config.plugins.sensible)
  fastify.register(require('fastify-sensible'), {
    errorHandler: !config.debug
  })

// Plugin for serving static files as fast as possible
// https://github.com/fastify/fastify-static
if (config.plugins.static) {
  fastify.register(require('fastify-static'), {
    root: config.path.static,
    prefix: '/static/',
    wildcard: false,
    index: false,
    list: false
  })
  fastify.route({
    method: 'GET',
    url: '/favicon.ico',
    handler: function (request, reply) {
      reply.sendFile('favicon.ico')
    }
  })
}

// Templates rendering plugin support
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
fastify.decorate('config', config)

// Adding an identifier to the response header
fastify.addHook('onRequest', (request, reply, done) => {
  reply.header('x-trace-id', request.id)
  done()
})

// Logging the content of requests
fastify.addHook('preHandler', (request, reply, done) => {
  ;['params', 'query', 'body'].forEach((x) => {
    if (request[x] && Object.keys(request[x]).length) request.log.debug(`request ${x}: ${JSON.stringify(request[x])}`)
  })
  done()
})

// Logging the content of response
fastify.addHook('onSend', (request, reply, payload, done) => {
  const err = null
  if (payload && typeof payload === 'string' && payload.length) {
    const pl = payload.length <= 300 ? payload : payload.slice(0, 300) + '...'
    request.log.debug(`payload: ${pl}`)
  }
  done(err, payload)
})

// Registering standard JSON schemas for response
fastify.addSchema({
  $id: 'response',
  success: {
    type: 'object',
    description: 'Success',
    additionalProperties: true,
    example: {}
  },
  200: {
    type: 'object',
    description: 'Success',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 200,
        example: 200
      },
      message: {
        type: 'string',
        default: 'OK',
        example: 'OK'
      }
    }
  },
  201: {
    type: 'object',
    description: 'Created',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 201,
        example: 201
      },
      message: {
        type: 'string',
        default: 'Created',
        example: 'Created'
      }
    }
  },
  202: {
    type: 'object',
    description: 'Accepted',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 202,
        example: 202
      },
      message: {
        type: 'string',
        default: 'Accepted',
        example: 'Accepted'
      }
    }
  },
  204: {
    type: 'null',
    description: 'No Content',
    example: 'No Content'
  },
  400: {
    type: 'object',
    description: 'Bad Request',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 400,
        example: 400
      },
      error: {
        type: 'string',
        default: 'Bad Request',
        example: 'Bad Request'
      },
      message: {
        type: 'string',
        default: 'Bad Request',
        example: 'Bad Request'
      }
    }
  },
  401: {
    type: 'object',
    description: 'Unauthorized',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 401,
        example: 401
      },
      error: {
        type: 'string',
        default: 'Unauthorized',
        example: 'Unauthorized'
      },
      message: {
        type: 'string',
        default: 'Unauthorized',
        example: 'Unauthorized'
      }
    }
  },
  403: {
    type: 'object',
    description: 'Forbidden',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 403,
        example: 403
      },
      error: {
        type: 'string',
        default: 'Forbidden',
        example: 'Forbidden'
      },
      message: {
        type: 'string',
        default: 'Forbidden',
        example: 'Forbidden'
      }
    }
  },
  404: {
    type: 'object',
    description: 'Not Found',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 404,
        example: 404
      },
      error: {
        type: 'string',
        default: 'Not Found',
        example: 'Not Found'
      },
      message: {
        type: 'string',
        default: 'Not Found',
        example: 'Not Found'
      }
    }
  },
  422: {
    type: 'object',
    description: 'Unprocessable Entity',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 422,
        example: 422
      },
      error: {
        type: 'string',
        default: 'Unprocessable Entity',
        example: 'Unprocessable Entity'
      },
      message: {
        type: 'string',
        default: 'Unprocessable Entity',
        example: 'Unprocessable Entity'
      }
    }
  },
  500: {
    type: 'object',
    description: 'Internal Server Error',
    additionalProperties: true,
    properties: {
      statusCode: {
        type: 'integer',
        default: 500,
        example: 500
      },
      error: {
        type: 'string',
        default: 'Internal Server Error',
        example: 'Internal Server Error'
      },
      message: {
        type: 'string',
        default: 'Internal Server Error',
        example: 'Internal Server Error'
      }
    }
  }
})

// Loading your custom plugins [./core/plugins]
fastify.register(autoLoad, {
  dir: config.path.plugins,
  options: Object.assign({}),
  ignorePattern: /^_.*/
})

// Loading your custom services [./core/services]
fastify.register(autoLoad, {
  dir: config.path.services,
  options: Object.assign({}),
  ignorePattern: /^_.*/
})

// Start server
fastify.listen(Number(config.port), String(config.address), function (err) {
  if (err) {
    // noinspection JSUnresolvedFunction
    fastify.log.error(err)
    process.exit(1)
  }
})
