'use strict'

/*
 * Example of plugins registration
 * https://www.fastify.io/docs/latest/Plugins/
 *
 * !!! ATTENTION !!!
 * In the plugins folder register only global plugins
 * using fastify-plugin for everything else there is a services,
 * more details in README.md
 */

const fastifyPlugin = require('fastify-plugin')

// noinspection JSUnusedLocalSymbols
async function examplePlugins(fastify, options) {

  // fastify.register(require('fastify-mongodb'), {
  //   url: 'mongodb://localhost:27017/test_database'
  // })

}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(examplePlugins)
