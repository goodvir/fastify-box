'use strict'

/*
 * ENG
 * Application settings
 *
 * Once launched, the configuration is available
 * from the fastify.config decorator
 *
 * Settings can be managed through environment
 * variables or the .env file, more details in README.md
 *
 * RUS
 * Настройки приложения
 *
 * После запуска конфигурация доступна
 * из декоратора fastify.config
 *
 * Настройками можно управлять с помощью переменной среды
 * или файла .env, более подробная информация в README.md
 */

require('dotenv').config()
const path = require('path')

// noinspection JSValidateTypes
process.env.UV_THREADPOOL_SIZE = 10

const getValue = (name, defaultValue = null, boolean = false) => {
  const bool = (x) => {
    const param = ['false', '0', 'none', 'null', '']
    return param.includes(String(x).toLowerCase()) ? false : Boolean(x)
  }
  const val = process.env[name] || defaultValue
  return boolean ? bool(val) : val
}

const config = {
  // Basic settings
  // Основные настройки сервера
  port: getValue('FST_PORT', 8080),
  address: getValue('FST_ADDRESS', '0.0.0.0'),
  logLevel: getValue('FST_LOG_LEVEL', process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  debug: process.env.NODE_ENV === 'development',

  // Fastify instance settings
  // Настройки экземпляра fastify
  opts: {
    // Any settings described in the documentation
    // Любые настройки описанные в документации
    // https://www.fastify.io/docs/latest/Server
  },

  // Plugins settings
  // Настройки плагинов
  plugins: {
    accepts: getValue('FST_ACCEPTS', true, true),
    compress: getValue('FST_COMPRESS', false, true),
    cors: getValue('FST_CORS', false, true),
    helmet: getValue('FST_HELMET', true, true),
    multipart: getValue('FST_MULTIPART', true, true),
    rateLimit: getValue('FST_RATE_LIMIT', true, true),
    context: getValue('FST_CONTEXT', true, true),
    sensible: getValue('FST_SENSIBLE', true, true),
    static: getValue('FST_STATIC', true, true),
    render: getValue('FST_RENDER', true, true)
  },

  // Path settings
  // Настройки директорий
  path: {
    basedir: __dirname,
    core: path.join(__dirname, 'core'),
    plugins: path.join(__dirname, 'core', 'plugins'),
    services: path.join(__dirname, 'core', 'services'),
    static: path.join(__dirname, 'core', 'static'),
    templates: path.join(__dirname, 'core', 'templates')
  },

  // Application Information
  // Информация о приложении
  app: {
    name: getValue('FST_APP_NAME', 'instance'),
    release: getValue('FST_APP_RELEASE', 'latest'),
    launch: getValue('FST_APP_LAUNCH', new Date().toISOString())
  },

  // Custom application settings
  // Пользовательские настройки приложения
  custom: {
    // For example, a secret encryption key
    // Например секретный ключ шифрования
    secretKey: getValue('FST_SECRET_KEY', 'you-will-never-guess')
  }
}

module.exports = config
