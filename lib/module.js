async function redirectModule (moduleOptions) {
  const defaults = {
    rules: [],
    decodeFullUrl: false,
    onDecode: (req, options) => {
      if (!options.decodeFullUrl) {
        return decodeURI(req.url)
      } else {
        let proto = req.headers['x-forwarded-proto']
        if (proto === undefined) {
          proto = req.connection.encrypted ? 'https' : 'http'
        }

        let host = req.headers['x-forwarded-host']
        if (host === undefined) {
          host = req.httpVersionMajor >= 2 ? req.headers[':authority'] : req.headers.host
        }

        return `${proto}://${host}${decodeURI(req.url)}`
      }
    },
    onDecodeError: (error, req, res, next) => next(error),
    statusCode: 302
  }

  const options = {
    ...defaults,
    ...await parseOptions(this.options.redirect),
    ...await parseOptions(moduleOptions)
  }

  options.rules = options.rules.map(rule => ({ ...rule, from: new RegExp(rule.from) }))

  const middleware = require('./middleware.js')(options)
  this.addServerMiddleware(middleware)
}

async function parseOptions (options = {}) {
  if (typeof options === 'function') {
    options = await options()
  }

  if (Object.keys(options).length === 0) {
    return []
  }

  if (Array.isArray(options)) {
    return { rules: options }
  }

  if (typeof options.rules === 'function') {
    options.rules = await options.rules()
  }

  if (options.rules && !Array.isArray(options.rules)) {
    options.rules = [options.rules]
  }

  return options
}

module.exports = redirectModule
module.exports.meta = require('../package.json')
