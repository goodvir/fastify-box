'use strict'

const tap = require('tap')
const buildFastify = require('../../../app')

tap.test('GET "/products/55"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'GET',
    url: '/products/55'
  })

  t.equal(res.statusCode, 200, '200')
  t.notOk(res.headers['content-encoding'], 'not gzip')
  t.ok(res.headers['x-trace-id'], 'x-trace-id')
  t.ok(res.json(), 'JSON')
  t.same(
    res.json(),
    {
      id: 55,
      params: {
        size: 100,
        price: 1999,
        lang: 'RU'
      }
    },
    'PRODUCT'
  )
})
