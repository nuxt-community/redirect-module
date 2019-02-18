async function redirectModule(moduleOptions) {
  if (typeof moduleOptions === 'function') {
    moduleOptions = await moduleOptions()
  }

  if (typeof this.options.redirect === 'function') {
    this.options.redirect = await this.options.redirect()
  }

  const initialRules = Object.assign([], this.options.redirect, moduleOptions)

  // Transform each "from" value to a RegExp for later test
  const regExpRules = initialRules.map(o => Object.assign(o, { from: new RegExp(o.from) }))
  const middleware = require('./middleware.js')(regExpRules)

  this.addServerMiddleware(middleware)
}

module.exports = redirectModule
module.exports.meta = require('../package.json')
