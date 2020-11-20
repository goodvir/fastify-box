'use strict'

const tap = require('tap')
const config = require('../config')

tap.test('Config "getEnvValue"', async (t) => {
  process.env.TEST_VARIABLE = 'example'
  t.equal(config.getEnvValue('TEST_VARIABLE'), 'example', 'type txt')

  process.env.TEST_VARIABLE = 'false'
  t.equal(config.getEnvValue('TEST_VARIABLE', true, true), false, 'boolean false')

  process.env.TEST_VARIABLE = '0'
  t.equal(config.getEnvValue('TEST_VARIABLE', true, true), false, 'boolean false')

  process.env.TEST_VARIABLE = '1'
  t.equal(config.getEnvValue('TEST_VARIABLE', true, true), true, 'boolean true')

  process.env.TEST_VARIABLE = '5456'
  t.equal(+config.getEnvValue('TEST_VARIABLE', 0, false), 5456, 'type number')
})
