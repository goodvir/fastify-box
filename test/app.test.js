'use strict'

const tap = require('tap')
const buildFastify = require('../app')

tap.test('GET "/favicon.ico"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'GET',
    url: '/favicon.ico'
  })

  t.equal(res.statusCode, 200, '200')
})

tap.test('GET "/static/logo.png"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'GET',
    url: '/static/logo.png'
  })

  t.equal(res.statusCode, 200, '200')
})

tap.test('GET "/static/not-found.error"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'GET',
    url: '/static/not-found.error'
  })

  t.equal(res.statusCode, 404, '404')
})
