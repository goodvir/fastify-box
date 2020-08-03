'use strict'

/*
 * Example of route registration
 * https://www.fastify.io/docs/latest/Routes/
 *
 * !!! ATTENTION !!!
 * The services folder is intended for registering all fastify
 * entities that must be encapsulated into a narrow section,
 * for global registration use the plugins folder,
 * more details in README.md
 */

// noinspection JSUnusedLocalSymbols
async function exampleService(fastify, options) {

  fastify.get('/', async (request, reply) => {
    reply.view('index.html', {datetime: new Date().toISOString()})
    return reply
  })

  fastify.get('/json', (request, reply) => {
    reply.send({datetime: new Date().toISOString()})
  })

}

module.exports = exampleService
