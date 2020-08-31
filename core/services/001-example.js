'use strict'

/*
 * Example of route registration
 * Пример регистрации маршрута
 *
 * https://www.fastify.io/docs/latest/Routes/
 *
 * !!! ATTENTION !!!
 * The services folder is intended for registering all fastify
 * entities that must be encapsulated into a narrow section,
 * for global registration use the plugins folder,
 * more details in README.md
 *
 * !!! ВНИМАНИЕ !!!
 * Папка services предназначена для регистрации всех fastify
 * объектов, которые должны быть доступны только в текущем сервисе,
 * для глобальной регистрации используйте папку plugins,
 * подробнее на README.md
 */

async function exampleService(fastify) {
  // Full declaration route
  // Полное объявление маршрута
  // https://www.fastify.io/docs/latest/Routes/#full-declaration
  fastify.route({
    method: 'GET',
    url: '/',
    handler: function (req, reply) {
      reply.view('main.html', {year: new Date().getFullYear()})
    }
  })

  // Shorthand declaration route
  // Сокращенное объявление маршрута
  // https://www.fastify.io/docs/latest/Routes/#shorthand-declaration
  const opts = {
    schema: {
      response: {
        200: {
          type: 'object',
          additionalProperties: true,
          properties: {
            datetime: {type: 'string'}
          }
        }
      }
    }
  }
  fastify.get('/json', opts, (req, reply) => {
    reply.send({
      headers: req.raw.headers,
      datetime: new Date().toISOString()
    })
  })

  // Shorthand declaration route without options
  // Сокращенное объявление маршрута без опций
  fastify.all('/teapot', (req, reply) => {
    // noinspection JSUnresolvedFunction
    reply.imateapot('Custom message')
  })

  // An example of using the context
  // Пример использования контекста
  fastify.get('/user', function (req, reply) {
    const user = {
      reqGetUser: req.requestContext.get('user'),
      thisGetUser: this.requestContext.get('user'),
      fastifyGetUser: fastify.requestContext.get('user')
    }
    reply.code(200).send(user)
  })
}

module.exports = exampleService
