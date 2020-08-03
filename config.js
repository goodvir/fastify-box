'use strict'

/*
 * Application settings
 *
 * Once launched, the configuration is available
 * from the fastify.config decorator
 *
 * Settings can be managed through environment
 * variables or the .env file,
 * more details in README.md
 */

require('dotenv').config()
const path = require('path')

const getValue = (name, defaultValue, boolean = false) => {
  const bool = (x) => {
    const param = ['false', '0', 'none', 'null', '']
    return (param.includes(String(x).toLowerCase())) ? false : Boolean(x)
  }
  const val = process.env[name] || defaultValue
  return boolean ? bool(val) : val
}

const config = {
  // Basic settings
  port: getValue('FST_PORT', 3000),
  address: getValue('FST_ADDRESS', '0.0.0.0'),
  maxParamLength: getValue('FST_MAX_PARAM_LENGTH', 300),
  pluginTimeout: getValue('FST_PLUGIN_TIMEOUT', 15000),
  logLevel: getValue('FST_LOG_LEVEL', 'info'),
  debug: process.env.NODE_ENV === 'development',

  // Plugins settings
  plugins: {
    accepts: getValue('FST_ACCEPTS', true, true),
    compress: getValue('FST_COMPRESS', false, true),
    cors: getValue('FST_CORS', false, true),
    helmet: getValue('FST_HELMET', true, true),
    rateLimit: getValue('FST_RATE_LIMIT', true, true),
    sensible: getValue('FST_SENSIBLE', true, true),
    static: getValue('FST_STATIC', true, true),
    render: getValue('FST_RENDER', true, true)
  },

  // Path settings
  path: {
    basedir: __dirname,
    core: path.join(__dirname, 'core'),
    plugins: path.join(__dirname, 'core', 'plugins'),
    services: path.join(__dirname, 'core', 'services'),
    static: path.join(__dirname, 'core', 'static'),
    templates: path.join(__dirname, 'core', 'templates'),
  }
}

module.exports = config
