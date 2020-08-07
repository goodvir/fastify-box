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

// noinspection JSUnusedLocalSymbols
async function exampleService(fastify, options) {
  fastify.get('/', async (req, reply) => {
    reply.view('index.html', {datetime: new Date().toISOString()})
    return reply
  })

  fastify.get('/json', (req, reply) => {
    reply.send({datetime: new Date().toISOString()})
  })
}

module.exports = exampleService
