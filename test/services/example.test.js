'use strict'

const tap = require('tap')
const buildFastify = require('../../app')

tap.test('GET "/"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'GET',
    url: '/',
    headers: {
      'Accept-Encoding': 'gzip, deflate',
      'X-Trace-Id': 'tap'
    }
  })

  t.equal(res.statusCode, 200, '200')
  t.equal(res.headers['content-encoding'], 'gzip', 'gzip')
  t.equal(res.headers['content-type'], 'text/html; charset=utf-8', 'text/html')
  t.equal(res.headers['x-trace-id'], 'tap', 'x-trace-id')
})

tap.test('GET "/json"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'GET',
    url: '/json'
  })

  t.equal(res.statusCode, 200, '200')
  t.notOk(res.headers['content-encoding'], 'not gzip')
  t.ok(res.headers['x-trace-id'], 'x-trace-id')
  t.ok(res.json(), 'JSON')
})

tap.test('DELETE "/teapot"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'DELETE',
    url: '/teapot'
  })

  t.equal(res.statusCode, 418, '418')
  t.same(res.json(), {statusCode: 418, error: "I'm a Teapot", message: 'Custom message'}, 'ERROR')
})

tap.test('GET "/user"', async (t) => {
  const fastify = buildFastify({logger: {level: 'warn', prettyPrint: true}})

  const res = await fastify.inject({
    method: 'GET',
    url: '/user'
  })

  t.equal(res.statusCode, 200, '200')
  t.ok(res.json(), 'JSON')
})
