'use strict'

/*
 * Example of plugins registration
 * Пример регистрации плагина
 *
 * https://www.fastify.io/docs/latest/Plugins/
 *
 * !!! ATTENTION !!!
 * In the plugins folder register only global plugins
 * using fastify-plugin for everything else there is a services,
 * more details in README.md
 *
 * !!! ВНИМАНИЕ !!!
 * В папке plugins регистрируются только глобальные плагины c
 * использованием fastify-plugin, для всего остального есть сервисы,
 * подробнее в README.md
 */

const fp = require('fastify-plugin')

// noinspection JSUnusedLocalSymbols
async function examplePlugins(fastify, options) {
  // Example of registering a third party plugin
  // Пример регистрации стороннего плагина
  // fastify.register(require('fastify-mongodb'), {
  //   url: 'mongodb://localhost:27017/test_database'
  // })

  // An example of using the context
  // Пример использования контекста
  fastify.addHook('onRequest', (req, reply, done) => {
    req.requestContext.set('user', {id: '000000'})
    done()
  })
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
// Обертывание функции плагина с помощью fastify-plugin добавляет декораторы и хуки,
// объявленные внутри плагина, в глобальную область видимости.
module.exports = fp(examplePlugins)
