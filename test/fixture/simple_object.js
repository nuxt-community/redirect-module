const { redirects, baseConfig } = require('./utils')

module.exports = Object.assign({}, baseConfig, {
  modules: [
    { handler: require('../../') }
  ],
  redirect: redirects
})
