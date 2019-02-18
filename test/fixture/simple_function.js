const { redirects, baseConfig } = require('./utils')

module.exports = Object.assign({}, baseConfig, {
  modules: [
    { handler: require('../../') }
  ],
  redirect: async () => {
    await Promise.resolve(r => setTimeout(r, 100))
    return redirects
  }
})
