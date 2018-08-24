const { redirects, baseConfig } = require('./utils')

module.exports = Object.assign({}, baseConfig, {
  redirect: async () => {
    await Promise.resolve(r => setTimeout(r, 100))
    return redirects
  }
})
