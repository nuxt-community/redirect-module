async function redirectModule(moduleOptions) {
  const options = [
    ...await parseOptions(moduleOptions),
    ...await parseOptions(this.options.redirect)
  ]

  // Transform each "from" value to a RegExp for later test
  const regExpRules = options.map(o => ({ ...o, from: new RegExp(o.from) }))
  const middleware = require('./middleware.js')(regExpRules)

  this.addServerMiddleware(middleware)
}

async function parseOptions(options) {
  if (typeof options === 'function') {
    options = await options()
  }

  if (Object.keys(options).length === 0) {
    return []
  }

  if (!Array.isArray(options)) {
    options = [options]
  }

  return options
}

module.exports = redirectModule
module.exports.meta = require('../package.json')
