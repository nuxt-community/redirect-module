const { redirects, baseConfig } = require('./utils')

module.exports = Object.assign({}, baseConfig, {
  modules: [
    [require('../../'), () => redirects]
  ]
})
