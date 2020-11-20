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
 * подробнее в README.md
 */

async function exampleServiceProducts(fastify) {
  // Full declaration route
  // Полное объявление маршрута
  // https://www.fastify.io/docs/latest/Routes/#full-declaration
  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: async function (req) {
      return {
        id: req.params.id,
        params: {
          size: 100,
          price: 1999,
          lang: 'RU'
        }
      }
    }
  })
}

module.exports = exampleServiceProducts
module.exports.autoload = true

// Для настройки префиксов используйте
// module.exports.autoPrefix = '/something'
// module.exports.prefixOverride = '/overriddenPrefix'
