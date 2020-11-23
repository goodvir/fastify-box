'use strict'

/*
 * Application launch
 * Запуск приложения
 *
 * Fastify: https://www.fastify.io
 * Extend your server: https://www.fastify.io/ecosystem
 */

const config = require('./config')
const server = require('./app')()

// Printing Registered Routes
// Печать зарегистрированных маршрутов
server.addHook('onReady', async () => {
  console.log(`\n${server.printRoutes()}`)
})

// Start server
// Запуск сервера
server.listen(+config.port, config.address, function (e) {
  if (e) {
    console.log(e)
    process.exit(1)
  }
})
